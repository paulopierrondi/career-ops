import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { APP_ROOT, dataPaths, resolveStateDir } from './config.mjs';
import { buildDashboardModel } from './career-data.mjs';

function defaultApplicationsMarkdown() {
  return [
    '# Applications Tracker',
    '',
    '| # | Date | Company | Role | Score | Status | PDF | Report | Notes |',
    '|---|------|---------|------|-------|--------|-----|--------|-------|',
    '',
  ].join('\n');
}

function defaultPipelineMarkdown() {
  return '## Pendientes\n\n## Procesadas\n';
}

function copyIfPresent(source, target) {
  if (!existsSync(source) || existsSync(target)) return false;
  mkdirSync(path.dirname(target), { recursive: true });
  copyFileSync(source, target);
  return true;
}

function writeIfMissing(target, content) {
  if (existsSync(target)) return false;
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, content, 'utf-8');
  return true;
}

export function ensureState(stateDir = resolveStateDir(), env = process.env) {
  const paths = dataPaths(stateDir);
  for (const dir of [paths.dataDir, paths.reportsDir, paths.outputDir, paths.jdsDir, path.dirname(paths.profile), path.dirname(paths.profileMode)]) {
    mkdirSync(dir, { recursive: true });
  }

  copyIfPresent(path.join(APP_ROOT, 'cv.md'), paths.cv);
  copyIfPresent(path.join(APP_ROOT, 'config', 'profile.yml'), paths.profile);
  copyIfPresent(path.join(APP_ROOT, 'modes', '_profile.md'), paths.profileMode);
  copyIfPresent(path.join(APP_ROOT, 'portals.yml'), paths.portals);
  copyIfPresent(path.join(APP_ROOT, 'app', 'default-portals.yml'), paths.portals);

  writeIfMissing(paths.applications, defaultApplicationsMarkdown());
  writeIfMissing(paths.pipeline, defaultPipelineMarkdown());
  writeIfMissing(paths.profile, 'candidate:\n  full_name: Paulo Pierrondi\n');
  writeIfMissing(paths.profileMode, '# User Profile Context\n');
  writeIfMissing(paths.cv, '# Paulo Pierrondi\n');

  if (env.CAREER_OPS_STATE_DIR) {
    writeIfMissing(path.join(stateDir, '.runtime-state'), `state_dir=${stateDir}\n`);
  }
  return paths;
}

function runProcess(command, args, options) {
  return new Promise((resolve) => {
    const child = spawn(command, args, options);
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', chunk => { stdout += chunk.toString(); });
    child.stderr?.on('data', chunk => { stderr += chunk.toString(); });
    child.on('error', err => resolve({ exitCode: 1, stdout, stderr: `${stderr}\n${err.message}`.trim() }));
    child.on('close', code => resolve({ exitCode: code ?? 0, stdout, stderr }));
  });
}

export function scanCompanyFilters(env = process.env) {
  const raw = env.CAREER_OPS_SCAN_COMPANIES || env.CAREER_OPS_SCAN_COMPANY || '';
  return raw
    .split(',')
    .map(company => company.trim())
    .filter(Boolean);
}

async function runSingleScan({ stateDir, env, verify, company }) {
  const args = [path.join(APP_ROOT, 'scan.mjs')];
  if (company) args.push('--company', company);
  if (verify) args.push('--verify');
  return await runProcess(process.execPath, args, {
    cwd: stateDir,
    env: {
      ...process.env,
      ...env,
      CAREER_OPS_PORTALS: path.join(stateDir, 'portals.yml'),
    },
  });
}

export async function runScan({ stateDir = resolveStateDir(), env = process.env, verify = env.CAREER_OPS_SCAN_VERIFY !== '0' } = {}) {
  ensureState(stateDir, env);
  const companies = scanCompanyFilters(env);
  if (companies.length === 0) return await runSingleScan({ stateDir, env, verify });

  const results = [];
  for (const company of companies) {
    const result = await runSingleScan({ stateDir, env, verify, company });
    results.push({ company, ...result });
  }

  return {
    exitCode: results.some(result => result.exitCode !== 0) ? 1 : 0,
    stdout: results.map(result => [
      `# ${result.company}`,
      result.stdout,
    ].join('\n')).join('\n\n'),
    stderr: results
      .filter(result => result.stderr)
      .map(result => `# ${result.company}\n${result.stderr}`)
      .join('\n\n'),
    results,
  };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function dailyReportMarkdown(model, scanResult) {
  const lines = [
    `# Daily Opportunity Monitor - ${today()}`,
    '',
    `Status: ${scanResult.exitCode === 0 ? 'success' : 'failed'}`,
    '',
    '## Metrics',
    '',
    `- Applications tracked: ${model.metrics.totalApplications}`,
    `- Pending opportunities: ${model.metrics.pendingOpportunities}`,
    `- Human actions: ${model.metrics.humanActions}`,
    `- Top score: ${model.metrics.topScore}`,
    '',
    '## Top Opportunities',
    '',
  ];

  if (model.opportunities.length === 0) {
    lines.push('- No pending opportunities in pipeline.');
  } else {
    for (const opp of model.opportunities.slice(0, 10)) {
      lines.push(`- ${opp.priority} | ${opp.fitScore}/100 | ${opp.company || 'Unknown'} | ${opp.role || 'Unknown role'} | ${opp.url}`);
    }
  }

  const human = model.applications.filter(app => app.needsHumanAction);
  lines.push('', '## Human Gate', '');
  if (human.length === 0) {
    lines.push('- No application currently requires final human action.');
  } else {
    for (const app of human) {
      lines.push(`- #${String(app.number).padStart(3, '0')} | ${app.company} | ${app.role} | ${app.status} | ${app.notes}`);
    }
  }

  lines.push('', '## Scan Output', '', '```text', String(scanResult.stdout || '').slice(-4000), '```');
  if (scanResult.stderr) lines.push('', '## Scan Errors', '', '```text', String(scanResult.stderr).slice(-4000), '```');
  lines.push('', '## Prompt Cache', '', '```yaml', [
    'strategy: cli-prefix-layout',
    'prefix_version: 2026-06-02-career-ops-railway-app',
    'cache_key_or_tag: paulo:career-ops:railway-opportunity-tracker:2026-06-02',
    'cached_tokens: null',
  ].join('\n'), '```');

  return lines.join('\n');
}

export function resolveEmailFrom(env = process.env) {
  return env.CAREER_OPS_EMAIL_FROM || env.AUTH_EMAIL_FROM || env.TRANSACTIONAL_FROM_EMAIL || env.SUPPORT_EMAIL || '';
}

export async function sendDailyEmail({ subject, text, env = process.env }) {
  const apiKey = env.RESEND_API_KEY;
  const from = resolveEmailFrom(env);
  const to = env.CAREER_OPS_EMAIL_TO || 'pierrondi@gmail.com';
  if (!apiKey || !from) return { sent: false, reason: 'EMAIL_FAILED: RESEND_API_KEY or sender missing' };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    return { sent: false, reason: `EMAIL_FAILED: Resend HTTP ${res.status}` };
  }
  return { sent: true };
}

export async function runDailyMonitor({
  stateDir = resolveStateDir(),
  env = process.env,
  scanRunner = runScan,
  emailSender = sendDailyEmail,
} = {}) {
  const paths = ensureState(stateDir, env);
  const scanResult = await scanRunner({ stateDir, env });
  const model = buildDashboardModel(stateDir);
  const report = dailyReportMarkdown(model, scanResult);
  const reportPath = path.join(paths.reportsDir, `daily-monitor-${today()}.md`);
  writeFileSync(reportPath, report, 'utf-8');

  const email = await emailSender({
    subject: `career-ops daily monitor: ${scanResult.exitCode === 0 ? 'success' : 'failed'}`,
    text: report,
    env,
  });

  if (!email.sent) {
    const draftPath = path.join(paths.reportsDir, `daily-monitor-${today()}-EMAIL_FAILED.md`);
    writeFileSync(draftPath, `${report}\n\n${email.reason || 'EMAIL_FAILED'}\n`, 'utf-8');
  }

  return {
    status: scanResult.exitCode === 0 ? 'success' : 'failed',
    reportPath,
    email,
    scan: scanResult,
  };
}

function msUntilNextDailyRun(hourBrt = 8) {
  const now = new Date();
  const target = new Date(now);
  target.setUTCHours((Number(hourBrt) + 3) % 24, 0, 0, 0);
  if (target <= now) target.setUTCDate(target.getUTCDate() + 1);
  return target.getTime() - now.getTime();
}

export function startDailyScheduler({ stateDir = resolveStateDir(), env = process.env, logger = console } = {}) {
  if (env.CAREER_OPS_DAILY_MONITOR === 'disabled') return null;
  const hour = env.CAREER_OPS_DAILY_BRT_HOUR || '8';
  let timer = null;
  const schedule = () => {
    timer = setTimeout(async () => {
      try {
        await runDailyMonitor({ stateDir, env });
      } catch (err) {
        logger.error(`daily monitor failed: ${err.message}`);
      } finally {
        schedule();
      }
    }, msUntilNextDailyRun(hour));
  };
  schedule();
  return {
    stop() {
      if (timer) clearTimeout(timer);
    },
  };
}
