#!/usr/bin/env node
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const projectDir = process.env.PROJECT_DIR || '/Users/paulopierrondi/Projects/career-ops';
const host = process.env.CAREER_OPS_N8N_OLLAMA_CODEX_BRIDGE_HOST || '127.0.0.1';
const port = Number(process.env.CAREER_OPS_N8N_OLLAMA_CODEX_BRIDGE_PORT || 18767);
const token = process.env.CAREER_OPS_N8N_BRIDGE_TOKEN;
const ollamaBaseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
const ollamaModel = process.env.OLLAMA_MODEL || process.env.N8N_OLLAMA_MODEL || 'qwen3-coder:30b';
const geminiModel = process.env.GEMINI_MODEL || process.env.N8N_GEMINI_MODEL || 'gemini-2.5-flash-lite';
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
const outputDir = path.join(projectDir, '.brain', 'automation-runs', 'n8n-ollama-codex');
const codexAutorun = boolEnv('N8N_OLLAMA_CODEX_AUTORUN', false);
const geminiAutorun = boolEnv('N8N_OLLAMA_GEMINI_AUTORUN', false);
const geminiRequiresReason = boolEnv('N8N_OLLAMA_GEMINI_REQUIRE_REASON', true);
const allowWorkspaceWrite = boolEnv('N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE', false);
const codexCommand = process.env.N8N_CODEX_COMMAND || 'codex';
const maxBodyBytes = numberEnv('N8N_OLLAMA_CODEX_MAX_BODY_BYTES', 1024 * 1024);

if (args.includes('--self-test')) {
  selfTest();
  process.exit(0);
}

if (!token) {
  throw new Error('CAREER_OPS_N8N_BRIDGE_TOKEN missing');
}

mkdirSync(outputDir, { recursive: true });

function boolEnv(name, fallback) {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  return !/^(0|false|no|off)$/i.test(raw);
}

function numberEnv(name, fallback) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function redact(value) {
  return String(value || '')
    .replace(/(api[_-]?key|token|secret|password|cookie|authorization)=([^ \n]+)/ig, '$1=[REDACTED]')
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, 'Bearer [REDACTED]')
    .replace(/sk-[A-Za-z0-9._-]+/g, 'sk-[REDACTED]')
    .replace(/sk-or-v1-[A-Za-z0-9._-]+/g, 'sk-or-v1-[REDACTED]');
}

function slugify(value) {
  const slug = String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'task';
}

function json(res, status, body) {
  const payload = `${JSON.stringify(body, null, 2)}\n`;
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  res.end(payload);
}

function isAuthorized(req) {
  return req.headers['x-career-ops-token'] === token;
}

function readRequestJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      raw += chunk;
      if (Buffer.byteLength(raw, 'utf8') > maxBodyBytes) {
        reject(new Error(`request body too large; max=${maxBodyBytes}`));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!raw.trim()) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error(`invalid JSON body: ${error.message}`));
      }
    });
    req.on('error', reject);
  });
}

function extractJsonObject(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {}

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1]);
    } catch {}
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }
  return null;
}

function latestReportFiles() {
  const specs = [
    {
      source: 'freelance_mail_radar',
      dir: path.join(projectDir, 'reports', 'freelance'),
      suffix: 'n8n-freelance-mail-radar.json',
    },
    {
      source: 'daily_job_applications',
      dir: path.join(projectDir, 'reports', 'job-applications'),
      suffix: 'n8n-daily-us-ai-job-applications.json',
    },
  ];

  const out = [];
  for (const spec of specs) {
    if (!existsSync(spec.dir)) continue;
    const file = readdirSync(spec.dir)
      .filter((name) => name.endsWith(spec.suffix))
      .map((name) => {
        const full = path.join(spec.dir, name);
        return { full, name, mtimeMs: statSync(full).mtimeMs };
      })
      .sort((a, b) => b.mtimeMs - a.mtimeMs)[0];
    if (file) out.push({ source: spec.source, path: file.full });
  }
  return out;
}

function summarizeReport(file) {
  const raw = readFileSync(file.path, 'utf8');
  const parsed = extractJsonObject(raw) || {};
  return {
    source: file.source,
    path: file.path,
    ok: parsed.ok ?? null,
    status: parsed.status ?? null,
    actionable: parsed.actionable ?? null,
    checked_messages: parsed.checked_messages ?? null,
    parsed_candidates: parsed.parsed_candidates ?? null,
    submitted_count: parsed.submitted_count ?? null,
    ready_count: parsed.ready_count ?? null,
    blocked_count: parsed.blocked_count ?? null,
    report_path: parsed.report_path ?? null,
    draft_paths: Array.isArray(parsed.draft_paths) ? parsed.draft_paths.slice(0, 8) : [],
    top: Array.isArray(parsed.top) ? parsed.top.slice(0, 5) : [],
    errors: Array.isArray(parsed.errors) ? parsed.errors.slice(0, 5) : [],
    processed: Array.isArray(parsed.processed) ? parsed.processed.slice(0, 5) : [],
  };
}

function buildLatestPayload(extra = {}) {
  const reports = latestReportFiles().map(summarizeReport);
  return {
    source: 'career-ops-n8n-latest',
    generated_at: new Date().toISOString(),
    project_dir: projectDir,
    reports,
    instruction: extra.instruction || 'Review the latest n8n automation outputs and decide whether a Codex follow-up task is useful.',
    requested_by: extra.requested_by || 'n8n',
    ...extra,
  };
}

function buildPrompt(payload) {
  return [
    'You are the local Ollama supervisor for Paulo career-ops n8n automations.',
    '',
    'Return strict JSON only. No markdown. No chain of thought.',
    '',
    'Your job:',
    '- Read the compact automation payload.',
    '- Decide if Codex or Gemini should do follow-up work.',
    '- Prepare one precise executor task when useful.',
    '- Preserve all human gates.',
    '',
    'Hard gates:',
    '- No secrets in output.',
    '- No Git push, merge, deploy, production change, paid ads, App Store/TestFlight, social publishing, migrations, force push, secret rotation, or bulk Linear change.',
    '- Proposal submission, credit spend, boost, platform messaging, CAPTCHA, login, 2FA, payment, profile, tax, identity, or off-platform contact requires Paulo approval.',
    '- If a task touches those gates, set requires_paulo_approval=true and choose a queue_* action, not a run_* action.',
    '- Prefer small reversible tasks: inspect, report, create draft, update docs, add tests, improve local scripts.',
    '',
    'Routing rules:',
    '- Use Codex for local patches, tests, repo integration, technical closure, and file changes.',
    '- Use Gemini only as a last-resort report-only fallback: independent validation, second opinion, API-backed reasoning, or cases where local Ollama is explicitly uncertain.',
    '- If the payload is clear enough for local logic, set local_resolution="clear", action="none" or a Codex queue action, and leave gemini_reason empty.',
    '- Gemini must be report-only from this bridge.',
    '',
    'Allowed actions:',
    '- "none": no follow-up.',
    '- "queue_codex_task": write a Codex task for human/manual execution.',
    '- "queue_gemini_task": write a Gemini validation task for human/manual execution.',
    '- "run_codex_report_only": Codex may inspect and produce a report only.',
    '- "run_codex_workspace_write": Codex may edit local files only if risk is low and explicitly allowed by env.',
    '- "run_gemini_report_only": Gemini API may produce an independent report only if risk is low and explicitly allowed by env.',
    '',
    'Risk labels: "low", "medium", "high", "human_gate".',
    '',
    'Required JSON shape:',
    '{',
    '  "risk": "low|medium|high|human_gate",',
    '  "local_resolution": "clear|ambiguous|needs_external_validation",',
    '  "action": "none|queue_codex_task|queue_gemini_task|run_codex_report_only|run_codex_workspace_write|run_gemini_report_only",',
    '  "requires_paulo_approval": true,',
    '  "summary": "one paragraph in Portuguese",',
    '  "codex_task": "single concrete task for the chosen executor, or empty string",',
    '  "gemini_reason": "why Gemini is necessary as last resort, or empty string",',
    '  "evidence": ["paths or facts from payload"],',
    '  "guardrails": ["specific gates Codex must preserve"]',
    '}',
    '',
    'Payload:',
    redact(JSON.stringify(payload, null, 2)).slice(0, 24000),
  ].join('\n');
}

async function callOllama(payload) {
  const response = await fetch(`${ollamaBaseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: ollamaModel,
      stream: false,
      format: 'json',
      options: {
        temperature: 0.1,
        num_ctx: 8192,
      },
      messages: [
        {
          role: 'system',
          content: 'You are a strict JSON automation supervisor. Return JSON only. Do not expose secrets.',
        },
        {
          role: 'user',
          content: buildPrompt(payload),
        },
      ],
    }),
    signal: AbortSignal.timeout(numberEnv('N8N_OLLAMA_TIMEOUT_MS', 120000)),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama request failed (${response.status}): ${body.slice(0, 500)}`);
  }

  const data = await response.json();
  const content = data?.message?.content || '';
  const parsed = extractJsonObject(content);
  if (!parsed) {
    throw new Error(`Ollama returned non-JSON content: ${content.slice(0, 500)}`);
  }
  return normalizeTriage(parsed);
}

function normalizeTriage(raw) {
  const risks = new Set(['low', 'medium', 'high', 'human_gate']);
  const localResolutions = new Set(['clear', 'ambiguous', 'needs_external_validation']);
  const actions = new Set(['none', 'queue_codex_task', 'queue_gemini_task', 'run_codex_report_only', 'run_codex_workspace_write', 'run_gemini_report_only']);
  const risk = risks.has(raw.risk) ? raw.risk : 'medium';
  const localResolution = localResolutions.has(raw.local_resolution) ? raw.local_resolution : 'ambiguous';
  let action = actions.has(raw.action) ? raw.action : 'queue_codex_task';
  let requiresPauloApproval = Boolean(raw.requires_paulo_approval);
  const geminiReason = redact(String(raw.gemini_reason || '').trim()).slice(0, 1000);

  if (risk === 'high' || risk === 'human_gate') {
    requiresPauloApproval = true;
    if (action !== 'none') action = action.includes('gemini') ? 'queue_gemini_task' : 'queue_codex_task';
  }

  if (action === 'run_codex_workspace_write' && !allowWorkspaceWrite) {
    action = 'queue_codex_task';
  }

  if (action === 'run_gemini_report_only' && !geminiAutorun) {
    action = 'queue_gemini_task';
  }

  const codexTask = redact(String(raw.codex_task || '').trim()).slice(0, 12000);
  if (action.includes('gemini') && (localResolution === 'clear' || (geminiRequiresReason && !geminiReason))) {
    action = 'none';
  }
  if (!codexTask && action !== 'none') action = 'none';

  return {
    risk,
    local_resolution: localResolution,
    action,
    executor: inferExecutor(action),
    requires_paulo_approval: requiresPauloApproval,
    summary: redact(String(raw.summary || 'No summary returned.')).slice(0, 2000),
    codex_task: codexTask,
    gemini_reason: geminiReason,
    evidence: Array.isArray(raw.evidence) ? raw.evidence.map((x) => redact(String(x)).slice(0, 500)).slice(0, 12) : [],
    guardrails: Array.isArray(raw.guardrails) ? raw.guardrails.map((x) => redact(String(x)).slice(0, 500)).slice(0, 12) : [],
  };
}

function inferExecutor(action) {
  if (String(action).includes('gemini')) return 'gemini';
  if (String(action).includes('codex')) return 'codex';
  return 'none';
}

function geminiModelPath() {
  const raw = geminiModel.replace(/^models\//, '');
  return `models/${encodeURIComponent(raw)}`;
}

function writeTask(payload, analysis) {
  const ts = timestamp();
  const slug = slugify(analysis.action === 'none' ? 'no-follow-up' : analysis.codex_task);
  const dir = path.join(outputDir, today());
  mkdirSync(dir, { recursive: true });
  const jsonPath = path.join(dir, `${ts}-${slug}.json`);
  const mdPath = path.join(dir, `${ts}-${slug}.md`);
  const record = {
    ok: true,
    created_at: new Date().toISOString(),
    mode: codexAutorun || geminiAutorun ? 'autorun_enabled' : 'queue_only',
    ollama: {
      base_url: ollamaBaseUrl,
      model: ollamaModel,
    },
    gemini: {
      model: geminiModel,
      api_key_available: Boolean(geminiApiKey),
      autorun: geminiAutorun,
      require_reason: geminiRequiresReason,
    },
    analysis,
    payload,
  };
  writeFileSync(jsonPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
  writeFileSync(mdPath, renderTaskMarkdown(record), 'utf8');
  return { jsonPath, mdPath };
}

function renderTaskMarkdown(record) {
  const { analysis, payload } = record;
  return [
    `# n8n Ollama to Codex Task - ${record.created_at}`,
    '',
    `- Mode: ${record.mode}`,
    `- Ollama model: ${record.ollama.model}`,
    `- Recommended executor: ${analysis.executor}`,
    `- Risk: ${analysis.risk}`,
    `- Local resolution: ${analysis.local_resolution}`,
    `- Action: ${analysis.action}`,
    `- Requires Paulo approval: ${analysis.requires_paulo_approval}`,
    `- Gemini reason: ${analysis.gemini_reason || 'n/a'}`,
    '',
    '## Summary',
    '',
    analysis.summary,
    '',
    '## Executor Task',
    '',
    analysis.codex_task || '_No executor task recommended._',
    '',
    '## Evidence',
    '',
    ...(analysis.evidence.length ? analysis.evidence.map((item) => `- ${item}`) : ['- n/a']),
    '',
    '## Guardrails',
    '',
    ...(analysis.guardrails.length ? analysis.guardrails.map((item) => `- ${item}`) : ['- Preserve career-ops hard gates.']),
    '',
    '## Source Payload',
    '',
    '```json',
    redact(JSON.stringify(payload, null, 2)).slice(0, 24000),
    '```',
    '',
  ].join('\n');
}

function shouldRunCodex(analysis) {
  if (!codexAutorun) return { run: false, reason: 'N8N_OLLAMA_CODEX_AUTORUN is false' };
  if (analysis.requires_paulo_approval) return { run: false, reason: 'analysis requires Paulo approval' };
  if (analysis.risk !== 'low') return { run: false, reason: `risk is ${analysis.risk}, not low` };
  if (analysis.action === 'run_codex_report_only') return { run: true, risk: 'report_only' };
  if (analysis.action === 'run_codex_workspace_write' && allowWorkspaceWrite) return { run: true, risk: 'workspace_write' };
  return { run: false, reason: `action ${analysis.action} is not autorunnable` };
}

function shouldRunGemini(analysis) {
  if (!geminiAutorun) return { run: false, reason: 'N8N_OLLAMA_GEMINI_AUTORUN is false' };
  if (!geminiApiKey) return { run: false, reason: 'GEMINI_API_KEY is not available in the process environment' };
  if (analysis.requires_paulo_approval) return { run: false, reason: 'analysis requires Paulo approval' };
  if (analysis.risk !== 'low') return { run: false, reason: `risk is ${analysis.risk}, not low` };
  if (analysis.local_resolution === 'clear') return { run: false, reason: 'local Ollama resolution is clear; Gemini fallback not needed' };
  if (geminiRequiresReason && !analysis.gemini_reason) return { run: false, reason: 'Gemini fallback reason is missing' };
  if (analysis.action === 'run_gemini_report_only') return { run: true, risk: 'report_only' };
  return { run: false, reason: `action ${analysis.action} is not a Gemini autorun action` };
}

function runCodex(analysis, taskFiles) {
  const gate = shouldRunCodex(analysis);
  if (!gate.run) return Promise.resolve({ ran: false, reason: gate.reason });

  const prompt = [
    'You are Codex running from a local n8n automation in career-ops.',
    '',
    'Preserve all project hard gates: no secrets, no push/merge/deploy, no production changes, no paid ads, no App Store/TestFlight, no social publishing, no migrations, no force push, no bulk Linear changes.',
    gate.risk === 'report_only'
      ? 'This is report-only. Inspect and write a concise report; do not edit files.'
      : 'Workspace writes are allowed only for the exact local task below. Keep changes small and reversible.',
    '',
    `Task file: ${taskFiles.mdPath}`,
    '',
    'Task:',
    analysis.codex_task,
    '',
    'Evidence:',
    analysis.evidence.map((item) => `- ${item}`).join('\n') || '- n/a',
  ].join('\n');

  return new Promise((resolve) => {
    execFile(codexCommand, ['exec', prompt], {
      cwd: projectDir,
      timeout: numberEnv('N8N_OLLAMA_CODEX_TIMEOUT_MS', 1000 * 60 * 30),
      maxBuffer: 1024 * 1024 * 10,
      env: {
        ...process.env,
        PROJECT_DIR: projectDir,
        AGENT_HUB_TASK_SOURCE: 'n8n-ollama-codex-bridge',
      },
    }, (error, stdout, stderr) => {
      if (error) {
        return resolve({
          ran: true,
          ok: false,
          code: error.code ?? null,
          signal: error.signal ?? null,
          stdout_tail: redact(stdout).slice(-4000),
          stderr_tail: redact(stderr).slice(-4000),
        });
      }
      return resolve({
        ran: true,
        ok: true,
        stdout_tail: redact(stdout).slice(-4000),
        stderr_tail: redact(stderr).slice(-2000),
      });
    });
  });
}

async function runGemini(analysis, taskFiles, payload) {
  const gate = shouldRunGemini(analysis);
  if (!gate.run) return { ran: false, reason: gate.reason };

  const prompt = [
    'You are Gemini running as an independent report-only validator for Paulo career-ops.',
    '',
    'Preserve all hard gates: no secrets, no push/merge/deploy, no production changes, no paid ads, no App Store/TestFlight, no social publishing, no migrations, no force push, no bulk Linear changes.',
    'This is report-only. Do not ask for secret values. Do not instruct any gated action as approved.',
    '',
    `Task file: ${taskFiles.mdPath}`,
    '',
    'Task:',
    analysis.codex_task,
    '',
    'Evidence:',
    analysis.evidence.map((item) => `- ${item}`).join('\n') || '- n/a',
    '',
    'Payload:',
    redact(JSON.stringify(payload, null, 2)).slice(0, 12000),
  ].join('\n');

  const url = `https://generativelanguage.googleapis.com/v1beta/${geminiModelPath()}:generateContent?key=${encodeURIComponent(geminiApiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 2048,
      },
    }),
    signal: AbortSignal.timeout(numberEnv('N8N_GEMINI_TIMEOUT_MS', 120000)),
  });

  if (!response.ok) {
    const body = await response.text();
    return {
      ran: true,
      ok: false,
      status: response.status,
      error: redact(body).slice(0, 1000),
    };
  }

  const data = await response.json();
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || '')
    .join('\n')
    .trim();

  const reportPath = taskFiles.mdPath.replace(/\.md$/, '-gemini-report.md');
  writeFileSync(reportPath, [
    `# Gemini Report - ${new Date().toISOString()}`,
    '',
    `- Model: ${geminiModel}`,
    `- Task file: ${taskFiles.mdPath}`,
    '',
    text || '_Gemini returned an empty report._',
    '',
  ].join('\n'), 'utf8');

  return {
    ran: true,
    ok: Boolean(text),
    model: geminiModel,
    report_path: reportPath,
  };
}

async function health() {
  try {
    const response = await fetch(`${ollamaBaseUrl}/api/tags`, {
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const models = Array.isArray(data.models) ? data.models.map((model) => model.name).slice(0, 20) : [];
    return {
      ok: true,
      service: 'career-ops-n8n-ollama-codex-bridge',
      ollama_ok: true,
      ollama_base_url: ollamaBaseUrl,
      ollama_model: ollamaModel,
      model_available: models.includes(ollamaModel),
      models,
      codex_autorun: codexAutorun,
      allow_workspace_write: allowWorkspaceWrite,
      gemini_model: geminiModel,
      gemini_api_key_available: Boolean(geminiApiKey),
      gemini_autorun: geminiAutorun,
      gemini_requires_reason: geminiRequiresReason,
    };
  } catch (error) {
    return {
      ok: true,
      service: 'career-ops-n8n-ollama-codex-bridge',
      ollama_ok: false,
      ollama_base_url: ollamaBaseUrl,
      ollama_model: ollamaModel,
      error: error.message,
      codex_autorun: codexAutorun,
      allow_workspace_write: allowWorkspaceWrite,
      gemini_model: geminiModel,
      gemini_api_key_available: Boolean(geminiApiKey),
      gemini_autorun: geminiAutorun,
      gemini_requires_reason: geminiRequiresReason,
    };
  }
}

async function handleTriage(req, res, latest = false) {
  if (!isAuthorized(req)) return json(res, 401, { ok: false, error: 'unauthorized' });

  try {
    const body = await readRequestJson(req);
    const payload = latest ? buildLatestPayload(body) : {
      source: body.source || 'n8n-custom',
      generated_at: new Date().toISOString(),
      project_dir: projectDir,
      ...body,
    };
    const safePayload = extractJsonObject(redact(JSON.stringify(payload))) || payload;
    const analysis = await callOllama(safePayload);
    const taskFiles = writeTask(safePayload, analysis);
    const codex = await runCodex(analysis, taskFiles);
    const gemini = await runGemini(analysis, taskFiles, safePayload);
    return json(res, 200, {
      ok: true,
      status: 'triaged',
      analysis,
      task_files: taskFiles,
      codex,
      gemini,
    });
  } catch (error) {
    return json(res, 500, {
      ok: false,
      status: 'failed',
      error: redact(error.message),
    });
  }
}

function selfTest() {
  const parsed = extractJsonObject('```json\n{"risk":"low","action":"queue_codex_task","codex_task":"review reports"}\n```');
  if (!parsed || parsed.risk !== 'low') throw new Error('extractJsonObject failed');
  const normalized = normalizeTriage({
    risk: 'high',
    action: 'run_gemini_report_only',
    local_resolution: 'needs_external_validation',
    requires_paulo_approval: false,
    summary: 'Needs deploy',
    codex_task: 'deploy production',
    gemini_reason: 'Independent validation requested',
    evidence: ['token=abc'],
  });
  if (normalized.action !== 'queue_gemini_task') throw new Error('high risk Gemini should queue');
  if (!normalized.requires_paulo_approval) throw new Error('high risk should require Paulo approval');
  if (normalized.evidence[0].includes('abc')) throw new Error('redaction failed');
  const clearGemini = normalizeTriage({
    risk: 'low',
    action: 'run_gemini_report_only',
    local_resolution: 'clear',
    requires_paulo_approval: false,
    summary: 'Local data is clear',
    codex_task: 'review locally',
    gemini_reason: 'not needed',
  });
  if (clearGemini.action !== 'none') throw new Error('clear local resolution should suppress Gemini');
  if (!geminiModelPath().startsWith('models/')) throw new Error('Gemini model path normalization failed');
  const latest = buildLatestPayload({ requested_by: 'self-test' });
  if (!latest.project_dir) throw new Error('latest payload failed');
  console.log(JSON.stringify({ ok: true, self_test: 'passed' }, null, 2));
}

const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/healthz') {
    return json(res, 200, await health());
  }

  if (req.method === 'POST' && req.url === '/triage') {
    return handleTriage(req, res, false);
  }

  if (req.method === 'POST' && req.url === '/triage-latest') {
    return handleTriage(req, res, true);
  }

  return json(res, 404, { ok: false, error: 'not_found' });
});

server.listen(port, host, () => {
  console.log(`career-ops n8n Ollama Codex bridge listening on http://${host}:${port}`);
});
