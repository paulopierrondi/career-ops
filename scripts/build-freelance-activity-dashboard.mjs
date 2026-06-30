#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TRACKER = path.join(ROOT, 'data/freelance-proposals.md');
const REPORT_DIR = path.join(ROOT, 'reports/freelance');
const OUT_DIR = path.join(REPORT_DIR, 'dashboard');
const OUT_JSON = path.join(OUT_DIR, 'freelance-activity-dashboard.json');
const OUT_HTML = path.join(OUT_DIR, 'index.html');

function read(file) {
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

function section(markdown, heading) {
  const start = markdown.indexOf(`## ${heading}`);
  if (start < 0) return '';
  const next = markdown.indexOf('\n## ', start + 4);
  return markdown.slice(start, next < 0 ? markdown.length : next);
}

function parseTableRows(markdown) {
  return markdown
    .split('\n')
    .filter((line) => /^\|.*\|$/.test(line.trim()))
    .filter((line) => !/^\|\s*-+/.test(line.trim()))
    .map((line) => splitMarkdownRow(line.trim()));
}

function splitMarkdownRow(line) {
  const inner = line.slice(1, -1);
  const cells = [];
  let current = '';
  let inCode = false;
  for (let index = 0; index < inner.length; index++) {
    const char = inner[index];
    if (char === '`') inCode = !inCode;
    if (char === '|' && !inCode) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
}

function linkify(value) {
  return String(value || '').replace(/`/g, '').trim();
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function rel(file) {
  return path.relative(ROOT, file);
}

function localHref(file) {
  return `../${path.relative(REPORT_DIR, file).split(path.sep).join('/')}`;
}

function parseSubmitted(markdown) {
  const rows = parseTableRows(section(markdown, 'Submitted Proposals'));
  const header = rows[0] || [];
  return rows.slice(1).map((cells) => {
    const row = Object.fromEntries(header.map((key, index) => [key, cells[index] || '']));
    const notes = row.Notes || '';
    const evidence = [...notes.matchAll(/`([^`]*(?:screenshots|reports|output|evidence)[^`]*)`/g)].map((match) => match[1]);
    const connectionMatches = [...notes.matchAll(/(\d+)\s+(?:conex(?:a|õ)es?|Connects?)/gi)].map((match) => Number(match[1]));
    const boostUsed = /\bboost\b|promo[cç][aã]o|promotion/i.test(notes) && !/sem promo[cç][aã]o|no boost/i.test(notes);
    return {
      id: row['#'],
      date: row.Date,
      platform: row.Platform,
      title: row.Project,
      buyer: row.Client,
      url: linkify(row.URL),
      netOffer: row['Net offer'],
      finalOffer: row['Final charged'],
      days: row.Days,
      status: row.Status,
      nextFollowUp: row['Next follow-up'],
      lastTouch: row['Last touch'],
      connectionSignals: connectionMatches,
      boostUsed,
      evidence,
      notes,
    };
  }).filter((row) => row.id && row.platform);
}

function parsePlatformState(markdown) {
  const rows = parseTableRows(section(markdown, 'Platform State'));
  const header = rows[0] || [];
  return rows.slice(1).map((cells) => {
    const row = Object.fromEntries(header.map((key, index) => [key, cells[index] || '']));
    return {
      platform: row.Platform,
      state: row.State,
      gate: row.Gate,
      nextAction: row['Next action'],
    };
  }).filter((row) => row.platform);
}

function readJsonFiles() {
  if (!existsSync(REPORT_DIR)) return [];
  return readdirSync(REPORT_DIR)
    .filter((name) => /n8n-freelance-mail-radar\.json$/.test(name))
    .sort()
    .map((name) => {
      const file = path.join(REPORT_DIR, name);
      try {
        const parsed = JSON.parse(read(file));
        return {
          file,
          timestamp: name.slice(0, 19),
          checked: Number(parsed.checked_messages || 0),
          parsed: Number(parsed.parsed_candidates || 0),
          newMessages: Number(parsed.new_messages || 0),
          actionable: Number(parsed.actionable || 0),
          processedIds: parsed.processed_mail_message_ids || [],
          actionableIds: parsed.actionable_mail_message_ids || [],
          reportPath: parsed.report_path || null,
          draftPaths: parsed.draft_paths || [],
          top: parsed.top || [],
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function scanReports() {
  if (!existsSync(REPORT_DIR)) return [];
  return readdirSync(REPORT_DIR)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const file = path.join(REPORT_DIR, name);
      const body = read(file);
      return {
        file,
        name,
        submitted: /submitted|submetid|envio confirmado|proposal #|Application sent|proposta enviada/i.test(body),
        emailSent: /EMAIL_SENT|sent via Mail\.app|sent via sendmail/i.test(body),
        blocked: /blocked|gate|bloque|no-go|falha|failed/i.test(body),
        title: body.match(/^#\s+(.+)$/m)?.[1] || name,
      };
    });
}

function summarize(submitted, platforms, n8nRuns, reports) {
  const byPlatform = {};
  for (const row of submitted) byPlatform[row.platform] = (byPlatform[row.platform] || 0) + 1;
  const byStatus = {};
  for (const row of submitted) byStatus[row.status] = (byStatus[row.status] || 0) + 1;
  const connectionSignalTotal = submitted.flatMap((row) => row.connectionSignals).reduce((sum, value) => sum + value, 0);
  return {
    generatedAt: new Date().toISOString(),
    submittedCount: submitted.length,
    platformsTracked: platforms.length,
    n8nRuns: n8nRuns.length,
    n8nCheckedMessages: n8nRuns.reduce((sum, run) => sum + run.checked, 0),
    n8nActionable: n8nRuns.reduce((sum, run) => sum + run.actionable, 0),
    reportCount: reports.length,
    submittedReportCount: reports.filter((report) => report.submitted).length,
    emailSentReportCount: reports.filter((report) => report.emailSent).length,
    blockedReportCount: reports.filter((report) => report.blocked).length,
    byPlatform,
    byStatus,
    connectionSignalTotal,
  };
}

function renderRows(rows) {
  return rows.map((row) => `
    <tr>
      <td>#${escapeHtml(row.id)}</td>
      <td>${escapeHtml(row.date)}</td>
      <td><span class="pill">${escapeHtml(row.platform)}</span></td>
      <td><a href="${escapeHtml(row.url)}">${escapeHtml(row.title)}</a></td>
      <td>${escapeHtml(row.netOffer)}<br><span>${escapeHtml(row.finalOffer)}</span></td>
      <td>${escapeHtml(row.status)}</td>
      <td>${escapeHtml(row.nextFollowUp || 'n/a')}</td>
      <td>${row.evidence.slice(0, 2).map((item) => `<code>${escapeHtml(item)}</code>`).join('<br>') || '<span>n/a</span>'}</td>
    </tr>`).join('');
}

function renderHtml(data) {
  const recent = data.submitted.slice(-30).reverse();
  const pending = data.submitted
    .filter((row) => /awaiting response|client replied|follow-up/i.test(row.status))
    .slice(-25)
    .reverse();
  const n8nRows = data.n8nRuns.slice(-12).reverse().map((run) => `
    <tr>
      <td><a href="${escapeHtml(localHref(run.file))}">${escapeHtml(path.basename(run.file))}</a></td>
      <td>${escapeHtml(run.timestamp)}</td>
      <td>${run.checked}</td>
      <td>${run.parsed}</td>
      <td>${run.newMessages}</td>
      <td>${run.actionable}</td>
      <td>${escapeHtml(run.processedIds.join(', ') || 'none')}</td>
    </tr>`).join('');
  const platformCards = data.platforms.map((platform) => `
    <section class="panel">
      <div class="panel-head">
        <h3>${escapeHtml(platform.platform)}</h3>
        <span class="pill">${data.summary.byPlatform[platform.platform] || 0} applied</span>
      </div>
      <p>${escapeHtml(platform.state)}</p>
      <p><strong>Gate:</strong> ${escapeHtml(platform.gate)}</p>
      <p><strong>Next:</strong> ${escapeHtml(platform.nextAction)}</p>
    </section>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Freelance Activity Dashboard</title>
  <style>
    :root { color-scheme: light; --ink:#1d2329; --muted:#65717c; --line:#d8dee5; --bg:#f6f8fa; --panel:#ffffff; --accent:#0f766e; --accent2:#b45309; }
    * { box-sizing: border-box; }
    body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background:var(--bg); color:var(--ink); }
    header { padding:24px 28px 18px; background:#fff; border-bottom:1px solid var(--line); }
    h1 { margin:0 0 6px; font-size:28px; letter-spacing:0; }
    h2 { margin:0 0 14px; font-size:18px; }
    h3 { margin:0; font-size:15px; }
    p { color:var(--muted); line-height:1.45; margin:8px 0 0; }
    main { padding:22px 28px 36px; display:grid; gap:20px; }
    .grid { display:grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap:14px; }
    .metric, .panel { background:var(--panel); border:1px solid var(--line); border-radius:8px; padding:16px; }
    .metric strong { display:block; font-size:27px; margin-bottom:4px; }
    .metric span, td span { color:var(--muted); font-size:12px; }
    .panels { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:14px; }
    .panel-head { display:flex; justify-content:space-between; gap:12px; align-items:center; }
    .pill { display:inline-flex; align-items:center; white-space:nowrap; padding:3px 8px; border-radius:999px; color:#064e3b; background:#d1fae5; font-size:12px; font-weight:650; }
    .table-wrap { overflow:auto; background:var(--panel); border:1px solid var(--line); border-radius:8px; }
    table { width:100%; border-collapse:collapse; min-width:980px; }
    th, td { padding:10px 12px; border-bottom:1px solid var(--line); text-align:left; vertical-align:top; font-size:13px; }
    th { background:#eef2f5; font-size:12px; color:#39434d; position:sticky; top:0; }
    a { color:#0f5f8f; text-decoration:none; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size:11px; color:#374151; white-space:normal; }
    .note { border-left:4px solid var(--accent2); background:#fff7ed; padding:12px 14px; border-radius:6px; color:#7c2d12; }
    @media (max-width: 1000px) { .grid, .panels { grid-template-columns:1fr; } main, header { padding-left:16px; padding-right:16px; } }
  </style>
</head>
<body>
  <header>
    <h1>Freelance Activity Dashboard</h1>
    <p>Generated ${escapeHtml(data.summary.generatedAt)} from local tracker, reports, n8n JSON runs, and evidence paths. No secrets included.</p>
  </header>
  <main>
    <section class="grid">
      <div class="metric"><strong>${data.summary.submittedCount}</strong><span>submitted/applied rows tracked</span></div>
      <div class="metric"><strong>${data.summary.n8nRuns}</strong><span>n8n radar runs captured</span></div>
      <div class="metric"><strong>${data.summary.n8nCheckedMessages}</strong><span>Mail.app messages checked by n8n</span></div>
      <div class="metric"><strong>${data.summary.connectionSignalTotal}</strong><span>connection/connect usage signals in notes</span></div>
    </section>

    <section class="note">Operational read: 99Freelas is the main applied channel; Workana remains profile-review gated; n8n radar is active and should archive processed emails after each safe run.</section>

    <section>
      <h2>Platform State</h2>
      <div class="panels">${platformCards}</div>
    </section>

    <section>
      <h2>Recent Applied / Submitted</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Platform</th><th>Project</th><th>Offer</th><th>Status</th><th>Next follow-up</th><th>Evidence</th></tr></thead>
        <tbody>${renderRows(recent)}</tbody>
      </table></div>
    </section>

    <section>
      <h2>Open Follow-up Queue</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>ID</th><th>Date</th><th>Platform</th><th>Project</th><th>Offer</th><th>Status</th><th>Next follow-up</th><th>Evidence</th></tr></thead>
        <tbody>${renderRows(pending)}</tbody>
      </table></div>
    </section>

    <section>
      <h2>n8n Radar Usage</h2>
      <div class="table-wrap"><table>
        <thead><tr><th>Run JSON</th><th>Timestamp</th><th>Checked</th><th>Parsed</th><th>New</th><th>Actionable</th><th>Processed Mail IDs</th></tr></thead>
        <tbody>${n8nRows}</tbody>
      </table></div>
    </section>
  </main>
</body>
</html>`;
}

const tracker = read(TRACKER);
const submitted = parseSubmitted(tracker);
const platforms = parsePlatformState(tracker);
const n8nRuns = readJsonFiles();
const reports = scanReports();
const data = {
  summary: summarize(submitted, platforms, n8nRuns, reports),
  platforms,
  submitted,
  n8nRuns: n8nRuns.map((run) => ({ ...run, file: rel(run.file) })),
  reports: reports.map((report) => ({ ...report, file: rel(report.file) })),
  sources: {
    tracker: rel(TRACKER),
    reports: rel(REPORT_DIR),
  },
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
writeFileSync(OUT_HTML, renderHtml({
  ...data,
  n8nRuns: n8nRuns,
}), 'utf8');

console.log(JSON.stringify({
  ok: true,
  html: OUT_HTML,
  json: OUT_JSON,
  submitted: data.summary.submittedCount,
  n8n_runs: data.summary.n8nRuns,
}, null, 2));
