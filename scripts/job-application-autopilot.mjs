#!/usr/bin/env node
/**
 * Daily US AI job application autopilot.
 *
 * Local-only orchestration for n8n:
 * - scans configured sources,
 * - pulls job-alert URLs from the local Google Mail account when available,
 * - evaluates selected pending jobs,
 * - generates a tailored CV PDF, cover letter PDF, answer pack and manifest,
 * - prepares the application for Paulo approval by default,
 * - clicks final submit only when SUBMIT_MODE=auto_submit_low_risk and all gates pass.
 *
 * This is intentionally outside the plugin system. career-ops plugins are
 * human-in-the-loop by contract; Paulo's local n8n autopilot is an explicit
 * private automation with narrower gates and evidence capture.
 */

import { execFileSync } from 'node:child_process';
import {
  appendFileSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load as yamlLoad } from 'js-yaml';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NODE = process.execPath;
const RUN_STARTED_AT = Date.now();
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const AUTOMATION_ID = process.env.AUTOMATION_ID || 'n8n-daily-us-ai-job-applications';
const REPORT_DIR = path.join(ROOT, 'reports', 'job-applications');
const APPROVAL_QUEUE_DIR = path.join(REPORT_DIR, 'approval-queue');
const EVIDENCE_DIR = path.join(ROOT, 'reports', 'application-screenshots');
const PACKAGE_DIR = path.join(ROOT, 'output', 'job-applications');
const PIPELINE_PATH = path.join(ROOT, 'data', 'pipeline.md');
const SCAN_HISTORY_PATH = path.join(ROOT, 'data', 'scan-history.tsv');
const AUTOPILOT_CONFIG_PATH = process.env.N8N_JOB_APPLICATION_CONFIG
  || path.join(ROOT, 'config', 'job-application-autopilot.yml');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const JSON_ONLY = args.includes('--json');
const SELF_TEST = args.includes('--self-test');
const AUTOPILOT_CONFIG = readAutopilotConfig();
const CONFIGURED_DAILY_LIMIT = numberSetting('N8N_JOB_APPLICATION_DAILY_LIMIT', 'daily_limit', 3);

const SETTINGS = {
  dailyLimit: CONFIGURED_DAILY_LIMIT,
  minScore: numberSetting('N8N_JOB_APPLICATION_MIN_SCORE', 'min_score', 4.0),
  autoSubmitScore: numberSetting('N8N_JOB_APPLICATION_AUTO_SUBMIT_SCORE', 'auto_submit_score', 4.2),
  lookbackHours: numberSetting('N8N_JOB_APPLICATION_MAIL_LOOKBACK_HOURS', 'mail_lookback_hours', 30),
  scanEnabled: boolSetting('N8N_JOB_APPLICATION_SCAN_ENABLED', 'scan_enabled', true),
  mailEnabled: boolSetting('N8N_JOB_APPLICATION_MAIL_ENABLED', 'mail_enabled', true),
  submitMode: submitModeEnv(),
  legalAck: boolSetting('N8N_JOB_APPLICATION_LEGAL_ACK_VAI', 'legal_ack_vai', false),
  eeoDecline: boolSetting('N8N_JOB_APPLICATION_EEO_DECLINE_VAI', 'eeo_decline_vai', false),
  headed: boolSetting('N8N_JOB_APPLICATION_HEADED', 'headed', true),
  livenessEnabled: boolSetting('N8N_JOB_APPLICATION_LIVENESS_ENABLED', 'liveness_enabled', true),
  maxAttempts: numberSetting(
    'N8N_JOB_APPLICATION_MAX_ATTEMPTS',
    'max_attempts',
    CONFIGURED_DAILY_LIMIT <= 0
      ? 0
      : Math.max(CONFIGURED_DAILY_LIMIT * 10, 20),
  ),
  runTimeoutSeconds: numberSetting('N8N_JOB_APPLICATION_TIMEOUT_SECONDS', 'timeout_seconds', 15 * 60),
};

const TARGET_KEYWORDS = [
  'ai',
  'artificial intelligence',
  'agent',
  'agentic',
  'genai',
  'llm',
  'client director',
  'client executive',
  'account director',
  'account executive',
  'strategic account executive',
  'enterprise account executive',
  'sales director',
  'enterprise sales',
  'ai sales',
  'gtm',
  'solutions architect',
  'solutions engineer',
  'customer engineer',
  'forward deployed',
  'field ai',
  'applied ai',
  'transformation',
];

const BLOCKED_TITLE_KEYWORDS = [
  'sdr',
  'bdr',
  'sales development',
  'business development representative',
  'junior',
  'intern',
  'internship',
  'entry level',
];

const COMMERCIAL_OR_APPLIED_ROLE_SIGNALS = [
  'account',
  'adoption',
  'architect',
  'client',
  'consultant',
  'customer',
  'deployment',
  'enterprise',
  'field',
  'forward deployed',
  'gtm',
  'implementation',
  'revenue',
  'sales',
  'solution',
  'solutions',
  'strategic',
  'technical account',
  'transformation',
];

const PURE_RESEARCH_ROLE_PATTERNS = [
  /\bai researcher\b/i,
  /\bmachine learning researcher\b/i,
  /\bml researcher\b/i,
  /\bresearch engineer\b/i,
  /\bresearch scientist\b/i,
  /\bscientist\b/i,
  /\bmultimodal llms?\b/i,
];

const APPLICATION_HARD_BLOCKS = [
  {
    id: 'servicenow_brazil',
    company: /service\s*now|servicenow/i,
    scope: /brasil|brazil|s[aã]o paulo|\bsp\b|rio de janeiro|\brj\b|brazilian|portuguese|portugu[eê]s|latin america|latam/i,
    reason: 'Paulo authorization excludes applying to ServiceNow Brazil',
  },
  {
    id: 'elevenlabs',
    company: /eleven\s*labs|elevenlabs/i,
    scope: /./i,
    reason: 'Paulo authorization excludes applying to ElevenLabs',
  },
];

const PIPELINE_SKELETON = `# Pipeline - Pending URLs

Paste job URLs below as \`- [ ] {url}\` then run \`/career-ops pipeline\`.

## Pending

## Processed
`;

function numberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? value : fallback;
}

function boolEnv(name, fallback) {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  return !/^(0|false|no|off)$/i.test(raw);
}

function readAutopilotConfig() {
  if (!existsSync(AUTOPILOT_CONFIG_PATH)) return {};
  const raw = readText(AUTOPILOT_CONFIG_PATH);
  if (!raw.trim()) return {};
  try {
    return yamlLoad(raw) || {};
  } catch (error) {
    console.error(`WARN failed to parse ${AUTOPILOT_CONFIG_PATH}: ${redact(error.message)}`);
    return {};
  }
}

function numberSetting(envName, configKey, fallback) {
  const envValue = process.env[envName];
  if (envValue != null && envValue !== '') {
    const parsed = Number(envValue);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const configValue = AUTOPILOT_CONFIG?.[configKey];
  if (configValue != null && configValue !== '') {
    const parsed = Number(configValue);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function boolSetting(envName, configKey, fallback) {
  const envValue = process.env[envName];
  if (envValue != null && envValue !== '') return !/^(0|false|no|off)$/i.test(String(envValue));
  const configValue = AUTOPILOT_CONFIG?.[configKey];
  if (configValue != null && configValue !== '') return !/^(0|false|no|off)$/i.test(String(configValue));
  return fallback;
}

function submitModeEnv() {
  const raw = String(
    process.env.SUBMIT_MODE
      || process.env.N8N_JOB_APPLICATION_SUBMIT_MODE
      || AUTOPILOT_CONFIG?.submit_mode
      || 'ready_for_submit',
  )
    .trim()
    .toLowerCase();
  if (raw === 'auto_submit_low_risk') return raw;
  return 'ready_for_submit';
}

function startRunTimeout() {
  if (SELF_TEST || SETTINGS.runTimeoutSeconds <= 0) return null;
  return setTimeout(() => {
    const elapsedSeconds = Math.round((Date.now() - RUN_STARTED_AT) / 1000);
    console.error(
      `ERROR ${AUTOMATION_ID} exceeded N8N_JOB_APPLICATION_TIMEOUT_SECONDS=${SETTINGS.runTimeoutSeconds}s ` +
        `after ${elapsedSeconds}s; exiting to prevent an unbounded run.`,
    );
    process.exit(124);
  }, SETTINGS.runTimeoutSeconds * 1000);
}

function ensureDirs() {
  mkdirSync(path.join(ROOT, 'data'), { recursive: true });
  mkdirSync(REPORT_DIR, { recursive: true });
  mkdirSync(APPROVAL_QUEUE_DIR, { recursive: true });
  mkdirSync(EVIDENCE_DIR, { recursive: true });
  mkdirSync(PACKAGE_DIR, { recursive: true });
}

function slugify(value, fallback = 'item') {
  const slug = String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
  return slug || fallback;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function redact(value) {
  return String(value || '')
    .replace(/(api[_-]?key|token|secret|password|cookie)=([^ \n]+)/ig, '$1=[REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, 'Bearer [REDACTED]');
}

function markdownCell(value, limit = 220) {
  return String(value ?? '')
    .replace(/\r?\n/g, ' ')
    .replace(/\|/g, '/')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limit);
}

function run(command, commandArgs, options = {}) {
  const started = Date.now();
  try {
    const stdout = execFileSync(command, commandArgs, {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: options.timeout ?? 900000,
      maxBuffer: options.maxBuffer ?? 1024 * 1024 * 20,
      env: { ...process.env, ...options.env },
    });
    return { ok: true, stdout, stderr: '', ms: Date.now() - started };
  } catch (error) {
    const stdout = error.stdout ? String(error.stdout) : '';
    const stderr = error.stderr ? String(error.stderr) : '';
    if (options.allowFail) {
      return {
        ok: false,
        code: error.status ?? error.code ?? 1,
        stdout,
        stderr,
        error: error.message,
        ms: Date.now() - started,
      };
    }
    throw error;
  }
}

function readText(relOrAbs, fallback = '') {
  const full = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(ROOT, relOrAbs);
  return existsSync(full) ? readFileSync(full, 'utf8') : fallback;
}

function readJson(relOrAbs, fallback = null) {
  const raw = readText(relOrAbs, '');
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function nestedFiles(dir, predicate) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...nestedFiles(full, predicate));
    else if (predicate(entry.name, full)) out.push(full);
  }
  return out.sort();
}

function readProfile() {
  const raw = readText('config/profile.yml');
  const parsed = raw ? yamlLoad(raw) : {};
  return parsed || {};
}

function candidateFromProfile(profile, cvText) {
  const fullName = profile?.candidate?.full_name || 'Paulo Pierrondi';
  const [firstName, ...lastParts] = fullName.split(/\s+/);
  const cvPhone = (cvText.match(/\|\s*(\+?\d[\d\s()+-]{8,})\s*\|/) || [])[1]?.trim() || '';
  return {
    fullName,
    firstName: firstName || 'Paulo',
    lastName: lastParts.join(' ') || 'Pierrondi',
    email: profile?.candidate?.email || 'pierrondi@gmail.com',
    phone: profile?.candidate?.phone || cvPhone,
    location: profile?.candidate?.location || profile?.location?.current_location || 'Sao Jose dos Campos, Sao Paulo, Brazil',
    linkedin: profile?.candidate?.linkedin || 'https://br.linkedin.com/in/paulopierrondi',
    portfolio: profile?.candidate?.portfolio_url || 'https://pierrondi.dev',
    github: profile?.candidate?.github || '',
  };
}

function ensurePipeline() {
  if (!existsSync(PIPELINE_PATH)) writeFileSync(PIPELINE_PATH, PIPELINE_SKELETON, 'utf8');
  if (!existsSync(SCAN_HISTORY_PATH)) {
    writeFileSync(SCAN_HISTORY_PATH, 'url\tfirst_seen\tportal\ttitle\tcompany\tstatus\tlocation\n', 'utf8');
  }
}

function readPipelinePending() {
  ensurePipeline();
  const content = readText(PIPELINE_PATH);
  const pending = [];
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^- \[ \] (.+)$/);
    if (!match) continue;
    const parts = match[1].split(' | ').map((part) => part.trim());
    pending.push({
      url: parts[0] || '',
      company: parts[1] || companyFromUrl(parts[0]) || 'Unknown',
      role: parts[2] || 'Unknown',
      location: parts[3] || '',
      compensation: parts[4] || '',
      source: 'pipeline',
    });
  }
  return pending.filter((item) => /^https?:\/\//i.test(item.url));
}

function appendToPipeline(offers) {
  if (!offers.length) return 0;
  ensurePipeline();
  const pipeline = readText(PIPELINE_PATH);
  const history = readText(SCAN_HISTORY_PATH);
  const seen = new Set([
    ...pipeline.matchAll(/https?:\/\/[^\s|)]+/g),
    ...history.matchAll(/^([^\t]+)\t/gm),
  ].map((match) => match[0].replace(/\t$/, '')));

  const fresh = offers.filter((offer) => offer.url && !seen.has(offer.url));
  if (!fresh.length) return 0;

  const pendingBlock = fresh.map((offer) => (
    `- [ ] ${offer.url} | ${offer.company || companyFromUrl(offer.url) || 'Gmail'} | ${offer.role || 'Job alert'} | ${offer.location || ''}`
  )).join('\n');

  let nextPipeline = pipeline;
  const pendingIdx = nextPipeline.indexOf('## Pending');
  if (pendingIdx === -1) {
    nextPipeline += `\n## Pending\n\n${pendingBlock}\n`;
  } else {
    const nextSection = nextPipeline.indexOf('\n## ', pendingIdx + '## Pending'.length);
    const insertAt = nextSection === -1 ? nextPipeline.length : nextSection;
    nextPipeline = `${nextPipeline.slice(0, insertAt).replace(/\s*$/, '\n')}${pendingBlock}\n${nextPipeline.slice(insertAt)}`;
  }
  if (!DRY_RUN) writeFileSync(PIPELINE_PATH, nextPipeline, 'utf8');

  const today = new Date().toISOString().slice(0, 10);
  const rows = fresh.map((offer) => [
    offer.url,
    today,
    offer.source || 'gmail',
    offer.role || 'Job alert',
    offer.company || companyFromUrl(offer.url) || 'Unknown',
    'added',
    offer.location || '',
  ].map((field) => String(field).replace(/\t/g, ' ').replace(/\n/g, ' ')).join('\t')).join('\n');
  if (!DRY_RUN) appendFileSync(SCAN_HISTORY_PATH, `${rows}\n`, 'utf8');
  return fresh.length;
}

function archivePipelineUrls(items) {
  const archiveable = items.filter(isStalePipelineResult);
  if (!archiveable.length || DRY_RUN) return 0;

  const archiveByUrl = new Map(archiveable.map((item) => [item.url, item]));
  const lines = readText(PIPELINE_PATH).split(/\r?\n/);
  const next = lines.map((line) => {
    const match = line.match(/^- \[ \] (https?:\/\/[^\s|]+)(.*)$/);
    if (!match) return line;
    const item = archiveByUrl.get(match[1]);
    if (!item) return line;
    const score = item.score ? ` | ${item.score}/5` : '';
    const reason = String(item.blocker || item.status || 'processed')
      .replace(/\s+/g, ' ')
      .replace(/\|/g, '/')
      .slice(0, 180);
    return `- [x] ${match[1]}${match[2]}${score} | Auto-archived ${new Date().toISOString().slice(0, 10)}: ${reason}`;
  });
  writeFileSync(PIPELINE_PATH, `${next.join('\n').replace(/\s+$/, '')}\n`, 'utf8');
  return archiveable.length;
}

function isStalePipelineResult(item) {
  return (
    ['skipped_expired', 'skipped_already_submitted', 'skipped_previous_attempt', 'skipped_not_target', 'evaluated'].includes(item.status)
    || (item.status === 'blocked' && /liveness failed|no visible apply control|expired|404|work authorization|no sponsorship|unable to sponsor|not able to provide sponsorship|possible spam|anti-automation|ats spam/i.test(item.blocker || ''))
  );
}

function applicationUrlKey(raw) {
  try {
    const url = new URL(String(raw || '').trim());
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|gh_src|source|ref|referrer|campaign|trk|email|job_alert)/i.test(key)) {
        url.searchParams.delete(key);
      }
    }
    const query = url.searchParams.toString();
    const pathname = url.pathname.replace(/\/+$/, '');
    return `${url.origin}${pathname}${query ? `?${query}` : ''}`.toLowerCase();
  } catch {
    return String(raw || '').trim().replace(/\/+$/, '').toLowerCase();
  }
}

function submittedApplicationIndex() {
  const byUrl = new Map();
  const remember = (entry, sourcePath) => {
    if (!entry?.url) return;
    const submitted = entry.submitted === true || entry.application_status === 'submitted' || entry.status === 'submitted';
    if (!submitted) return;
    byUrl.set(applicationUrlKey(entry.url), {
      url: entry.url,
      company: entry.company || '',
      role: entry.role || '',
      submitted_at: entry.submitted_at || entry.timestamp || entry.started_at || '',
      evidence_path: entry.submission_evidence_path || entry.confirmation_path || entry.evidence_path || '',
      report_path: entry.submission_report_path || entry.report_path || '',
      manifest_path: entry.manifest_path || '',
      source_path: path.relative(ROOT, sourcePath),
    });
  };

  for (const file of nestedFiles(PACKAGE_DIR, (name) => name.endsWith('-manifest.json'))) {
    remember(readJson(file, null), file);
  }
  for (const file of nestedFiles(REPORT_DIR, (name) => /^\d{4}-\d{2}-\d{2}-.+n8n-daily-us-ai-job-applications\.json$/.test(name))) {
    const data = readJson(file, null);
    remember(data, file);
    for (const item of Array.isArray(data?.processed) ? data.processed : []) {
      remember(item, file);
    }
  }
  return byUrl;
}

function previousApplicationAttemptIndex() {
  const byUrl = new Map();
  const remember = (entry, sourcePath) => {
    if (!entry?.url) return;
    const submitted = entry.submitted === true || entry.application_status === 'submitted' || entry.status === 'submitted';
    if (submitted) return;
    const status = String(entry.status || '');
    const applicationStatus = String(entry.application_status || '');
    const actionable = ['ready_for_submit', 'draft_ready', 'blocked'].includes(status)
      || /blocked_|form_filled_|package_ready_|submit_click_without_confirmation/i.test(applicationStatus);
    if (!actionable) return;
    byUrl.set(applicationUrlKey(entry.url), {
      url: entry.url,
      company: entry.company || '',
      role: entry.role || '',
      status,
      application_status: applicationStatus,
      blocker: entry.blocker || '',
      report_path: entry.report_path || '',
      approval_queue_path: entry.approval_queue_path || '',
      evidence_path: entry.confirmation_path || entry.evidence_path || '',
      source_path: path.relative(ROOT, sourcePath),
    });
  };

  for (const file of nestedFiles(PACKAGE_DIR, (name) => name.endsWith('-manifest.json'))) {
    remember(readJson(file, null), file);
  }
  for (const file of nestedFiles(REPORT_DIR, (name) => /^\d{4}-\d{2}-\d{2}-.+n8n-daily-us-ai-job-applications\.json$/.test(name))) {
    const data = readJson(file, null);
    remember(data, file);
    for (const item of Array.isArray(data?.processed) ? data.processed : []) {
      remember(item, file);
    }
  }
  return byUrl;
}

function companyFromUrl(raw) {
  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, '');
    const firstPath = url.pathname.split('/').filter(Boolean)[0];
    if (/greenhouse|ashbyhq|lever/.test(host) && firstPath) return titleCase(firstPath);
    return titleCase(host.split('.')[0]);
  } catch {
    return '';
  }
}

function titleCase(value) {
  return String(value || '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isTarget(item) {
  const haystack = `${item.company} ${item.role} ${item.location} ${item.url}`.toLowerCase();
  if (applicationHardBlock(item)) return false;
  if (BLOCKED_TITLE_KEYWORDS.some((keyword) => haystack.includes(keyword))) return false;
  if (isPureResearchRole(item)) return false;
  return TARGET_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

function isPureResearchRole(item) {
  const role = String(item.role || '');
  const haystack = `${item.company || ''} ${item.role || ''} ${item.location || ''} ${item.url || ''}`.toLowerCase();
  if (!PURE_RESEARCH_ROLE_PATTERNS.some((pattern) => pattern.test(role))) return false;
  return !COMMERCIAL_OR_APPLIED_ROLE_SIGNALS.some((signal) => haystack.includes(signal));
}

function notTargetReason(item) {
  const hardBlock = applicationHardBlock(item);
  if (hardBlock) return hardBlock.reason;
  const haystack = `${item.company || ''} ${item.role || ''} ${item.location || ''} ${item.url || ''}`.toLowerCase();
  const blockedKeyword = BLOCKED_TITLE_KEYWORDS.find((keyword) => haystack.includes(keyword));
  if (blockedKeyword) return `blocked title keyword: ${blockedKeyword}`;
  if (isPureResearchRole(item)) return 'pure ML/research role outside Paulo target lanes';
  return 'not enough AI GTM, solutions, enterprise, agentic, or forward-deployed signal for the current profile';
}

function applicationHardBlock(item) {
  const haystack = `${item.company || ''} ${item.role || ''} ${item.location || ''} ${item.url || ''}`;
  for (const block of APPLICATION_HARD_BLOCKS) {
    if (block.company.test(haystack) && block.scope.test(haystack)) {
      return { id: block.id, reason: block.reason };
    }
  }
  return null;
}

function extractJobUrlsFromMail() {
  if (!SETTINGS.mailEnabled) return { ok: true, offers: [], skipped: 'mail-disabled' };
  const script = `
ObjC.import('Foundation');
const Mail = Application('Mail');
const hours = Number(ObjC.unwrap($.NSProcessInfo.processInfo.environment.objectForKey('N8N_JOB_APPLICATION_MAIL_LOOKBACK_HOURS')) || ${SETTINGS.lookbackHours});
const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
const accounts = Mail.accounts.whose({ name: 'Google' })();
if (!accounts.length) JSON.stringify({ ok: false, error: 'Google Mail account not found', offers: [] });
else {
  const inbox = accounts[0].mailboxes.whose({ name: 'INBOX' })()[0];
  const messages = inbox ? inbox.messages().slice(-300) : [];
  const offers = [];
  const urlRe = /https?:\\/\\/[^\\s"'<>]+/g;
  const sourceRe = /(job alert|jobs|career|careers|greenhouse|ashby|lever|workday|linkedin|otta|wellfound|ycombinator|work at a startup)/i;
  const targetRe = /(ai|agent|llm|genai|client director|account executive|account director|enterprise sales|strategic account|sales director|gtm|solutions architect|forward deployed|customer engineer|applied ai)/i;
  for (const msg of messages) {
    const date = msg.dateReceived();
    if (date && date < cutoff) continue;
    const subject = String(msg.subject() || '');
    const sender = String(msg.sender() || '');
    if (!sourceRe.test(subject + ' ' + sender)) continue;
    const content = String(msg.content() || '');
    if (!targetRe.test(subject + ' ' + content)) continue;
    const urls = [...new Set((content.match(urlRe) || []).map((u) => u.replace(/[).,;]+$/g, '')))];
    for (const url of urls) {
      if (!/(jobs?|careers?|greenhouse|ashby|lever|workday|linkedin|wellfound|ycombinator|workatastartup)/i.test(url)) continue;
      offers.push({ url, company: 'Gmail Alert', role: subject.slice(0, 120), source: 'gmail-job-alert' });
    }
  }
  JSON.stringify({ ok: true, offers });
}
`;

  try {
    return JSON.parse(execFileSync('osascript', ['-l', 'JavaScript'], {
      input: script,
      encoding: 'utf8',
      timeout: 90000,
      maxBuffer: 1024 * 1024 * 5,
      env: { ...process.env, N8N_JOB_APPLICATION_MAIL_LOOKBACK_HOURS: String(SETTINGS.lookbackHours) },
    }));
  } catch (error) {
    return { ok: false, offers: [], error: redact(error.message) };
  }
}

function runScan() {
  if (!SETTINGS.scanEnabled) return { ok: true, skipped: 'scan-disabled', stdout: '' };
  return run(NODE, ['scan.mjs'], { allowFail: true, timeout: 900000 });
}

function checkLiveness(url) {
  if (!SETTINGS.livenessEnabled) return { ok: true, skipped: 'liveness-disabled' };
  const result = run(NODE, ['check-liveness.mjs', '--no-fallback', url], {
    allowFail: true,
    timeout: 180000,
  });
  const text = `${result.stdout}\n${result.stderr}`;
  const expired = /(?:❌\s*expired|pattern matched:\s*this job has expired|HTTP\s*404|job has expired|posting.*closed|no longer accepting)/i.test(text);
  const uncertain = /(?:⚠️\s*uncertain|content present but no visible apply control found)/i.test(text);
  return {
    ok: result.ok && !expired && !uncertain,
    expired,
    uncertain,
    output: redact(text).slice(-1800),
  };
}

async function evaluateUrl(item) {
  const attempts = [];
  if (process.env.OPENROUTER_API_KEY) {
    const result = run(NODE, ['openrouter-runner.mjs', 'evaluate', item.url], {
      allowFail: true,
      timeout: 1200000,
      maxBuffer: 1024 * 1024 * 30,
    });
    const reportMatch = result.stdout.match(/Report saved:\s+([^\n]+)/);
    const reportPath = reportMatch ? reportMatch[1].trim() : '';
    if (result.ok && reportPath) {
      return {
        ok: true,
        reportPath,
        stdoutTail: redact(result.stdout).slice(-3000),
        stderrTail: redact(result.stderr).slice(-3000),
        error: '',
      };
    }
    attempts.push(`openrouter: ${redact(result.stderr || result.stdout || result.error).slice(-1200)}`);
  } else {
    attempts.push('openrouter: OPENROUTER_API_KEY not present in local env');
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      ok: false,
      reportPath: '',
      stdoutTail: attempts.join('\n'),
      stderrTail: '',
      error: 'No evaluation provider key available',
    };
  }

  const jd = await fetchJobText(item);
  if (!jd.ok) {
    return {
      ok: false,
      reportPath: '',
      stdoutTail: attempts.join('\n'),
      stderrTail: jd.error,
      error: 'Could not fetch JD text for OpenAI fallback',
    };
  }

  const jdPath = path.join(REPORT_DIR, `${RUN_ID}-${slugify(item.company)}-${slugify(item.role)}-jd.txt`);
  if (!DRY_RUN) {
    writeFileSync(jdPath, [
      `Company: ${item.company || companyFromUrl(item.url) || 'Unknown'}`,
      `Role: ${item.role || 'Unknown role'}`,
      `URL: ${item.url}`,
      '',
      jd.text,
    ].join('\n'), 'utf8');
  }

  const result = run(NODE, ['openai-eval.mjs', '--file', jdPath], {
    allowFail: true,
    timeout: 1200000,
    maxBuffer: 1024 * 1024 * 30,
  });
  const reportMatch = result.stdout.match(/Report saved:\s+(reports\/[^\n]+)/);
  const reportPath = reportMatch ? reportMatch[1].trim() : '';
  return {
    ok: result.ok && Boolean(reportPath),
    reportPath,
    stdoutTail: redact(result.stdout).slice(-3000),
    stderrTail: redact(result.stderr).slice(-3000),
    error: redact(result.error || attempts.join('\n')),
  };
}

async function fetchJobText(item) {
  const result = run('curl', [
    '-L',
    '--max-time',
    '60',
    '-A',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/145 Safari/537.36',
    item.url,
  ], {
    allowFail: true,
    timeout: 90000,
    maxBuffer: 1024 * 1024 * 8,
  });
  if (!result.ok || !result.stdout) {
    return { ok: false, text: '', error: redact(result.stderr || result.error || 'curl failed') };
  }
  const text = htmlToText(result.stdout);
  if (text.length < 400) {
    const browserText = await fetchJobTextWithBrowser(item);
    if (browserText.ok) return browserText;
    return { ok: false, text, error: browserText.error || 'fetched content too short to evaluate' };
  }
  return { ok: true, text: text.slice(0, 45000), error: '' };
}

async function fetchJobTextWithBrowser(item) {
  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    return { ok: false, text: '', error: `Playwright unavailable for browser JD fetch: ${error.message}` };
  }
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1800 } });
  try {
    await page.goto(item.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(3500);
    const body = await safeBodyText(page);
    const text = htmlToText(body);
    if (text.length < 400) return { ok: false, text, error: 'browser-rendered content too short to evaluate' };
    return { ok: true, text: text.slice(0, 45000), error: '' };
  } catch (error) {
    return { ok: false, text: '', error: `browser JD fetch failed: ${redact(error.message)}` };
  } finally {
    await browser.close().catch(() => {});
  }
}

function htmlToText(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|section|article|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function parseScore(reportText) {
  const patterns = [
    /(?:global|overall|score|puntuaci[oó]n)[^\d\n]{0,40}(\d(?:\.\d)?)\s*\/\s*5/i,
    /\b(\d(?:\.\d)?)\s*\/\s*5\b/,
    /"score"\s*:\s*(\d(?:\.\d)?)/i,
  ];
  for (const pattern of patterns) {
    const match = reportText.match(pattern);
    if (match) {
      const value = Number(match[1]);
      if (Number.isFinite(value)) return value;
    }
  }
  return 0;
}

function parseReportNum(reportPath) {
  const base = path.basename(reportPath || '');
  return (base.match(/^(\d+)/) || [])[1] || '';
}

function reportCompanyRole(item, reportText) {
  const company =
    (reportText.match(/\*\*Company:\*\*\s*([^\n]+)/i) || [])[1]?.trim()
    || (reportText.match(/^#\s+(.+?)\s+[—-]\s+(.+)$/m) || [])[1]?.trim()
    || item.company
    || companyFromUrl(item.url)
    || 'Unknown';
  const role =
    (reportText.match(/\*\*Role:\*\*\s*([^\n]+)/i) || [])[1]?.trim()
    || (reportText.match(/^#\s+(.+?)\s+[—-]\s+(.+)$/m) || [])[2]?.trim()
    || item.role
    || 'Unknown role';
  return { company, role };
}

function extractSection(text, start, endPattern) {
  const idx = text.indexOf(start);
  if (idx === -1) return '';
  const after = text.slice(idx + start.length);
  const end = after.search(endPattern);
  return (end === -1 ? after : after.slice(0, end)).trim();
}

function bulletsFrom(text, max = 8) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[•*-]\s*/, '').trim())
    .filter((line) => line.length > 10)
    .slice(0, max);
}

function buildExperienceHtml(cvText) {
  const exp = extractSection(cvText, 'EXPERIENCE', /\nEDUCATION\b/);
  const chunks = exp.split(/\n(?=[A-Z][^\n]+ - [^-]+ - [^\n]+\| )/).filter(Boolean).slice(0, 6);
  return chunks.map((chunk) => {
    const [header, ...rest] = chunk.trim().split(/\r?\n/);
    const [left, period = ''] = header.split('|').map((part) => part.trim());
    const pieces = left.split(' - ').map((part) => part.trim());
    const role = pieces[0] || left;
    const company = pieces[1] || '';
    const location = pieces.slice(2).join(' - ');
    const bullets = bulletsFrom(rest.join('\n'), 6);
    return `<div class="job">
      <div class="job-header"><div class="job-company">${escapeHtml(company || role)}</div><div class="job-period">${escapeHtml(period)}</div></div>
      <div class="job-role">${escapeHtml(company ? role : '')}${location ? ` <span class="job-location">- ${escapeHtml(location)}</span>` : ''}</div>
      <ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>
    </div>`;
  }).join('\n');
}

function fillTemplate(template, replacements) {
  let html = template;
  for (const [key, value] of Object.entries(replacements)) {
    html = html.split(`{{${key}}}`).join(value);
  }
  return html.replace(/\{\{PHOTO\}\}/g, '').replace(/\{\{[^}]+\}\}/g, '');
}

function uniqueList(items, max = 12) {
  const seen = new Set();
  const out = [];
  for (const item of items.filter(Boolean)) {
    const value = String(item).trim();
    const key = value.toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
    if (out.length >= max) break;
  }
  return out;
}

function applicationPositioning({ role, company, reportText, profile }) {
  const text = `${role || ''} ${company || ''} ${reportText || ''}`;
  const catalog = [
    {
      name: 'Enterprise AI GTM',
      test: /account executive|sales|gtm|revenue|pipeline|enterprise buyer|strategic account|client director/i,
      keywords: ['enterprise AI GTM', 'strategic accounts', 'executive discovery', 'pipeline creation', 'technical value narrative'],
      proof: '15+ years across enterprise software, ServiceNow advisory, Oracle cloud architecture and regulated operating models; influenced $5M+ in pipeline through executive and technical stakeholder alignment.',
      fit: 'I can sell AI credibly because I understand the buying motion, the architecture questions and the operating-model work needed after the demo.',
    },
    {
      name: 'Agentic AI Solutions',
      test: /agent|agentic|workflow|automation|orchestration|llm|ai platform|implementation|solution architect/i,
      keywords: ['agentic AI', 'LLM workflows', 'solution architecture', 'workflow orchestration', 'human approval gates'],
      proof: 'Built and operate governed multi-agent workflows with role separation, durable context, execution control, human approval gates, secret boundaries and reusable evidence.',
      fit: 'I turn agentic AI from demo into implementation motion: use-case selection, architecture, controls, delivery rhythm and adoption evidence.',
    },
    {
      name: 'Forward Deployed AI',
      test: /forward deployed|field|customer engineer|solutions engineer|prototype|implementation|deployment|customer-facing/i,
      keywords: ['forward deployed AI', 'customer discovery', 'prototype-to-value', 'stakeholder alignment', 'delivery operating model'],
      proof: 'Worked across executives, solution teams, services, partners and delivery groups to translate business pain into credible technical adoption plans.',
      fit: 'I can sit with customers, shape the problem, translate it into an architecture and keep the delivery path tied to measurable adoption.',
    },
    {
      name: 'AI Transformation',
      test: /transformation|adoption|governance|operating model|change|value realization|outcomes/i,
      keywords: ['AI transformation', 'adoption velocity', 'governance', 'operating model', 'value realization'],
      proof: 'Created operating models and roadmaps that tied ServiceNow/ITOM/CMDB maturity to adoption velocity, operational visibility and expansion potential.',
      fit: 'I connect AI strategy to adoption mechanics: governance, stakeholder alignment, workflow redesign, value proof and expansion path.',
    },
  ];
  const matches = catalog.filter((item) => item.test.test(text));
  const primary = matches[0] || catalog[0];
  const headline = profile?.narrative?.headline || 'Enterprise AI operator who builds governed multi-agent implementation systems';
  return {
    archetype: primary.name,
    keywords: uniqueList([
      ...matches.flatMap((item) => item.keywords),
      'ServiceNow ITOM/CMDB/CSDM',
      'technical GTM',
      'enterprise architecture',
      'regulated enterprise delivery',
      'value realization',
    ], 12),
    summary: [
      `Enterprise AI architect and technical GTM operator targeting ${role} at ${company}.`,
      `${headline}.`,
      primary.fit,
      'Bridges executive discovery, solution architecture, operating-model design and hands-on AI workflow execution across ServiceNow, Oracle and regulated enterprise environments.',
    ].join(' '),
    coverProofs: uniqueList(matches.length ? matches.map((item) => item.proof) : [primary.proof], 3),
    fitAnswer: primary.fit,
  };
}

function buildCvHtml({ company, role, reportText, profile, cvText, candidate }) {
  const template = readText('templates/cv-template.html');
  const positioning = applicationPositioning({ role, company, reportText, profile });
  const jdKeywords = uniqueList([
    role,
    company,
    ...positioning.keywords,
  ], 10);
  const coreSkills = bulletsFrom(extractSection(cvText, 'CORE SKILLS', /\nSELECTED AI/), 8);
  const selectedWork = bulletsFrom(extractSection(cvText, 'SELECTED AI, LLM & AUTOMATION WORK', /\nEXPERIENCE\b/), 5);
  const education = bulletsFrom(extractSection(cvText, 'EDUCATION', /\nCERTIFICATIONS\b/), 6)
    .map((item) => `<div class="edu-item">${escapeHtml(item)}</div>`).join('');
  const certifications = bulletsFrom(extractSection(cvText, 'CERTIFICATIONS', /\nLANGUAGES\b/), 8)
    .map((item) => `<div class="edu-item">${escapeHtml(item)}</div>`).join('');
  const languages = extractSection(cvText, 'LANGUAGES', /^$/);

  return fillTemplate(template, {
    LANG: 'en',
    PAGE_WIDTH: '8.5in',
    NAME: escapeHtml(candidate.fullName),
    PHONE: candidate.phone ? `<a href="tel:${escapeHtml(candidate.phone)}">${escapeHtml(candidate.phone)}</a><span class="separator">|</span>` : '',
    EMAIL: escapeHtml(candidate.email),
    LINKEDIN_URL: escapeHtml(candidate.linkedin),
    LINKEDIN_DISPLAY: escapeHtml(candidate.linkedin.replace(/^https?:\/\//, '')),
    PORTFOLIO_URL: escapeHtml(candidate.portfolio),
    PORTFOLIO_DISPLAY: escapeHtml(candidate.portfolio.replace(/^https?:\/\//, '')),
    LOCATION: escapeHtml(candidate.location),
    SECTION_SUMMARY: 'Professional Summary',
    SUMMARY_TEXT: escapeHtml(positioning.summary),
    SECTION_COMPETENCIES: 'Core Competencies',
    COMPETENCIES: jdKeywords.slice(0, 9).map((kw) => `<span class="competency-tag">${escapeHtml(kw)}</span>`).join(''),
    SECTION_EXPERIENCE: 'Work Experience',
    EXPERIENCE: buildExperienceHtml(cvText),
    SECTION_PROJECTS: 'Projects',
    PROJECTS: selectedWork.map((item) => `<div class="project"><div class="project-title">Enterprise AI / Agentic Operations</div><div class="project-desc">${escapeHtml(item)}</div></div>`).join(''),
    SECTION_EDUCATION: 'Education',
    EDUCATION: education,
    SECTION_CERTIFICATIONS: 'Certifications',
    CERTIFICATIONS: certifications,
    SECTION_SKILLS: 'Skills',
    SKILLS: `<p>${coreSkills.map(escapeHtml).join(' ')}</p><p>${escapeHtml(languages)}</p>`,
  });
}

function buildCoverPayload({ company, role, reportText, profile, candidate }) {
  const positioning = applicationPositioning({ role, company, reportText, profile });
  const proofImpacts = positioning.coverProofs.length ? positioning.coverProofs : [
    'Advised strategic enterprise stakeholders on AI adoption, platform operating models, ITOM/CMDB maturity, governance and measurable outcomes.',
  ];
  return {
    candidate: {
      name: candidate.fullName,
      location: candidate.location,
      email: candidate.email,
      phone: candidate.phone,
      linkedin: candidate.linkedin,
      github: candidate.portfolio,
      credentials: uniqueList(['Enterprise AI', positioning.archetype, 'Technical GTM', 'ServiceNow / ITOM / CMDB', 'Agentic operations'], 5),
    },
    letter: {
      company,
      role_title: role,
      city: 'United States',
      date: new Date().toISOString().slice(0, 10),
      opening: `I am applying for ${role} because it maps directly to my strongest lane: ${positioning.archetype.toLowerCase()}, enterprise adoption, technical architecture and customer operating-model change.`,
      profile_intro: profile?.narrative?.exit_story || 'My background combines ServiceNow enterprise advisory, Oracle cloud architecture and hands-on AI workflow building.',
      achievements: proofImpacts.map((impact, index) => ({
        lead: ['Enterprise proof', 'Agentic operating model', 'Adoption and revenue bridge'][index] || 'Relevant proof',
        impact,
      })),
      problems_section: `For ${company}, I would focus on converting AI interest into controlled deployment: use-case selection, stakeholder alignment, solution architecture, governance, evaluation criteria, adoption evidence and expansion path.`,
      closing: 'I am Brazil-based today, open to US relocation for the right senior AI/GTM role, and would require employer-supported sponsorship or a credible transfer path.',
      language_closing: 'Regards,',
    },
    output_path: '',
  };
}

function buildAnswers({ company, role, reportText, profile, candidate }) {
  const positioning = applicationPositioning({ role, company, reportText, profile });
  return {
    company,
    role,
    candidate: {
      first_name: candidate.firstName,
      last_name: candidate.lastName,
      full_name: candidate.fullName,
      email: candidate.email,
      phone: candidate.phone,
      current_location: candidate.location,
      linkedin: candidate.linkedin,
      portfolio: candidate.portfolio,
    },
    work_authorization: {
      united_states_authorized: 'No',
      united_states_sponsorship_needed: 'Yes',
      relocation: 'Yes, for the right senior AI/agents/GTM role with employer-supported sponsorship or transfer path.',
      europe_authorized: 'Yes, Portuguese citizen / EU work authorization.',
    },
    free_text: {
      why_role: `This ${role} role maps directly to my strongest lane: ${positioning.archetype.toLowerCase()}, enterprise AI adoption, technical GTM, solution architecture and governed agentic operating models.`,
      why_company: `${company} is relevant because senior AI buyers need more than demos. They need use-case discipline, stakeholder alignment, architecture judgment, governance and a credible path from pilot to adoption.`,
      relevant_experience: `${positioning.fitAnswer} At ServiceNow I advise strategic enterprise stakeholders on platform strategy, AI adoption, ITOM/CMDB maturity, governance and measurable business outcomes. I also build governed multi-agent workflows that turn ambiguous implementation work into controlled execution and reusable evidence.`,
      additional_information: `${profile?.narrative?.headline || 'Enterprise AI operator'} Portfolio: ${candidate.portfolio}`,
      how_heard: 'Found through my daily Career Ops AI GTM job search pipeline and evaluated against my US AI/enterprise GTM target criteria.',
    },
  };
}

function generateApplicationPackage(item, reportPath, reportText, score) {
  const profile = readProfile();
  const cvText = readText('cv.md');
  const candidate = candidateFromProfile(profile, cvText);
  const { company, role } = reportCompanyRole(item, reportText);
  const reportNum = parseReportNum(reportPath);
  const slug = `${slugify(company)}-${slugify(role)}`.slice(0, 140);
  const date = new Date().toISOString().slice(0, 10);
  const base = `${slug}-${date}`;
  const htmlPath = path.join(PACKAGE_DIR, `${base}.html`);
  const cvPath = path.join(PACKAGE_DIR, `${base}-resume.pdf`);
  const coverPayloadPath = path.join(PACKAGE_DIR, `${base}-cover-payload.json`);
  const coverPath = path.join(PACKAGE_DIR, `${base}-cover-letter.pdf`);
  const answersPath = path.join(PACKAGE_DIR, `${base}-answers.json`);
  const manifestPath = path.join(PACKAGE_DIR, `${base}-manifest.json`);

  const html = buildCvHtml({ company, role, reportText, profile, cvText, candidate });
  const coverPayload = buildCoverPayload({ company, role, reportText, profile, candidate });
  coverPayload.output_path = coverPath;
  const answers = buildAnswers({ company, role, reportText, profile, candidate });

  if (!DRY_RUN) {
    writeFileSync(htmlPath, html, 'utf8');
    writeFileSync(coverPayloadPath, `${JSON.stringify(coverPayload, null, 2)}\n`, 'utf8');
    writeFileSync(answersPath, `${JSON.stringify(answers, null, 2)}\n`, 'utf8');
    const pdfArgs = ['generate-pdf.mjs', htmlPath, cvPath, '--format=letter'];
    if (reportNum) pdfArgs.push(`--report=${reportNum}`);
    run(NODE, pdfArgs, {
      allowFail: false,
      timeout: 180000,
    });
    run(NODE, ['generate-cover-letter.mjs', '--payload', coverPayloadPath, '--out', coverPath], {
      allowFail: false,
      timeout: 180000,
    });
    const generatedCoverFallback = path.join(ROOT, 'output', path.basename(coverPath));
    if (!existsSync(coverPath) && existsSync(generatedCoverFallback)) {
      copyFileSync(generatedCoverFallback, coverPath);
    }
  }

  const manifest = {
    automation_id: AUTOMATION_ID,
    generated_at: new Date().toISOString(),
    company,
    role,
    score,
    url: item.url,
    report_path: path.relative(ROOT, path.resolve(ROOT, reportPath)),
    cv_path: path.relative(ROOT, cvPath),
    cover_letter_path: path.relative(ROOT, coverPath),
    answers_path: path.relative(ROOT, answersPath),
    submit_mode: SETTINGS.submitMode,
    gates: {
      submit_mode: SETTINGS.submitMode,
      legal_ack_vai: SETTINGS.legalAck,
      min_score: SETTINGS.minScore,
      auto_submit_score: Math.max(4.2, SETTINGS.autoSubmitScore),
    },
  };
  if (!DRY_RUN) writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  return { ...manifest, manifest_path: path.relative(ROOT, manifestPath), absolute: { cvPath, coverPath, answersPath } };
}

function updateApplicationManifest(packageInfo, submit) {
  if (DRY_RUN || !packageInfo?.manifest_path) return;
  const full = path.join(ROOT, packageInfo.manifest_path);
  const current = readJson(full, {});
  const submitted = Boolean(submit?.submitted);
  const next = {
    ...current,
    status: submit?.status || current.status || '',
    application_status: submit?.application_status || submit?.status || current.application_status || '',
    submitted,
    last_attempt_at: new Date().toISOString(),
    needs_paulo_approval: submit?.needs_paulo_approval ?? !submitted,
    blocker: submit?.blocker || '',
    submission_evidence_path: submit?.confirmation_path || submit?.evidence_path || current.submission_evidence_path || '',
    submission_report_path: packageInfo.report_path || current.submission_report_path || '',
  };
  if (submitted) next.submitted_at = next.submitted_at || next.last_attempt_at;
  writeFileSync(full, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
}

async function attemptSubmit(packageInfo) {
  if (!/^https?:\/\//i.test(packageInfo.url)) {
    return {
      status: 'draft_ready',
      application_status: 'package_ready_non_http_url',
      submitted: false,
      blocker: 'non-http application URL',
      needs_paulo_approval: true,
    };
  }
  if (!/(greenhouse|ashbyhq|lever)/i.test(packageInfo.url)) {
    return {
      status: 'draft_ready',
      application_status: 'package_ready_unsupported_ats',
      submitted: false,
      blocker: 'ATS provider not supported for safe generic browser fill yet',
      needs_paulo_approval: true,
    };
  }

  let chromium;
  try {
    ({ chromium } = await import('playwright'));
  } catch (error) {
    return { status: 'blocked', submitted: false, blocker: `Playwright unavailable: ${error.message}` };
  }

  const profile = readProfile();
  const candidate = candidateFromProfile(profile, readText('cv.md'));
  const answers = JSON.parse(readText(path.join(ROOT, packageInfo.answers_path), '{}'));
  const browser = await chromium.launch({ headless: !SETTINGS.headed, slowMo: SETTINGS.headed ? 70 : 0 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  page.setDefaultTimeout(30000);
  const beforePath = path.join(EVIDENCE_DIR, `${RUN_ID}-${slugify(packageInfo.company)}-${slugify(packageInfo.role)}-before-submit.png`);
  const afterPath = path.join(EVIDENCE_DIR, `${RUN_ID}-${slugify(packageInfo.company)}-${slugify(packageInfo.role)}-after-submit.png`);

  try {
    await page.goto(packageInfo.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2500);
    const initial = await safeBodyText(page);
    const initialBlocker = detectSubmitBlocker(initial);
    if (initialBlocker) {
      await page.screenshot({ path: beforePath, fullPage: true }).catch(() => {});
      return {
        status: 'blocked',
        application_status: 'blocked_before_fill',
        submitted: false,
        blocker: initialBlocker,
        needs_paulo_approval: true,
        evidence_path: path.relative(ROOT, beforePath),
      };
    }

    await openApplicationForm(page);
    await fillCommonFields(page, candidate, packageInfo, answers);
    await page.waitForTimeout(1000);
    await page.screenshot({ path: beforePath, fullPage: true }).catch(() => {});

    const body = await safeBodyText(page);
    if (isSubmissionSuccessText(body)) {
      return {
        status: 'submitted',
        application_status: 'submitted',
        submitted: true,
        blocker: '',
        needs_paulo_approval: false,
        evidence_path: path.relative(ROOT, beforePath),
        confirmation_path: path.relative(ROOT, beforePath),
        evidence: redact(body).slice(0, 1000),
      };
    }
    const blocker = detectSubmitBlocker(body);
    if (blocker) {
      return {
        status: 'blocked',
        application_status: 'blocked_after_fill',
        submitted: false,
        blocker,
        needs_paulo_approval: true,
        evidence_path: path.relative(ROOT, beforePath),
      };
    }

    const required = await requiredEmptyFields(page);
    if (required.length) {
      return {
        status: 'ready_for_submit',
        application_status: 'form_filled_required_fields_remaining',
        submitted: false,
        blocker: `unfilled required fields: ${required.slice(0, 8).join(', ')}`,
        needs_paulo_approval: true,
        evidence_path: path.relative(ROOT, beforePath),
      };
    }

    if (SETTINGS.submitMode !== 'auto_submit_low_risk') {
      return {
        status: 'ready_for_submit',
        application_status: 'form_filled_pending_paulo_final_submit',
        submitted: false,
        blocker: 'SUBMIT_MODE is ready_for_submit; Paulo approval required for final submit',
        needs_paulo_approval: true,
        evidence_path: path.relative(ROOT, beforePath),
      };
    }

    const criteria = validateAutoSubmitCriteria(packageInfo, body, profile);
    if (!criteria.ok) {
      return {
        status: 'ready_for_submit',
        application_status: 'form_filled_auto_submit_gate_failed',
        submitted: false,
        blocker: criteria.issues.join('; '),
        needs_paulo_approval: true,
        evidence_path: path.relative(ROOT, beforePath),
      };
    }

    const clicked = await clickSubmitButton(page);
    if (!clicked) {
      return {
        status: 'ready_for_submit',
        application_status: 'form_filled_submit_button_not_found',
        submitted: false,
        blocker: 'submit button not found',
        needs_paulo_approval: true,
        evidence_path: path.relative(ROOT, beforePath),
      };
    }

    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(8000);
  const finalText = await safeBodyText(page);
  await page.screenshot({ path: afterPath, fullPage: true }).catch(() => {});

    let gated = detectSubmitBlocker(finalText);
    let success = isSubmissionSuccessText(finalText);
    let finalEvidence = finalText;
    let requiredAfterSubmit = success ? [] : await requiredEmptyFields(page);
    let requiredMessage = /this field is required|please select an option|missing entry for required field/i.test(finalText);
    if (!success && !gated && (requiredAfterSubmit.length || requiredMessage)) {
      await fillCommonFields(page, candidate, packageInfo, answers);
      await page.waitForTimeout(700);
      if (await clickSubmitButton(page)) {
        await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
        await page.waitForTimeout(6000);
        finalEvidence = await safeBodyText(page);
        await page.screenshot({ path: afterPath, fullPage: true }).catch(() => {});
        gated = detectSubmitBlocker(finalEvidence);
        success = isSubmissionSuccessText(finalEvidence);
        requiredAfterSubmit = success ? [] : await requiredEmptyFields(page);
        requiredMessage = /this field is required|please select an option|missing entry for required field/i.test(finalEvidence);
      }
    }
    if (!success && !gated && (requiredAfterSubmit.length || requiredMessage)) {
      return {
        status: 'ready_for_submit',
        application_status: 'form_filled_required_fields_remaining',
        submitted: false,
        blocker: requiredAfterSubmit.length
          ? `unfilled required fields: ${requiredAfterSubmit.slice(0, 8).join(', ')}`
          : 'required field validation remained after submit click',
        needs_paulo_approval: true,
        evidence_path: path.relative(ROOT, beforePath),
        confirmation_path: path.relative(ROOT, afterPath),
        evidence: redact(finalEvidence).slice(0, 1000),
      };
    }
    return {
      status: success ? 'submitted' : (gated ? 'blocked' : 'ready_for_submit'),
      application_status: success ? 'submitted' : (gated ? 'blocked_after_submit_click' : 'submit_click_without_confirmation'),
      submitted: success,
      blocker: success ? '' : (gated || 'submit click did not produce confirmation'),
      needs_paulo_approval: !success,
      evidence_path: path.relative(ROOT, success ? afterPath : beforePath),
      confirmation_path: path.relative(ROOT, afterPath),
      evidence: redact(finalEvidence).slice(0, 1000),
    };
  } catch (error) {
    await page.screenshot({ path: afterPath, fullPage: true }).catch(() => {});
    return {
      status: 'failed',
      application_status: 'browser_fill_failed',
      submitted: false,
      blocker: redact(error.message),
      needs_paulo_approval: true,
      evidence_path: path.relative(ROOT, afterPath),
    };
  } finally {
    await browser.close().catch(() => {});
  }
}

async function openApplicationForm(page) {
  const candidates = [
    page.getByRole('button', { name: /apply for this job|apply now|apply/i }).last(),
    page.getByRole('link', { name: /apply for this job|apply now|apply/i }).last(),
    page.getByRole('tab', { name: /application/i }).last(),
    page.locator('button, a, [role="tab"]').filter({ hasText: /application|apply for this job|apply now/i }).last(),
  ];
  for (const loc of candidates) {
    if (!await loc.count().catch(() => 0)) continue;
    const visible = await loc.isVisible().catch(() => false);
    if (!visible) continue;
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await loc.click({ force: true }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1200);
    return true;
  }
  return false;
}

function validateAutoSubmitCriteria(packageInfo, pageText, profile) {
  const issues = [];
  const gateScore = Math.max(4.2, SETTINGS.autoSubmitScore);
  const lower = String(pageText || '').toLowerCase();
  if (SETTINGS.submitMode !== 'auto_submit_low_risk') issues.push('SUBMIT_MODE is not auto_submit_low_risk');
  if (packageInfo.score < gateScore) issues.push(`score ${packageInfo.score} below auto-submit gate ${gateScore}`);
  if (!packageFilesExist(packageInfo)) issues.push('final review packet missing one or more files');
  if (!profile?.location?.us_work_authorization) issues.push('US work authorization answer missing in config/profile.yml');
  if (!profile?.location?.visa_status && !profile?.location?.onsite_availability) issues.push('visa/sponsorship answer missing in config/profile.yml');
  if (!profile?.compensation?.target_range && !profile?.compensation?.minimum) issues.push('salary/compensation answer missing in config/profile.yml');
  if (/captcha|recaptcha|cloudflare|security challenge|verification code|one-time code|2fa|two-factor|sign in|log in|login required|create an account/.test(lower)) {
    issues.push('browser page contains auth/security gate text');
  }
  if (/(payment required|enter payment|payment method|credit card|billing information|paid credits?|subscription required|application fee|fee to apply|job board boost|boost this application|upgrade plan)/.test(lower)) {
    issues.push('browser page contains payment/account-upgrade gate text');
  }
  const ashbyLocation = ashbyApplicationLocationValue(pageText);
  const ashbyLocationPolicy = ashbyLocationAutoSubmitPolicy(ashbyLocation, profile);
  if (!ashbyLocationPolicy.ok) {
    issues.push(ashbyLocationPolicy.reason);
  }
  if (/background check|criminal history|\bsignature\b|e-sign|attestation/.test(lower)) {
    issues.push('background/signature/attestation text requires Paulo approval');
  }
  if (!SETTINGS.legalAck && /arbitration|class action|i acknowledge|certif(y|ication)|legal agreement|privacy policy|processing of.*personal data/.test(lower)) {
    issues.push('legal/privacy acknowledgement text requires Paulo approval');
  }
  if (!SETTINGS.eeoDecline && /race|ethnicity|gender|veteran|disability|demographic|eeo/.test(lower)) {
    issues.push('demographic/EEO section present; Paulo approval required');
  }
  return { ok: issues.length === 0, issues };
}

function ashbyApplicationLocationValue(pageText) {
  const lines = String(pageText || '')
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  for (let i = 0; i < lines.length; i += 1) {
    if (/^Location\*?$/.test(lines[i])) return lines[i + 1] || '';
  }
  return '';
}

function ashbyLocationAutoSubmitPolicy(value, profile) {
  const location = String(value || '').trim();
  if (!location) return { ok: true, reason: '' };
  if (isBrazilLocation(location)) return { ok: true, reason: '' };
  if (isUsOfficeLocation(location) && profileAllowsUsRelocation(profile)) {
    return { ok: true, reason: '' };
  }
  return {
    ok: false,
    reason: `Ashby Location* value is outside Paulo approved location policy (${location}); safe submit blocked`,
  };
}

function isBrazilLocation(value) {
  return /(brazil|brasil|sao jose|são josé|sao paulo|são paulo)/i.test(String(value || ''));
}

function isUsOfficeLocation(value) {
  const text = String(value || '');
  if (/(japan|norway|india|canada|europe|london|germany|netherlands|united kingdom|uk|australia)/i.test(text)) {
    return false;
  }
  return /(united states|usa|\bus\b|u\.s\.|san francisco|new york|nyc|boston|austin|seattle|miami|florida|texas|california|east coast|west coast|new jersey|virginia)/i.test(text);
}

function profileAllowsUsRelocation(profile) {
  const text = [
    profile?.location?.us_work_authorization,
    profile?.location?.visa_status,
    profile?.location?.onsite_availability,
    profile?.location?.current_location,
    profile?.location?.country,
    profile?.compensation?.location_flexibility,
  ].filter(Boolean).join(' ');
  return /united states|u\.s\.|\bus\b|relocat|onsite|transfer|sponsor/i.test(text)
    && /relocat|onsite|transfer|sponsor/i.test(text);
}

function packageFilesExist(packageInfo) {
  return [
    packageInfo.cv_path,
    packageInfo.cover_letter_path,
    packageInfo.answers_path,
    packageInfo.manifest_path,
  ].every((rel) => rel && existsSync(path.join(ROOT, rel)));
}

function isSubmissionSuccessText(text) {
  return /thank|thanks.*applying|received|submitted|application has been submitted|application submitted|success/i.test(String(text || ''));
}

async function fillCommonFields(page, candidate, packageInfo, answers) {
  const absoluteCv = path.join(ROOT, packageInfo.cv_path);
  const absoluteCover = path.join(ROOT, packageInfo.cover_letter_path);
  const profile = readProfile();
  const compensationAnswer = profile?.compensation?.target_range || profile?.compensation?.minimum || '';
  await fillFirst(page, ['#first_name', 'input[name="first_name"]'], candidate.firstName);
  await fillFirst(page, ['#last_name', 'input[name="last_name"]'], candidate.lastName);
  await fillInputByHint(page, /(^|\b)(full\s*)?name\b/i, candidate.fullName);
  await fillFirst(page, ['#email', 'input[type="email"]', '#_systemfield_email'], candidate.email);
  await fillFirst(page, ['#phone', 'input[type="tel"]'], candidate.phone);
  await fillInputByHint(page, /phone/i, candidate.phone);
  await fillFirst(page, ['#_systemfield_name', 'input[name="name"]'], candidate.fullName);
  await uploadFirst(page, ['#resume', '#_systemfield_resume', 'input[type="file"][name*="resume" i]', 'input[type="file"][id*="resume" i]'], absoluteCv);
  await uploadFirst(page, ['#cover_letter', 'input[type="file"][name*="cover" i]', 'input[type="file"][id*="cover" i]'], absoluteCover);

  const free = answers.free_text || {};
  await fillTextareaByHint(page, /(why|interested|interest|motivation|company)/i, free.why_role || free.why_company);
  await fillTextareaByHint(page, /(additional|anything else|other|portfolio|website|link)/i, free.additional_information || candidate.portfolio);
  await fillTextareaByHint(page, /(experience|achievement|project|relevant)/i, free.relevant_experience);
  await fillInputByHint(page, /(linkedin)/i, candidate.linkedin);
  await fillInputByHint(page, /(github|git hub)/i, candidate.github || candidate.portfolio);
  await fillInputByHint(page, /(website|portfolio|personal site)/i, candidate.portfolio);
  await chooseAshbyLocation(page, profile);
  await fillInputByHint(page, /(location|address|city)/i, candidate.location);
  await fillInputByHint(page, /(salary|compensation|pay|ote|expectation)/i, compensationAnswer);
  await fillTextareaByHint(page, /(salary|compensation|pay|ote|expectation)/i, compensationAnswer);
  await chooseAshbyLocation(page, profile);
  await fillKnownRequiredFields(page, candidate, profile, answers);
  await chooseAshbyLocation(page, profile);
  await chooseKnownSelectOptions(page);

  await clickBinaryByQuestion(page, /(authorized|authorised).*work.*(u\.?s\.?|united states)|(u\.?s\.?|united states).*work.*authori[sz]ed|legally.*work.*(u\.?s\.?|united states)/i, 'No');
  await clickBinaryByQuestion(page, /(visa sponsorship|sponsor|sponsorship|require.*visa|future.*visa|future.*sponsor)/i, 'Yes');
  await clickBinaryByQuestion(page, /(relocat|onsite|office|hybrid)/i, 'Yes');
  await clickBinaryByQuestion(page, /(nyc|new york).*office|office.*2\/3|come into.*office/i, 'Yes');
  if (SETTINGS.legalAck) {
    await clickConsentCheckboxes(page);
  }
  if (SETTINGS.eeoDecline) {
    await chooseDeclineForDemographics(page);
    await chooseKnownSelectOptions(page);
  }
}

async function chooseKnownSelectOptions(page) {
  const decline = [/decline/i, /prefer not/i, /do not wish/i, /don't wish/i, /i do not want/i, /i don’t wish/i];
  const choices = [
    [/(authorized|authorised).*work|work.*authorization|right to work/i, [/^no\b/i]],
    [/(sponsor|sponsorship|visa)/i, [/^yes\b/i]],
    [/(relocat|hybrid|in-office|in office|office model|onsite|come into.*office)/i, [/^yes\b/i]],
    [/(previously worked|worked for fin|worked for intercom|former employee)/i, [/^no\b/i]],
    [/(how did you hear|how.*heard|source|referral source)/i, [/linkedin/i, /other/i, /career site/i]],
    [/(gender|race|ethnicity|hispanic|latinx|veteran|disability|self-identification|demographic)/i, decline],
  ];
  for (const [question, options] of choices) {
    await chooseOptionByQuestion(page, question, options);
  }
  await chooseGreenhouseComboboxes(page);
}

async function chooseAshbyLocation(page, profile) {
  if (!/ashbyhq\.com/i.test(page.url())) return false;
  await page.evaluate(() => {
    const norm = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !el.disabled;
    };
    let index = 0;
    for (const el of [...document.querySelectorAll('input, button, [role="combobox"], [aria-haspopup="listbox"]')]) {
      if (!visible(el)) continue;
      let current = el;
      for (let depth = 0; current && depth < 5; depth += 1, current = current.parentElement) {
        const label = el.id ? document.querySelector(`[for="${CSS.escape(el.id)}"]`)?.innerText || '' : '';
        const text = norm(`${label} ${el.getAttribute('aria-label') || ''} ${el.name || ''} ${el.id || ''} ${current.innerText || ''}`);
        if (/location\*/i.test(text) && !/location type/i.test(text)) {
          el.setAttribute('data-career-ops-location-control', `location-${index += 1}`);
          break;
        }
      }
    }
    return index;
  }).catch(() => 0);

  const city = profile?.location?.city || 'Sao Jose dos Campos';
  const state = profile?.location?.state || 'Sao Paulo';
  const country = profile?.location?.country || 'Brazil';
  const attempts = [
    { query: `${city}, ${country}`, option: /S(a|ã)o Jos(e|é).*Brazil|Brazil/i },
    { query: state, option: /S(a|ã)o Paulo.*Brazil|Brazil.*S(a|ã)o Paulo/i },
    { query: country, option: /Brazil/i },
  ];
  const controls = [
    page.getByLabel(/^Location\*?$/i).first(),
    page.getByRole('combobox', { name: /^Location\*?$/i }).first(),
    page.locator('[data-career-ops-location-control]').first(),
    page.locator('input[role="combobox"][placeholder*="Start typing" i]').first(),
  ];
  for (const control of controls) {
    if (!await control.count().catch(() => 0)) continue;
    if (!await control.isVisible().catch(() => false)) continue;
    for (const attempt of attempts) {
      await page.keyboard.press('Escape').catch(() => {});
      await control.scrollIntoViewIfNeeded().catch(() => {});
      await control.click({ force: true }).catch(() => {});
      await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A').catch(() => {});
      await page.keyboard.press('Backspace').catch(() => {});
      await page.keyboard.type(attempt.query, { delay: 20 }).catch(() => {});
      await page.waitForTimeout(450);
      const option = page.getByRole('option', { name: attempt.option }).first();
      if (await option.count().catch(() => 0)) {
        await option.click({ force: true }).catch(() => {});
      } else {
        await page.keyboard.press('Enter').catch(() => {});
      }
      await page.waitForTimeout(600);
      const selected = await control.evaluate((el) => {
        const block = el.closest('label, fieldset, div')?.innerText || '';
        return `${el.value || ''} ${block}`.replace(/\s+/g, ' ');
      }).catch(() => '');
      if (/Brazil/i.test(selected) && !/Japan|Norway/i.test(selected)) return true;
    }
  }
  return false;
}

async function chooseGreenhouseComboboxes(page) {
  const cases = [
    [/^Country\*/i, 'Brazil', /Brazil/i],
    [/Current Location/i, 'Brazil', /Brazil/i],
    [/authorised to work|authorized to work|work authorisation|work authorization/i, 'sponsorship', /sponsorship|renewal/i],
    [/willing to relocate/i, 'Yes', /^Yes$/i],
    [/previously worked.*Fin|previously worked.*Intercom|former employee/i, 'No', /^No$/i],
    [/hybrid in-office|office location.*3 days|work from our office/i, 'Yes', /^Yes$/i],
    [/future job openings|email me about future/i, 'No', /^No$/i],
    [/How did you hear/i, 'Other', /^Other$/i],
    [/Gender/i, 'decline', /decline|prefer not|do not wish|do not want/i],
    [/Hispanic|Latino/i, 'decline', /decline|prefer not|do not wish|do not want/i],
    [/Veteran Status/i, 'decline', /decline|prefer not|do not wish|do not want/i],
    [/Disability Status/i, 'decline', /decline|prefer not|do not wish|do not want/i],
  ];
  for (const [labelRe, query, optionRe] of cases) {
    const ids = await page.evaluate(({ source, flags }) => {
      const re = new RegExp(source, flags);
      return [...document.querySelectorAll('input[role="combobox"]')]
        .filter((el) => {
          const label = el.id ? document.querySelector(`[for="${CSS.escape(el.id)}"]`)?.innerText || '' : '';
          const labelledBy = el.getAttribute('aria-labelledby');
          const ariaLabel = labelledBy ? document.getElementById(labelledBy)?.innerText || '' : '';
          return re.test(`${label} ${ariaLabel} ${el.id || ''}`.replace(/\s+/g, ' '));
        })
        .map((el) => el.id)
        .filter(Boolean);
    }, { source: labelRe.source, flags: labelRe.flags }).catch(() => []);
    for (const id of ids) {
      await chooseReactSelectById(page, id, query, optionRe);
    }
  }
}

async function chooseReactSelectById(page, id, query, optionRe) {
  const control = page.locator(`#${id}`).first();
  if (!await control.count().catch(() => 0)) return false;
  await page.keyboard.press('Escape').catch(() => {});
  await control.scrollIntoViewIfNeeded().catch(() => {});
  await control.click({ force: true }).catch(() => {});
  await control.fill(query).catch(async () => {
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+A' : 'Control+A').catch(() => {});
    await page.keyboard.press('Backspace').catch(() => {});
    await page.keyboard.type(query, { delay: 20 }).catch(() => {});
  });
  await page.waitForTimeout(350);
  const option = page.getByRole('option', { name: optionRe }).last();
  if (await option.count().catch(() => 0)) {
    await option.click({ force: true }).catch(() => {});
    await page.waitForTimeout(250);
    return true;
  }
  await page.keyboard.press('Enter').catch(() => {});
  await page.waitForTimeout(250);
  return true;
}

async function chooseOptionByQuestion(page, questionRe, optionRes) {
  const controls = [
    page.getByLabel(questionRe).first(),
    page.getByRole('combobox', { name: questionRe }).first(),
    page.getByRole('button', { name: questionRe }).first(),
  ];
  for (const control of controls) {
    if (await chooseOptionOnControl(page, control, optionRes)) return true;
  }

  const containers = page.locator('label, fieldset, div').filter({ hasText: questionRe });
  const count = Math.min(await containers.count().catch(() => 0), 30);
  for (let i = 0; i < count; i += 1) {
    const container = containers.nth(i);
    const control = container.locator('select, [role="combobox"], input[role="combobox"], button[aria-haspopup], [aria-haspopup="listbox"]').first();
    if (await chooseOptionOnControl(page, control, optionRes)) return true;
  }
  return false;
}

async function chooseOptionOnControl(page, control, optionRes) {
  if (!await control.count().catch(() => 0)) return false;
  const visible = await control.isVisible().catch(() => false);
  if (!visible) return false;
  const tag = await control.evaluate((el) => el.tagName).catch(() => '');
  if (tag === 'SELECT') {
    const value = await control.evaluate((el, patterns) => {
      const res = patterns.map((item) => new RegExp(item.source, item.flags));
      const option = [...el.options].find((candidate) => {
        const text = `${candidate.text || ''} ${candidate.value || ''}`.trim();
        return candidate.value && res.some((re) => re.test(text));
      });
      return option?.value || '';
    }, optionRes.map((re) => ({ source: re.source, flags: re.flags }))).catch(() => '');
    if (value) {
      await control.selectOption(value).catch(() => {});
      return true;
    }
  }

  await control.scrollIntoViewIfNeeded().catch(() => {});
  await control.click({ force: true }).catch(() => {});
  await page.waitForTimeout(250);
  for (const re of optionRes) {
    const option = page.getByRole('option', { name: re }).first();
    if (await option.count().catch(() => 0)) {
      await option.click({ force: true }).catch(() => {});
      return true;
    }
  }
  const firstChoice = optionRes[0]?.source?.replace(/^\^|\$$|\\b|\\/g, '').replace(/\|.*$/, '') || '';
  if (firstChoice) {
    await page.keyboard.type(firstChoice, { delay: 20 }).catch(() => {});
    await page.keyboard.press('Enter').catch(() => {});
  }
  return true;
}

async function fillKnownRequiredFields(page, candidate, profile, answers) {
  const free = answers.free_text || {};
  const values = {
    country: profile?.location?.country || 'Brazil',
    location: candidate.location,
    notice: 'Available after an agreed notice period; exact start date can be aligned with the hiring team.',
    workFrom: 'Brazil-based/remote today; open to relocation or regular onsite cadence with employer-supported sponsorship or transfer path.',
    sponsorship: 'Yes, sponsorship or a credible internal transfer path is required for US roles.',
    relocation: 'Yes, for the right senior AI/GTM role with employer-supported relocation path.',
    officeAvailability: 'Yes, contingent on employer-supported relocation, sponsorship, or an agreed transfer path.',
    english: 'C1 / fluent professional English.',
    german: 'None / beginner only.',
    priorEmployer: 'No.',
    futureOpenings: 'No.',
    howHeard: 'LinkedIn',
    aiPolicy: 'Yes. I used AI-assisted drafting and review, with human review and factual validation. All claims are accurate and my own.',
    priorAnthropicInterview: 'No.',
    internalTool: 'Built and used Career Ops: a local multi-agent automation pipeline that scans AI/GTM roles, evaluates fit, generates tailored CV/cover/answer packs, captures browser evidence, preserves human gates, and produces approval dashboards.',
    consent: SETTINGS.legalAck ? 'Yes' : '',
    portfolio: candidate.portfolio,
    github: candidate.github || candidate.portfolio,
    whyRole: free.relevant_experience || free.why_role || '',
  };
  await page.evaluate((values) => {
    const norm = (value) => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none' && !el.disabled;
    };
    const contextFor = (el) => {
      const label = el.id ? document.querySelector(`[for="${CSS.escape(el.id)}"]`)?.innerText || '' : '';
      const ancestors = [];
      let current = el.parentElement;
      for (let depth = 0; current && depth < 6; depth += 1, current = current.parentElement) {
        ancestors.push(current.innerText || '');
      }
      return norm(`${label} ${el.name || ''} ${el.id || ''} ${el.placeholder || ''} ${ancestors.join(' ')}`);
    };
    const setControlValue = (el, value) => {
      const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype
        : (el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype);
      const descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
      if (descriptor?.set) descriptor.set.call(el, value);
      else el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.dispatchEvent(new Event('blur', { bubbles: true }));
    };
    const answerFor = (context) => {
      if (/authorized|authorised|legally.*work|work authorization|right to work/.test(context)) return 'No';
      if (/visa|sponsor|sponsorship/.test(context)) return 'Yes';
      if (/relocat/.test(context)) return 'Yes';
      if (/previously worked|worked for fin|worked for intercom|former employee/.test(context)) return 'No';
      if (/future job openings|future openings|email me about future|contact me about future/.test(context)) return 'No';
      if (/interviewed at anthropic|anthropic.*interview/.test(context)) return 'No';
      if (/current or most recent company|current company|most recent company/.test(context)) return 'ServiceNow';
      if (/country/.test(context)) return values.country;
      if (/currently located|current location|where are you currently located|location|city/.test(context)) return values.location;
      if (/start|notice period|able to start/.test(context)) return values.notice;
      if (/office|in-person|in person|onsite|hybrid|come into|working in our office|work in our office/.test(context)) return values.officeAvailability;
      if (/where.*work|work from/.test(context)) return values.workFrom;
      if (/internal tool|automation.*built|people actually used/.test(context)) return values.internalTool;
      if (/german|deutsch/.test(context)) return values.german;
      if (/english/.test(context)) return values.english;
      if (/how did you hear|how.*heard|source|referral source/.test(context)) return values.howHeard;
      if (/ai policy|policy for application|use of ai|used ai|ai-assisted/.test(context)) return values.aiPolicy;
      if (/gdpr|privacy|data.*processing|read.*gdpr|gdpr statement/.test(context)) return values.consent || 'Yes';
      if (/how do you identify|gender identity|identity/.test(context)) return 'decline';
      if (/linkedin/.test(context)) return '';
      if (/github|git hub/.test(context)) return values.github;
      if (/website|portfolio/.test(context)) return values.portfolio;
      if (/why|relevant|experience|additional/.test(context)) return values.whyRole;
      return '';
    };
    const optionScore = (text, answer) => {
      const t = norm(text);
      const a = norm(answer);
      if (!t || !a) return 0;
      if (a === 'brazil' && /brazil|brasil/.test(t)) return 10;
      if (/german|deutsch/.test(a) && /none|no german|beginner|a1|not applicable|n\/a/i.test(t)) return 10;
      if (/english|fluent|c1/.test(a) && /c1|fluent|professional|advanced|native|full professional/i.test(t)) return 10;
      if (/linkedin/.test(a) && /linkedin/i.test(t)) return 10;
      if (/career ops|daily career ops/.test(a) && /other|company website|career site/i.test(t)) return 8;
      if (/yes/.test(a) && /^yes\b|^sim\b/.test(t)) return 10;
      if (/no/.test(a) && /^no\b|^nao\b|^não\b/.test(t)) return 10;
      if (t.includes(a) || a.includes(t)) return 8;
      return 0;
    };
    const isTechnicalCombobox = (el) => (
      el.getAttribute('role') === 'combobox'
      || el.getAttribute('aria-autocomplete')
      || el.getAttribute('aria-controls')
      || /combobox|select|autocomplete/i.test(`${el.className || ''} ${el.parentElement?.className || ''}`)
    );
    for (const el of [...document.querySelectorAll('input:not([type="hidden"]):not([type="file"]):not([type="checkbox"]):not([type="radio"]), textarea')]) {
      if (!visible(el) || el.value) continue;
      if (isTechnicalCombobox(el)) continue;
      const value = answerFor(contextFor(el));
      if (value) setControlValue(el, String(value).slice(0, el.maxLength > 0 ? el.maxLength : 900));
    }
    for (const el of [...document.querySelectorAll('select')]) {
      if (!visible(el) || el.value) continue;
      const context = contextFor(el);
      let answer = answerFor(context);
      if (/race|ethnicity|gender|veteran|disability|demographic|eeo|how do you identify|gender identity/.test(context)) answer = 'decline';
      if (!answer) continue;
      let best = null;
      let bestScore = 0;
      for (const option of [...el.options]) {
        let score = optionScore(option.text, answer);
        if (/decline|prefer not|not disclose|do not wish|don't wish/i.test(option.text)
          && /race|ethnicity|gender|veteran|disability|demographic|eeo|how do you identify|gender identity/.test(context)) {
          score = 10;
        }
        if (/^yes\b|^sim\b|read|confirm/i.test(option.text)
          && /gdpr|privacy|data.*processing|statement/.test(context)) {
          score = 10;
        }
        if (score > bestScore) {
          best = option;
          bestScore = score;
        }
      }
      if (best) {
        setControlValue(el, best.value);
      }
    }
    const clickRadioInContext = (questionRe, answerRe) => {
      for (const input of [...document.querySelectorAll('input[type="radio"]')]) {
        if (!visible(input) || input.checked) continue;
        const context = contextFor(input);
        const label = input.id ? document.querySelector(`[for="${CSS.escape(input.id)}"]`)?.innerText || '' : '';
        const text = norm(`${label} ${input.value || ''} ${input.getAttribute('aria-label') || ''}`);
        if (questionRe.test(context) && answerRe.test(text)) {
          input.click();
          return true;
        }
      }
      return false;
    };
    clickRadioInContext(/visa|sponsor|sponsorship/, /^yes\b|^sim\b/);
    clickRadioInContext(/relocat/, /^yes\b|^sim\b/);
    clickRadioInContext(/nyc|new york|office.*2\/3|come into.*office|in-person|in person|onsite|hybrid|working in our office|work in our office/, /^yes\b|^sim\b/);
    clickRadioInContext(/authorized|authorised|legally.*work.*u\.?s\.?/, /^no\b|^nao\b|^não\b/);
    clickRadioInContext(/previously worked|worked for fin|worked for intercom|former employee/, /^no\b|^nao\b|^não\b/);
    clickRadioInContext(/future job openings|future openings|email me about future|contact me about future/, /^no\b|^nao\b|^não\b/);
    clickRadioInContext(/interviewed at anthropic|anthropic.*interview/, /^no\b|^nao\b|^não\b/);
    clickRadioInContext(/ai policy|policy for application|use of ai|used ai|ai-assisted/, /^yes\b|^sim\b/);
    if (values.consent) {
      for (const checkbox of [...document.querySelectorAll('input[type="checkbox"]')]) {
        if (!visible(checkbox) || checkbox.checked) continue;
        const context = contextFor(checkbox);
        if (/(consent|privacy policy|processing of.*personal data|lgpd|gdpr|acknowledge|certify|agree)/.test(context)
          && !/(background check|arbitration|class action|signature|e-sign)/.test(context)) {
          checkbox.click();
        }
      }
    }
  }, values).catch(() => {});
}

async function fillFirst(page, selectors, value) {
  if (!value) return false;
  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    if (await loc.count()) {
      const visible = await loc.isVisible().catch(() => false);
      if (!visible) continue;
      try {
        await loc.fill(String(value));
        return true;
      } catch {
        continue;
      }
    }
  }
  return false;
}

async function uploadFirst(page, selectors, file) {
  if (!file || !existsSync(file)) return false;
  for (const selector of selectors) {
    const loc = page.locator(selector).first();
    if (await loc.count()) {
      try {
        await loc.setInputFiles(file);
        await page.waitForTimeout(1000);
        return true;
      } catch {
        continue;
      }
    }
  }
  return false;
}

async function fillTextareaByHint(page, hint, value) {
  if (!value) return;
  const count = await page.locator('textarea').count();
  for (let i = 0; i < count; i += 1) {
    const loc = page.locator('textarea').nth(i);
    const meta = await fieldMeta(loc);
    if (!meta.visible || meta.value) continue;
    if (hint.test(meta.context)) {
      await loc.fill(String(value).slice(0, meta.maxLength > 0 ? meta.maxLength : 1900)).catch(() => {});
    }
  }
}

async function fillInputByHint(page, hint, value) {
  if (!value) return;
  const count = await page.locator('input:not([type="hidden"]):not([type="file"]):not([type="checkbox"]):not([type="radio"])').count();
  for (let i = 0; i < count; i += 1) {
    const loc = page.locator('input:not([type="hidden"]):not([type="file"]):not([type="checkbox"]):not([type="radio"])').nth(i);
    const meta = await fieldMeta(loc);
    if (!meta.visible || meta.value || meta.technicalCombobox) continue;
    if (hint.test(meta.context)) {
      await loc.fill(String(value).slice(0, meta.maxLength > 0 ? meta.maxLength : 300)).catch(() => {});
    }
  }
}

async function fieldMeta(locator) {
  return locator.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const id = el.id ? `[for="${CSS.escape(el.id)}"]` : '';
    const label = id ? document.querySelector(id)?.innerText || '' : '';
    const parent = el.closest('label, fieldset, div')?.innerText || '';
    return {
      visible: rect.width > 0 && rect.height > 0,
      value: el.value || '',
      maxLength: el.maxLength || 0,
      technicalCombobox: Boolean(
        el.getAttribute('role') === 'combobox'
          || el.getAttribute('aria-autocomplete')
          || el.getAttribute('aria-controls')
          || /combobox|select|autocomplete/i.test(`${el.className || ''} ${el.parentElement?.className || ''}`),
      ),
      context: `${label} ${el.name || ''} ${el.id || ''} ${el.placeholder || ''} ${parent}`.replace(/\s+/g, ' ').slice(0, 600),
    };
  }).catch(() => ({ visible: false, value: '', maxLength: 0, context: '' }));
}

async function clickBinaryByQuestion(page, questionRe, answer) {
  await page.evaluate(({ source, flags, answer }) => {
    const re = new RegExp(source, flags);
    const norm = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const visible = (el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
    };
    const matchesAnswer = (control) => {
      const text = norm(control.innerText || control.value || control.getAttribute('aria-label') || '');
      return new RegExp(`^${answer}$`, 'i').test(text);
    };
    const nodes = [...document.querySelectorAll('label, div, fieldset, p, span')]
      .filter((el) => {
        const text = norm(el.innerText || '');
        return text && text.length < 900 && re.test(text);
      })
      .sort((a, b) => norm(a.innerText || '').length - norm(b.innerText || '').length);
    for (const node of nodes) {
      let current = node;
      for (let depth = 0; current && depth < 6; depth += 1, current = current.parentElement) {
        const context = norm(current.innerText || '');
        if (!re.test(context) || context.length > 1600) continue;
        const controls = [...current.querySelectorAll('button, [role="radio"], label, input[type="radio"]')]
          .filter(visible)
          .filter(matchesAnswer);
        for (const control of controls) {
          control.click();
          return true;
        }
      }
    }
    return false;
  }, { source: questionRe.source, flags: questionRe.flags, answer }).catch(() => false);
}

async function chooseDeclineForDemographics(page) {
  const decline = /(decline|prefer not|don't wish|do not wish|not disclose)/i;
  await page.evaluate(({ source, flags }) => {
    const re = new RegExp(source, flags);
    for (const select of [...document.querySelectorAll('select')]) {
      const context = `${select.name || ''} ${select.id || ''} ${select.closest('label, fieldset, div')?.innerText || ''}`.replace(/\s+/g, ' ');
      if (!/race|ethnicity|gender|veteran|disability|demographic|eeo/i.test(context)) continue;
      const option = [...select.options].find((item) => re.test(item.text || item.value || ''));
      if (option) {
        select.value = option.value;
        select.dispatchEvent(new Event('input', { bubbles: true }));
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, { source: decline.source, flags: decline.flags }).catch(() => {});
  await page.evaluate(({ source, flags }) => {
    const re = new RegExp(source, flags);
    const controls = [...document.querySelectorAll('button, label, option')]
      .filter((el) => re.test((el.innerText || el.value || '').trim()));
    for (const control of controls.slice(0, 12)) control.click();
  }, { source: decline.source, flags: decline.flags }).catch(() => {});
}

async function clickConsentCheckboxes(page) {
  await page.evaluate(() => {
    const consentRe = /(consent|privacy policy|processing of.*personal data|lgpd|gdpr|acknowledge|certify|agree)/i;
    for (const checkbox of [...document.querySelectorAll('input[type="checkbox"]')]) {
      const label = checkbox.id ? document.querySelector(`[for="${CSS.escape(checkbox.id)}"]`)?.innerText || '' : '';
      const context = `${label} ${checkbox.name || ''} ${checkbox.id || ''} ${checkbox.closest('label, div')?.innerText || ''}`.replace(/\s+/g, ' ');
      if (consentRe.test(context) && !/background check|arbitration|class action|signature|e-sign/i.test(context)) {
        checkbox.click();
      }
    }
  }).catch(() => {});
}

async function safeBodyText(page) {
  return page.locator('body').innerText({ timeout: 10000 }).catch(() => '');
}

function detectSubmitBlocker(text) {
  const lower = String(text || '').toLowerCase();
  if (/couldn['’]?t submit your application.*possible spam|application submission was flagged as possible spam|possible spam/.test(lower)) {
    return 'ATS possible spam / anti-automation rejection after submit click';
  }
  if (/captcha|recaptcha|cloudflare|security challenge/.test(lower)) return 'captcha/security challenge';
  if (/verification code|security code|verify your email|one-time code|2fa|two-factor/.test(lower)) return 'email/security code required';
  if (/sign in|log in|login required|create an account/.test(lower)) return 'login/account gate';
  if (/(payment required|enter payment|payment method|credit card|billing information|paid credits?|subscription required|application fee|fee to apply|job board boost|boost this application|upgrade plan)/.test(lower)) {
    return 'payment/billing gate';
  }
  if (/(not able to provide sponsorship|unable to sponsor|do not offer sponsorship|without requiring employer sponsorship|without sponsorship|authorized to work in the united states without sponsorship|legally authorized to work in the united states on a permanent basis)/.test(lower)) {
    return 'US work authorization/no sponsorship gate';
  }
  if (/background check|criminal history|\bsignature\b|e-sign|attestation/.test(lower)) return 'background-check/signature/attestation gate';
  if (!SETTINGS.legalAck && /arbitration|class action|legal agreement|certif(y|ication)|\bi acknowledge\b/.test(lower)) {
    return 'legal acknowledgement gate; Paulo approval required';
  }
  return '';
}

async function requiredEmptyFields(page) {
  return page.evaluate(() => {
    const fields = [...document.querySelectorAll('input, textarea, select')];
    return fields.flatMap((el) => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const visible = rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
      if (!visible || el.disabled || el.type === 'hidden') return [];
      const required = el.required || el.getAttribute('aria-required') === 'true';
      if (!required) return [];
      let value = el.type === 'file' ? (el.files && el.files.length ? 'file' : '') : (el.value || '');
      if (el.tagName === 'SELECT') {
        const selectedText = el.selectedOptions?.[0]?.textContent || '';
        if (/^\s*(select|please select|choose|--)/i.test(selectedText)) value = '';
      }
      if (value) return [];
      const label = el.id ? document.querySelector(`[for="${CSS.escape(el.id)}"]`)?.innerText : '';
      const ancestorText = el.closest('label, fieldset, [data-testid], [class*="field" i], [class*="question" i], div')?.innerText || '';
      const context = `${label || ''} ${el.name || ''} ${el.id || ''} ${el.placeholder || ''} ${el.getAttribute('aria-label') || ''} ${ancestorText}`
        .replace(/\s+/g, ' ')
        .trim();
      const semanticIdentifier = `${label || ''}${el.name || ''}${el.id || ''}${el.placeholder || ''}${el.getAttribute('aria-label') || ''}${context}`;
      if (el.matches('input[type="text"], input:not([type])') && !semanticIdentifier.trim()) return [];
      const hasVisibleAnswer = /(yes|no|brazil|sao jose|são josé|linkedin|c1|fluent|none|prefer not|decline|career ops)/i.test(ancestorText);
      const technicalComboboxInput = el.matches('input[type="text"], input:not([type])')
        && (
          el.getAttribute('role') === 'combobox'
          || el.getAttribute('aria-autocomplete')
          || el.getAttribute('aria-controls')
          || /select|dropdown|combobox|chosen|select2/i.test(`${el.className || ''} ${el.parentElement?.className || ''}`)
        );
      if (technicalComboboxInput && hasVisibleAnswer) return [];
      return [context || el.type || 'required field'];
    });
  }).catch(() => []);
}

async function clickSubmitButton(page) {
  const candidates = [
    page.getByRole('button', { name: /submit application|submit|apply/i }).last(),
    page.locator('input[type="submit"]').last(),
    page.locator('button[type="submit"]').last(),
    page.locator('.ashby-application-form-submit-button').last(),
  ];
  for (const loc of candidates) {
    if (await loc.count()) {
      await loc.scrollIntoViewIfNeeded().catch(() => {});
      await loc.click({ force: true }).catch(() => {});
      return true;
    }
  }
  return false;
}

async function processItem(
  item,
  submittedIndex = submittedApplicationIndex(),
  previousAttemptIndex = previousApplicationAttemptIndex(),
) {
  const started = new Date().toISOString();
  const base = { url: item.url, company: item.company, role: item.role, started_at: started };
  const hardBlock = applicationHardBlock(item);
  if (hardBlock) {
    return {
      ...base,
      status: 'blocked',
      application_status: 'blocked_by_paulo_authorization_policy',
      submitted: false,
      needs_paulo_approval: true,
      blocker: hardBlock.reason,
      hard_block_id: hardBlock.id,
    };
  }

  const priorSubmission = submittedIndex.get(applicationUrlKey(item.url));
  if (priorSubmission) {
    return {
      ...base,
      company: item.company || priorSubmission.company,
      role: item.role || priorSubmission.role,
      status: 'skipped_already_submitted',
      application_status: 'already_submitted',
      submitted: false,
      needs_paulo_approval: false,
      blocker: `already submitted; source ${priorSubmission.source_path || priorSubmission.report_path || priorSubmission.manifest_path}`,
      prior_submission: priorSubmission,
    };
  }

  const priorAttempt = previousAttemptIndex.get(applicationUrlKey(item.url));
  if (priorAttempt) {
    return {
      ...base,
      company: item.company || priorAttempt.company,
      role: item.role || priorAttempt.role,
      status: 'skipped_previous_attempt',
      application_status: 'previous_attempt_needs_review',
      submitted: false,
      needs_paulo_approval: false,
      blocker: `previous ${priorAttempt.status || priorAttempt.application_status || 'application'} attempt exists; source ${priorAttempt.source_path || priorAttempt.report_path || priorAttempt.evidence_path}`,
      prior_attempt: priorAttempt,
    };
  }

  const live = checkLiveness(item.url);
  if (!live.ok) {
    return { ...base, status: live.expired ? 'skipped_expired' : 'blocked', blocker: live.output || 'liveness failed' };
  }

  const evaluation = await evaluateUrl(item);
  if (!evaluation.ok) {
    return { ...base, status: 'failed', blocker: evaluation.stderrTail || evaluation.stdoutTail || evaluation.error || 'evaluation failed' };
  }

  const reportText = readText(evaluation.reportPath);
  const score = parseScore(reportText);
  const details = reportCompanyRole(item, reportText);
  if (score < SETTINGS.minScore) {
    return { ...base, ...details, status: 'evaluated', score, report_path: evaluation.reportPath, blocker: `score below ${SETTINGS.minScore}` };
  }

  const packageInfo = generateApplicationPackage({ ...item, ...details }, evaluation.reportPath, reportText, score);
  const submit = await attemptSubmit(packageInfo);
  updateApplicationManifest(packageInfo, submit);
  const evidencePaths = [submit.evidence_path, submit.confirmation_path].filter(Boolean);
  return {
    ...base,
    ...details,
    status: submit.status,
    application_status: submit.application_status || submit.status,
    score,
    submitted: Boolean(submit.submitted),
    needs_paulo_approval: submit.needs_paulo_approval ?? !submit.submitted,
    report_path: evaluation.reportPath,
    cv_path: packageInfo.cv_path,
    cover_letter_path: packageInfo.cover_letter_path,
    answers_path: packageInfo.answers_path,
    manifest_path: packageInfo.manifest_path,
    evidence_path: submit.evidence_path,
    evidence_paths: evidencePaths,
    confirmation_path: submit.confirmation_path,
    blocker: submit.blocker || '',
  };
}

function approvalQueueItems(processed) {
  return processed
    .filter((item) => item.needs_paulo_approval || ['ready_for_submit', 'draft_ready', 'blocked', 'failed'].includes(item.status))
    .filter((item) => item.cv_path || item.cover_letter_path || item.answers_path || item.manifest_path || item.evidence_path || item.report_path)
    .map((item, index) => ({
      id: `${RUN_ID}-${String(index + 1).padStart(2, '0')}-${slugify(item.company)}-${slugify(item.role)}`.slice(0, 180),
      priority: item.status === 'ready_for_submit' ? 'submit-review' : (item.status === 'draft_ready' ? 'manual-completion' : 'blocker-review'),
      action: approvalAction(item),
      company: item.company || '',
      role: item.role || '',
      score: Number(item.score || 0),
      url: item.url || '',
      status: item.status || '',
      application_status: item.application_status || item.status || '',
      blocker: item.blocker || '',
      unresolved_fields: unresolvedFieldsFromBlocker(item.blocker || ''),
      suggested_answers: Object.fromEntries(
        unresolvedFieldsFromBlocker(item.blocker || '').map((field) => [field, suggestedAnswerForRequiredField(field)]),
      ),
      report_path: item.report_path || '',
      cv_path: item.cv_path || '',
      cover_letter_path: item.cover_letter_path || '',
      answers_path: item.answers_path || '',
      manifest_path: item.manifest_path || '',
      evidence_paths: [...new Set([
        ...(Array.isArray(item.evidence_paths) ? item.evidence_paths : []),
        item.evidence_path,
        item.confirmation_path,
      ].filter(Boolean))],
      file_checks: {
        report: fileCheck(item.report_path),
        cv: fileCheck(item.cv_path),
        cover_letter: fileCheck(item.cover_letter_path),
        answers: fileCheck(item.answers_path),
        manifest: fileCheck(item.manifest_path),
        evidence: (Array.isArray(item.evidence_paths) ? item.evidence_paths : [item.evidence_path])
          .filter(Boolean)
          .map((rel) => ({ path: rel, exists: fileCheck(rel).exists })),
      },
    }));
}

function approvalAction(item) {
  if (item.status === 'ready_for_submit') {
    return 'Review unresolved required fields in the ATS, confirm legal/work-auth details, then manually submit only if acceptable.';
  }
  if (item.status === 'draft_ready') {
    return 'Use the generated CV, cover letter and answers to complete the unsupported ATS manually.';
  }
  return 'Review the blocker and either discard the role, fix source data, or rerun after the external gate is cleared.';
}

function unresolvedFieldsFromBlocker(blocker) {
  const match = String(blocker || '').match(/unfilled required fields:\s*(.+)$/i);
  if (!match) return [];
  const seen = new Set();
  return match[1]
    .split(',')
    .map((field) => field.replace(/\*/g, '').trim().replace(/\s+/g, ' '))
    .map((field) => (/^text$/i.test(field) ? 'Unlabeled text field; inspect screenshot' : field))
    .filter(Boolean)
    .filter((field) => {
      const key = field.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 20);
}

function suggestedAnswerForRequiredField(field) {
  const lower = String(field || '').toLowerCase();
  if (/country/.test(lower)) return 'Brazil';
  if (/start|notice/.test(lower)) return 'Available after an agreed notice period; exact start date requires Paulo final confirmation.';
  if (/where.*work|work from|office|nyc|hybrid|onsite/.test(lower)) {
    return 'Brazil-based/remote today; open to relocation or regular onsite cadence only with employer-supported sponsorship or transfer path.';
  }
  if (/relocation|relocat/.test(lower)) return 'Yes, for the right senior AI/GTM role with employer-supported relocation path.';
  if (/visa|sponsor|sponsorship|work authorization|authori[sz]ed/.test(lower)) {
    return 'Yes, sponsorship or a credible internal transfer path is required for US roles.';
  }
  return 'Needs Paulo review; inspect screenshot and answer pack before final submit.';
}

function fileCheck(relOrAbs) {
  if (!relOrAbs) return { path: '', exists: false };
  const full = path.isAbsolute(relOrAbs) ? relOrAbs : path.join(ROOT, relOrAbs);
  return { path: relOrAbs, exists: existsSync(full) };
}

function promptCacheTelemetry() {
  return {
    policy: '/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md',
    strategy: 'cli-prefix-layout',
    cache_key_or_tag: 'paulo:n8n-daily-us-ai-job-applications:career-ops:2026-06-30',
    prefix_version: '2026-06-30-career-ops-n8n-apply-v1',
    prefix_hash_recorded: false,
    cached_tokens: null,
    input_tokens: null,
    output_tokens: null,
    cache_hit_rate: null,
    notes: 'Node/n8n wrapper does not expose provider prompt-cache token telemetry; stable policy and execution prompt paths are recorded.',
  };
}

function writeApprovalQueue(summary) {
  const items = approvalQueueItems(summary.processed);
  if (!items.length) {
    return { count: 0, markdown_path: '', json_path: '' };
  }
  if (DRY_RUN) {
    return { count: items.length, markdown_path: '(dry-run-no-approval-queue-written)', json_path: '(dry-run-no-approval-queue-written)' };
  }

  const base = `${RUN_ID}-daily-us-ai-job-applications-approval-queue`;
  const jsonPath = path.join(APPROVAL_QUEUE_DIR, `${base}.json`);
  const markdownPath = path.join(APPROVAL_QUEUE_DIR, `${base}.md`);
  const payload = {
    automation_id: AUTOMATION_ID,
    generated_at: new Date().toISOString(),
    run_id: RUN_ID,
    status: summary.status,
    submit_mode: summary.submit_mode,
    count: items.length,
    report_path: summary.report_path || '',
    items,
    prompt_cache: promptCacheTelemetry(),
  };

  const markdown = [
    `# Daily US AI Job Applications Approval Queue - ${payload.generated_at}`,
    '',
    `- Automation: \`${AUTOMATION_ID}\``,
    `- Run status: \`${summary.status}\``,
    `- Submit mode: \`${summary.submit_mode}\``,
    `- Items needing Paulo: \`${items.length}\``,
    `- Run report: \`${summary.report_path || ''}\``,
    '',
    '## Queue',
    '',
    '| # | Company | Role | Score | Status | Action | Evidence | Blocker |',
    '|---:|---|---|---:|---|---|---|---|',
    ...items.map((item, index) => (
      `| ${index + 1} | ${markdownCell(item.company, 80)} | ${markdownCell(item.role, 100)} | ${item.score || ''} | ${markdownCell(item.status, 40)} | ${markdownCell(item.action, 180)} | ${markdownCell(item.evidence_paths[0] || item.manifest_path || item.report_path, 140)} | ${markdownCell(item.blocker, 220)} |`
    )),
    '',
    '## Required Field Gaps',
    '',
    ...items.flatMap((item, index) => [
      `### ${index + 1}. ${item.company} - ${item.role}`,
      '',
      item.unresolved_fields.length
        ? item.unresolved_fields.map((field) => `- ${field}: ${item.suggested_answers[field] || 'Needs Paulo review.'}`).join('\n')
        : '- No explicit unfilled required-field list captured.',
      '',
      `- CV: \`${item.cv_path || ''}\``,
      `- Cover letter: \`${item.cover_letter_path || ''}\``,
      `- Answers: \`${item.answers_path || ''}\``,
      `- Manifest: \`${item.manifest_path || ''}\``,
      `- Evidence: \`${item.evidence_paths.join('`, `')}\``,
      '',
    ]),
    '## Prompt Cache',
    '',
    '```yaml',
    [
      'policy: "/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md"',
      'strategy: "cli-prefix-layout"',
      'cache_key_or_tag: "paulo:n8n-daily-us-ai-job-applications:career-ops:2026-06-30"',
      'prefix_version: "2026-06-30-career-ops-n8n-apply-v1"',
      'prefix_hash_recorded: false',
      'cached_tokens: null',
      'input_tokens: null',
      'output_tokens: null',
      'cache_hit_rate: null',
      'notes: "Node/n8n wrapper does not expose provider prompt-cache token telemetry."',
    ].join('\n'),
    '```',
  ].join('\n');

  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  writeFileSync(markdownPath, `${markdown}\n`, 'utf8');
  return {
    count: items.length,
    markdown_path: path.relative(ROOT, markdownPath),
    json_path: path.relative(ROOT, jsonPath),
  };
}

function writeRunReport(summary) {
  if (DRY_RUN) return '(dry-run-no-report-written)';
  const reportPath = path.join(REPORT_DIR, `${RUN_ID}-daily-us-ai-job-applications.md`);
  const lines = [
    `# Daily US AI Job Applications - ${new Date().toISOString()}`,
    '',
    `- Automation: \`${AUTOMATION_ID}\``,
    `- Status: \`${summary.status}\``,
    `- Submit mode: \`${summary.submit_mode}\``,
    `- Scan added: \`${summary.scan_added}\``,
    `- Mail added: \`${summary.mail_added}\``,
    `- Processed: \`${summary.processed.length}\``,
    `- Submitted: \`${summary.submitted_count}\``,
    `- Ready for submit: \`${summary.ready_count}\``,
    `- Blocked/failed: \`${summary.blocked_count}\``,
    `- Auto-archived stale pipeline URLs: \`${summary.archived_pipeline_count || 0}\``,
    `- Approval queue: \`${summary.approval_queue?.markdown_path || ''}\``,
    '',
    '## Results',
    '',
    '| Company | Role | Score | Status | Evidence | Blocker |',
    '|---|---|---:|---|---|---|',
    ...summary.processed.map((item) => (
      `| ${item.company || ''} | ${item.role || ''} | ${item.score ?? ''} | ${item.status} | ${item.evidence_path || item.manifest_path || item.report_path || ''} | ${String(item.blocker || '').replace(/\|/g, '/').slice(0, 180)} |`
    )),
    '',
    '## Approval Queue',
    '',
    summary.approval_queue?.count
      ? `Review queue: \`${summary.approval_queue.markdown_path}\``
      : 'No item required Paulo approval in this run.',
    '',
    '## Settings',
    '',
    '```json',
    JSON.stringify(summary.settings, null, 2),
    '```',
    '',
    '## Prompt Cache',
    '',
    '```json',
    JSON.stringify(promptCacheTelemetry(), null, 2),
    '```',
  ];
  writeFileSync(reportPath, `${lines.join('\n')}\n`, 'utf8');
  return path.relative(ROOT, reportPath);
}

function runSelfTest() {
  const usRelocationProfile = {
    location: {
      us_work_authorization: 'Not currently authorized to work in the United States.',
      visa_status: 'US: needs employer-supported visa/relocation, internal transfer path, or contractor-to-US conversion path.',
      onsite_availability: 'Willing to relocate to the United States for the right AI/agents/GTM role with sponsorship.',
      country: 'Brazil',
    },
    compensation: {
      location_flexibility: 'US-first, open to US hybrid/onsite for top-tier AI roles.',
    },
  };
  const checks = [
    ['slugify', slugify('Strategic Account Executive, AI Native') === 'strategic-account-executive-ai-native'],
    ['score', parseScore('Global Score: 4.4/5') === 4.4],
    ['target', isTarget({ company: 'OpenAI', role: 'Account Director, Financial Services AI' })],
    ['blocked-title', !isTarget({ company: 'Acme', role: 'SDR AI' })],
    ['blocked-servicenow-brazil', !isTarget({ company: 'ServiceNow', role: 'Account Executive AI', location: 'Sao Paulo, Brazil' })],
    ['blocked-elevenlabs', !isTarget({ company: 'ElevenLabs', role: 'Enterprise Account Executive AI', location: 'Remote US' })],
    ['blocked-pure-ml-research', !isTarget({ company: 'Bland AI', role: 'Machine Learning Researcher, Multimodal LLMs', location: 'San Francisco' })],
    ['allowed-forward-deployed-ai', isTarget({ company: 'Bland AI', role: 'Forward Deployed AI Engineer', location: 'San Francisco' })],
    ['ashby-spam-blocker', /possible spam/i.test(detectSubmitBlocker("We couldn't submit your application. Your application submission was flagged as possible spam."))],
    ['missing-fields', unresolvedFieldsFromBlocker('unfilled required fields: Country*, text, Do you require visa sponsorship?*').length === 3],
    ['suggested-answer', /sponsorship/i.test(suggestedAnswerForRequiredField('Do you require visa sponsorship?'))],
    ['ashby-brazil-location-policy', ashbyLocationAutoSubmitPolicy('Brazil', usRelocationProfile).ok],
    ['ashby-us-relocation-location-policy', ashbyLocationAutoSubmitPolicy('San Francisco', usRelocationProfile).ok],
    ['ashby-unsupported-location-policy', !ashbyLocationAutoSubmitPolicy('Tokyo', usRelocationProfile).ok],
    ['autopilot-config-loaded', AUTOPILOT_CONFIG.submit_mode === 'auto_submit_low_risk'],
    ['application-positioning', /agentic|enterprise/i.test(applicationPositioning({
      role: 'Enterprise Account Executive, AI Agents',
      company: 'Acme AI',
      reportText: 'The role owns enterprise GTM, AI agent workflow adoption and customer-facing solution architecture.',
      profile: usRelocationProfile,
    }).summary)],
    ['approval-queue-item', approvalQueueItems([{
      status: 'ready_for_submit',
      needs_paulo_approval: true,
      company: 'Acme AI',
      role: 'Enterprise Account Executive',
      score: 4.3,
      blocker: 'unfilled required fields: Country*, Do you require visa sponsorship?*',
      report_path: 'reports/example.md',
      cv_path: 'output/example-resume.pdf',
    }])[0]?.priority === 'submit-review'],
  ];
  const failed = checks.filter(([, ok]) => !ok);
  if (failed.length) {
    console.error(JSON.stringify({ ok: false, failed: failed.map(([name]) => name) }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({ ok: true, checks: checks.map(([name]) => name) }, null, 2));
}

async function main() {
  if (SELF_TEST) return runSelfTest();
  const runTimeout = startRunTimeout();
  ensureDirs();
  ensurePipeline();

  const summary = {
    ok: true,
    automation_id: AUTOMATION_ID,
    timestamp: new Date().toISOString(),
    status: 'completed',
    submit_mode: SETTINGS.submitMode,
    settings: SETTINGS,
    dry_run: DRY_RUN,
    scan_added: 0,
    mail_added: 0,
    processed: [],
    submitted_count: 0,
    ready_count: 0,
    draft_count: 0,
    evaluated_count: 0,
    blocked_count: 0,
    archived_pipeline_count: 0,
    approval_queue: { count: 0, markdown_path: '', json_path: '' },
    report_path: '',
    errors: [],
  };

  const sync = run(NODE, ['cv-sync-check.mjs'], { allowFail: true, timeout: 120000 });
  if (!sync.ok) summary.errors.push(`cv-sync-check: ${redact(sync.stdout || sync.stderr || sync.error).slice(-800)}`);

  const mail = extractJobUrlsFromMail();
  if (mail.ok) summary.mail_added = appendToPipeline((mail.offers || []).filter(isTarget));
  else summary.errors.push(`mail: ${mail.error || 'failed'}`);

  const scan = runScan();
  if (!scan.ok) summary.errors.push(`scan: ${redact(scan.stderr || scan.stdout || scan.error).slice(-1000)}`);
  const scanAddedMatch = (scan.stdout || '').match(/(\d+)\s+new entries added/i);
  if (scanAddedMatch) summary.scan_added = Number(scanAddedMatch[1]);

  const submittedIndex = submittedApplicationIndex();
  const previousAttemptIndex = previousApplicationAttemptIndex();
  const allPending = readPipelinePending();
  const nonTargetArchiveLimit = Math.max(SETTINGS.dailyLimit, SETTINGS.maxAttempts, 1);
  const nonTargetPending = allPending
    .filter((item) => !isTarget(item))
    .slice(0, nonTargetArchiveLimit)
    .map((item) => ({
      url: item.url,
      company: item.company,
      role: item.role,
      location: item.location,
      status: 'skipped_not_target',
      application_status: 'not_target_profile_policy',
      submitted: false,
      needs_paulo_approval: false,
      blocker: notTargetReason(item),
    }));
  summary.processed.push(...nonTargetPending);
  const seenPending = new Set();
  const pending = allPending
    .filter(isTarget)
    .filter((item) => {
      const key = applicationUrlKey(item.url);
      if (!key || seenPending.has(key)) return false;
      seenPending.add(key);
      return true;
    })
    .slice(0, SETTINGS.maxAttempts);
  for (const item of pending) {
    try {
      // Process sequentially: one browser/ATS at a time.
      const result = await processItem(item, submittedIndex, previousAttemptIndex);
      summary.processed.push(result);
      if (result.submitted) {
        submittedIndex.set(applicationUrlKey(result.url), {
          url: result.url,
          company: result.company || '',
          role: result.role || '',
          submitted_at: result.started_at || new Date().toISOString(),
          evidence_path: result.confirmation_path || result.evidence_path || '',
          report_path: result.report_path || '',
          manifest_path: result.manifest_path || '',
          source_path: result.manifest_path || result.report_path || '',
        });
      }
      const productive = !isStalePipelineResult(result);
      if (productive && summary.processed.filter((processed) => !isStalePipelineResult(processed)).length >= SETTINGS.dailyLimit) {
        break;
      }
    } catch (error) {
      summary.processed.push({
        url: item.url,
        company: item.company,
        role: item.role,
        status: 'failed',
        blocker: redact(error.message),
      });
    }
  }
  summary.archived_pipeline_count = archivePipelineUrls(summary.processed);

  summary.submitted_count = summary.processed.filter((item) => item.submitted).length;
  summary.ready_count = summary.processed.filter((item) => item.status === 'ready_for_submit').length;
  summary.draft_count = summary.processed.filter((item) => item.status === 'draft_ready').length;
  summary.evaluated_count = summary.processed.filter((item) => item.status === 'evaluated').length;
  summary.blocked_count = summary.processed.filter((item) => ['blocked', 'failed', 'skipped_expired'].includes(item.status)).length;
  if (summary.processed.length === 0) summary.status = 'no_hit';
  else if (summary.submitted_count > 0) summary.status = 'submitted';
  else if (summary.ready_count > 0) summary.status = 'ready_for_submit';
  else if (summary.draft_count > 0) summary.status = 'draft_ready';
  else if (summary.blocked_count > 0) summary.status = 'blocked';
  else if (summary.evaluated_count > 0) summary.status = 'evaluated';
  else if (summary.processed.every(isStalePipelineResult)) summary.status = 'no_hit';

  summary.report_path = path.relative(ROOT, path.join(REPORT_DIR, `${RUN_ID}-daily-us-ai-job-applications.md`));
  summary.approval_queue = writeApprovalQueue(summary);
  summary.report_path = writeRunReport(summary);
  const output = canonicalOutput(summary);
  if (!JSON_ONLY) console.log(`Daily job application run: ${summary.status}`);
  console.log(JSON.stringify(output, null, 2));
  if (runTimeout) clearTimeout(runTimeout);
}

function canonicalOutput(summary) {
  const item = pickPrimaryProcessed(summary.processed);
  const evidence = [
    ...(Array.isArray(item?.evidence_paths) ? item.evidence_paths : []),
    item?.evidence_path,
    item?.confirmation_path,
  ].filter(Boolean);
  const submitted = Boolean(item?.submitted);
  const status = normalizeStatus(summary.status);
  return {
    status,
    automation_id: AUTOMATION_ID,
    timestamp: summary.timestamp,
    company: item?.company || '',
    role: item?.role || '',
    score: Number(item?.score || 0),
    url: item?.url || '',
    report_path: summary.report_path || item?.report_path || '',
    cv_path: item?.cv_path || '',
    cover_letter_path: item?.cover_letter_path || '',
    application_status: item?.application_status || item?.status || status,
    submit_mode: SETTINGS.submitMode,
    submitted,
    blocker: item?.blocker || summary.errors?.[0] || '',
    needs_paulo_approval: !submitted && ['draft_ready', 'ready_for_submit', 'blocked', 'failed'].includes(status),
    evidence_paths: [...new Set(evidence)],
    ok: summary.ok,
    submitted_count: summary.submitted_count,
    ready_count: summary.ready_count,
    draft_count: summary.draft_count,
    evaluated_count: summary.evaluated_count,
    blocked_count: summary.blocked_count,
    archived_pipeline_count: summary.archived_pipeline_count || 0,
    approval_count: summary.approval_queue?.count || 0,
    approval_queue_path: summary.approval_queue?.markdown_path || '',
    approval_queue_json_path: summary.approval_queue?.json_path || '',
    processed_count: summary.processed.length,
    application_report_path: item?.report_path || '',
    answers_path: item?.answers_path || '',
    manifest_path: item?.manifest_path || '',
    processed: summary.processed,
    errors: summary.errors,
  };
}

function pickPrimaryProcessed(processed) {
  const priorities = ['submitted', 'ready_for_submit', 'draft_ready', 'blocked', 'failed', 'evaluated', 'skipped_expired'];
  for (const status of priorities) {
    const found = processed.find((item) => item.status === status || (status === 'submitted' && item.submitted));
    if (found) return found;
  }
  return processed[0] || null;
}

function normalizeStatus(status) {
  if (['no_hit', 'evaluated', 'draft_ready', 'ready_for_submit', 'submitted', 'blocked', 'failed'].includes(status)) {
    return status;
  }
  if (status === 'skipped_expired') return 'evaluated';
  return status ? 'failed' : 'no_hit';
}

main().catch((error) => {
  const failed = {
    ok: false,
    automation_id: AUTOMATION_ID,
    status: 'failed',
    timestamp: new Date().toISOString(),
    error: redact(error.stack || error.message),
  };
  console.log(JSON.stringify(failed, null, 2));
  process.exit(1);
});
