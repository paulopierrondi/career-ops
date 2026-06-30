#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'reports', 'dashboards');
const OUT_JSON = path.join(OUT_DIR, 'career-ops-operations-dashboard.json');
const OUT_HTML = path.join(OUT_DIR, 'career-ops-operations-dashboard.html');

function readJson(file, fallback = null) {
  try {
    const raw = readFileSync(file, 'utf8').trim();
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    return start >= 0 && end > start ? JSON.parse(raw.slice(start, end + 1)) : fallback;
  } catch {
    return fallback;
  }
}

function files(dir, predicate) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter(predicate)
    .map((name) => path.join(dir, name))
    .sort();
}

function nestedFiles(dir, predicate) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) out.push(...nestedFiles(full, predicate));
    else if (predicate(name.name, full)) out.push(full);
  }
  return out.sort();
}

function rel(file) {
  return path.relative(ROOT, file);
}

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function latestJobRuns() {
  return files(path.join(ROOT, 'reports', 'job-applications'), (name) => name.endsWith('n8n-daily-us-ai-job-applications.json'))
    .slice(-12)
    .map((file) => {
      const data = readJson(file, {});
      return {
        file: rel(file),
        status: data.status || 'unknown',
        timestamp: data.timestamp || '',
        submitted: Number(data.submitted_count || 0),
        ready: Number(data.ready_count || 0),
        blocked: Number(data.blocked_count || 0),
        approvalCount: Number(data.approval_count || 0),
        approvalQueue: data.approval_queue_path || '',
        processed: Number(data.processed_count || data.processed?.length || 0),
      };
    });
}

function latestApprovalItems() {
  return nestedFiles(path.join(ROOT, 'reports', 'job-applications', 'approval-queue'), (name) => name.endsWith('.json'))
    .slice(-8)
    .flatMap((file) => {
      const data = readJson(file, {});
      return (data.items || []).map((item) => ({
        file: rel(file),
        company: item.company || '',
        role: item.role || '',
        status: item.status || '',
        score: item.score || '',
        unresolvedFields: item.unresolved_fields || [],
        action: item.action || '',
        evidence: item.evidence_paths?.[0] || '',
      }));
    })
    .slice(-20);
}

function freelanceState() {
  const dashboard = readJson(path.join(ROOT, 'reports', 'freelance', 'dashboard', 'freelance-activity-dashboard.json'), {});
  const n8nRuns = files(path.join(ROOT, 'reports', 'freelance'), (name) => name.endsWith('n8n-freelance-mail-radar.json'))
    .slice(-12)
    .map((file) => {
      const data = readJson(file, {});
      return {
        file: rel(file),
        timestamp: data.timestamp || '',
        checked: Number(data.checked_messages || 0),
        actionable: Number(data.actionable || 0),
        drafts: data.draft_paths?.length || 0,
        submissionAllowed: Boolean(data.proposal_submission_gate?.n8n_submission_allowed),
      };
    });
  return {
    submittedHistorical: Number(dashboard.summary?.submittedCount || dashboard.submitted || 0),
    n8nRuns,
    dashboardHtml: 'reports/freelance/dashboard/index.html',
    dashboardJson: 'reports/freelance/dashboard/freelance-activity-dashboard.json',
  };
}

function buildSnapshot() {
  const jobs = latestJobRuns();
  const approvals = latestApprovalItems();
  const freelance = freelanceState();
  return {
    generated_at: new Date().toISOString(),
    jobs: {
      latest_runs: jobs,
      submitted_total_recent: jobs.reduce((sum, run) => sum + run.submitted, 0),
      ready_total_recent: jobs.reduce((sum, run) => sum + run.ready, 0),
      approval_items: approvals,
    },
    freelance,
    gates: {
      service_now_brazil_blocked: true,
      elevenlabs_blocked: true,
      freelance_auto_submit_allowed: false,
      payments_boosts_credits_allowed: false,
      login_captcha_2fa_bypass_allowed: false,
    },
  };
}

function render(snapshot) {
  const jobRows = snapshot.jobs.latest_runs.slice().reverse().map((run) => `
    <tr><td><code>${esc(run.file)}</code></td><td>${esc(run.status)}</td><td>${run.submitted}</td><td>${run.ready}</td><td>${run.approvalCount}</td><td><code>${esc(run.approvalQueue)}</code></td></tr>`).join('');
  const approvalRows = snapshot.jobs.approval_items.slice().reverse().map((item) => `
    <tr><td>${esc(item.company)}</td><td>${esc(item.role)}</td><td>${esc(item.status)}</td><td>${esc(item.score)}</td><td>${esc(item.unresolvedFields.join('; '))}</td><td><code>${esc(item.evidence)}</code></td></tr>`).join('');
  const freelanceRows = snapshot.freelance.n8nRuns.slice().reverse().map((run) => `
    <tr><td><code>${esc(run.file)}</code></td><td>${run.checked}</td><td>${run.actionable}</td><td>${run.drafts}</td><td>${run.submissionAllowed ? 'yes' : 'no'}</td></tr>`).join('');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Career Ops Operations Dashboard</title>
<style>
body{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;margin:0;background:#f5f7f9;color:#202830}
header{background:#fff;border-bottom:1px solid #d9e0e7;padding:24px 28px}h1{margin:0;font-size:28px;letter-spacing:0}p{color:#61707e}
main{padding:22px 28px;display:grid;gap:20px}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.card,.panel{background:#fff;border:1px solid #d9e0e7;border-radius:8px;padding:16px}.card strong{font-size:28px;display:block}
table{border-collapse:collapse;width:100%;background:#fff;border:1px solid #d9e0e7;border-radius:8px;overflow:hidden}th,td{padding:9px 11px;border-bottom:1px solid #e3e8ee;text-align:left;font-size:13px;vertical-align:top}th{background:#eef2f5}
code{font-size:11px;white-space:normal}.warn{border-left:4px solid #b45309;background:#fff7ed}.ok{border-left:4px solid #0f766e;background:#ecfdf5}
@media(max-width:900px){.grid{grid-template-columns:1fr}main,header{padding-left:16px;padding-right:16px}}
</style></head><body>
<header><h1>Career Ops Operations Dashboard</h1><p>Generated ${esc(snapshot.generated_at)}. Persisted local dashboard for job applications, freelance radar and automation gates.</p></header>
<main>
<section class="grid">
<div class="card"><strong>${snapshot.jobs.submitted_total_recent}</strong><span>Recent job submissions</span></div>
<div class="card"><strong>${snapshot.jobs.ready_total_recent}</strong><span>Ready / approval queue</span></div>
<div class="card"><strong>${snapshot.freelance.submittedHistorical}</strong><span>Historical freelance proposals tracked</span></div>
<div class="card"><strong>${snapshot.freelance.n8nRuns.length}</strong><span>Recent freelance n8n runs</span></div>
</section>
<section class="panel warn"><strong>Submission Gates</strong><p>ServiceNow Brazil and ElevenLabs are blocked. Freelance auto-submit, credits, boosts, payments, login/CAPTCHA/2FA bypass and profile/payment/tax/identity changes remain blocked.</p></section>
<section><h2>Job Automation Runs</h2><table><thead><tr><th>Run</th><th>Status</th><th>Submitted</th><th>Ready</th><th>Approval</th><th>Queue</th></tr></thead><tbody>${jobRows}</tbody></table></section>
<section><h2>Approval Queue Items</h2><table><thead><tr><th>Company</th><th>Role</th><th>Status</th><th>Score</th><th>Fields</th><th>Evidence</th></tr></thead><tbody>${approvalRows}</tbody></table></section>
<section><h2>Freelance Radar Runs</h2><table><thead><tr><th>Run</th><th>Checked</th><th>Actionable</th><th>Drafts</th><th>Submit Allowed</th></tr></thead><tbody>${freelanceRows}</tbody></table></section>
<section class="panel ok"><strong>Freelance Dashboard</strong><p><code>${snapshot.freelance.dashboardHtml}</code><br><code>${snapshot.freelance.dashboardJson}</code></p></section>
</main></body></html>`;
}

mkdirSync(OUT_DIR, { recursive: true });
const snapshot = buildSnapshot();
writeFileSync(OUT_JSON, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
writeFileSync(OUT_HTML, render(snapshot), 'utf8');
console.log(JSON.stringify({ ok: true, html: OUT_HTML, json: OUT_JSON }, null, 2));
