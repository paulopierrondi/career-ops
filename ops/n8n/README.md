# Career Ops n8n

Local n8n setup for Paulo's Workana + 99Freelas radar and daily US AI job-application autopilot.

This stack runs on macOS, not Docker, because the radar reads Apple Mail through local automation. Dockerized n8n cannot access Mail.app safely.

## Runtime

- n8n package: `/Users/paulopierrondi/Projects/.tools/n8n`
- Node runtime: `/opt/homebrew/opt/node@22/bin/node`
- n8n user folder: `/Users/paulopierrondi/.n8n-career-ops`
- Local env file: `/Users/paulopierrondi/.config/career-ops-n8n/env`
- URL: `http://127.0.0.1:5678`
- LaunchAgent: `com.paulo.careerops.n8n`
- Local radar bridge: `http://127.0.0.1:18765`
- Local job-application bridge: `http://127.0.0.1:18766`
- Local Ollama/Codex supervisor bridge: `http://127.0.0.1:18767`
- Ollama default URL: `http://127.0.0.1:11434`
- Bridge LaunchAgent: `com.paulo.careerops.n8n-radar-bridge`
- Ollama/Codex bridge LaunchAgent: `com.paulo.careerops.n8n-ollama-codex-bridge`; safe defaults keep Codex/Gemini autorun disabled.

## Commands

```bash
npm run n8n:status
npm run n8n:start
npm run n8n:import
npm run n8n:radar
npm run n8n:jobs
npm run n8n:jobs:bridge
npm run n8n:ollama:bridge
npm run n8n:ollama:install-launchagent
npm run n8n:ollama:self-test
```

## Workflow

Imported workflow:

`ops/n8n/workflows/career-ops-freelance-mail-radar.json`

`ops/n8n/workflows/career-ops-daily-us-ai-job-applications.json`

`ops/n8n/workflows/career-ops-ollama-codex-supervisor.json`

Execution prompt:

`ops/n8n/freelance-execution-prompt.md`

`ops/n8n/job-application-execution-prompt.md`

## Automation Operating Policy

- n8n is the operating surface for automations.
- Ollama is the first intelligence layer for local/private triage.
- Ollama may escalate to Codex or Gemini when useful:
  - Codex: local patches, tests, repo integration and technical closure.
  - Gemini API: independent report-only validation, second opinion and API-backed reasoning.
- All executor calls preserve Agent Hub, Obsidian, Linear, secrets and human gates.
- Default posture is queue-only: Ollama writes a task/evidence file; Codex/Gemini do not run automatically unless the specific env gate is enabled.
- Gemini is last resort. Even if Gemini autorun is enabled later, the bridge requires a non-empty fallback reason and suppresses Gemini when Ollama marks the local output as clear.
- Gemini API keys stay in the central/env provider path. Do not write `GEMINI_API_KEY`, `GOOGLE_API_KEY` or any provider secret into Markdown, n8n workflows, logs or chat.

## Career Ops Authorization

Paulo granted full operational authorization for `career-ops` automations, applications, drafting, browser preparation and low-risk execution, with these standing exceptions:

- Do not apply to ServiceNow Brazil roles.
- Do not apply to ElevenLabs roles.

Technical enforcement:

- `scripts/job-application-autopilot.mjs` hard-blocks ElevenLabs and ServiceNow Brazil before liveness checks, evaluation, package generation or browser submission.
- Gemini remains last-resort/report-only by default even with the API key configured.
- Secrets, Git push/merge, production/deploy, paid ads, App Store/TestFlight, social publishing, migrations, force push, bulk Linear changes and unrelated provider secret changes remain governed by Agent Hub hard gates.

## Local Ollama Intelligence

Paulo's local LLM is Ollama. n8n now uses it in two places:

1. Freelance proposal drafts default to the local OpenAI-compatible Ollama endpoint when no explicit `OPENAI_BASE_URL` is set:
   - `OPENAI_BASE_URL=http://127.0.0.1:11434/v1`
   - `OPENAI_MODEL=$OLLAMA_MODEL`
2. The Ollama/Codex/Gemini supervisor bridge reviews latest n8n outputs and decides whether Codex or Gemini follow-up is useful:
   - bridge: `npm run n8n:ollama:bridge`
   - health: `curl http://127.0.0.1:18767/healthz`
   - triage latest outputs:

```bash
curl -fsS -X POST http://127.0.0.1:18767/triage-latest \
  -H "x-career-ops-token: $CAREER_OPS_N8N_BRIDGE_TOKEN" \
  -H "content-type: application/json" \
  -d '{"requested_by":"manual","instruction":"Review latest n8n outputs and queue a safe Codex or Gemini follow-up if useful."}'
```

Default model:

```bash
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3-coder:30b
```

Default Codex behavior is queue-only:

```bash
N8N_OLLAMA_CODEX_AUTORUN=false
N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE=false
```

Default Gemini behavior is queue-only/report-only:

```bash
GEMINI_API_KEY=<stored in env provider, never Markdown>
N8N_GEMINI_MODEL=gemini-2.5-flash-lite
N8N_OLLAMA_GEMINI_AUTORUN=false
N8N_OLLAMA_GEMINI_REQUIRE_REASON=true
```

In queue-only mode, the bridge writes guarded tasks under:

`.brain/automation-runs/n8n-ollama-codex/YYYY-MM-DD/`

To let n8n call Codex automatically for low-risk report-only work:

```bash
N8N_OLLAMA_CODEX_AUTORUN=true
N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE=false
```

To let n8n call Gemini automatically for low-risk report-only validation:

```bash
N8N_OLLAMA_GEMINI_AUTORUN=true
N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE=false
```

Workspace-write Codex autorun remains separately gated and should stay off unless Paulo explicitly approves the specific automation:

```bash
N8N_OLLAMA_CODEX_AUTORUN=true
N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE=true
```

Schedule:

- every 10 minutes
- reads Apple Mail alerts for Workana and 99Freelas
- calls only the local locked-down bridge endpoint `/run`; no arbitrary shell command is exposed through n8n
- writes JSON run output under `reports/freelance/`
- creates proposal drafts only through `scripts/freelance-mail-radar.mjs`
- archives processed Workana/99Freelas project notification emails from Google `INBOX` after a successful scan
- emails Paulo only when there is an actionable lead (`hot_draft_for_paulo` first) or a failure, unless `N8N_FREELANCE_EMAIL_MODE=always`

## Daily US AI Job Applications

Schedule:

- every 24 hours
- scans `portals.yml`
- reads recent Google Mail job alerts through local Mail.app when available
- evaluates target roles with `openrouter-runner.mjs`
- generates CV PDF, cover letter PDF, application answers and a manifest under `output/job-applications/`
- writes a daily approval queue under `reports/job-applications/approval-queue/` whenever Paulo needs to review or submit prepared applications
- defaults to `ready_for_submit`: prepare/fill safe fields up to final submit, then ask Paulo
- submits automatically only when `SUBMIT_MODE=auto_submit_low_risk` and every low-risk gate passes
- sends a completion email to `pierrondi@gmail.com` every run
- writes an approval queue under `reports/job-applications/approval-queue/` when a role needs Paulo review; `ready_for_submit` items include required fields plus suggested answers for Paulo approval

Default automation flags in `scripts/n8n-job-application-run.sh`:

- `N8N_JOB_APPLICATION_SUBMIT_MODE=ready_for_submit`
- `N8N_JOB_APPLICATION_DAILY_LIMIT=3`
- `N8N_JOB_APPLICATION_MIN_SCORE=4.0`
- `N8N_JOB_APPLICATION_AUTO_SUBMIT_SCORE=4.2`
- `N8N_JOB_APPLICATION_LEGAL_ACK_VAI=false`

The autopilot stops at `ready_for_submit`, `draft_ready` or `blocked` when it
sees CAPTCHA, Cloudflare, login, 2FA, email-code verification, payment,
unsupported ATS, unfilled required fields, legal acknowledgements,
background-check/signature/attestation text, demographic/EEO sections or any
unknown visa/work authorization/salary condition.
- stops at `draft_ready`; Paulo reviews and submits manually inside Workana/99Freelas if he decides to proceed

## Ollama/Codex/Gemini Supervisor

Workflow:

- `Career Ops - Ollama Codex Gemini Supervisor`
- imported from `ops/n8n/workflows/career-ops-ollama-codex-supervisor.json`
- active by default unless `N8N_OLLAMA_CODEX_WORKFLOW_ACTIVE=false`
- runs hourly plus manual trigger
- calls only the local locked-down endpoint `/triage-latest`
- uses Ollama to produce a structured risk/action decision
- writes an executor task file even when Codex/Gemini autorun is disabled
- can call Codex only when:
  - `N8N_OLLAMA_CODEX_AUTORUN=true`
  - Ollama returns low risk
  - Ollama does not require Paulo approval
  - the action is `run_codex_report_only`, or `run_codex_workspace_write` with `N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE=true`
- can call Gemini only when:
  - `N8N_OLLAMA_GEMINI_AUTORUN=true`
  - `GEMINI_API_KEY` or `GOOGLE_API_KEY` is available in the process env
  - Ollama returns low risk
  - Ollama does not require Paulo approval
  - the action is `run_gemini_report_only`
  - Ollama marks local resolution as `ambiguous` or `needs_external_validation`
  - `gemini_reason` is non-empty when `N8N_OLLAMA_GEMINI_REQUIRE_REASON=true`

## Guardrails

- Automatic Workana/99Freelas proposal submission is prohibited.
- `N8N_FREELANCE_AUTOMATED_VAI` must remain `false`; if it is ever `true`, treat it as a misconfiguration, not as approval.
- No connection, credit, boost, paid plan or paid moderation spend.
- No profile/payment/tax/identity changes.
- No off-platform contact.
- No login, password, CAPTCHA, Cloudflare or 2FA bypass.
- Paulo must manually review and manually submit any proposal inside the platform.
- Paulo must explicitly approve any credit spend, boost, paid moderation, login/CAPTCHA/2FA bypass, profile/payment/tax/identity change, or off-platform contact.
- Processed Mail.app notification emails are archived from the inbox only after the detector has generated its JSON/report/draft state.

## Logs

- n8n stdout: `/Users/paulopierrondi/Library/Logs/career-ops-n8n/stdout.log`
- n8n stderr: `/Users/paulopierrondi/Library/Logs/career-ops-n8n/stderr.log`
- radar run JSON: `reports/freelance/*-n8n-freelance-mail-radar.json`
- job application JSON: `reports/job-applications/*-n8n-daily-us-ai-job-applications.json`

## Manual Restart

```bash
launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.paulo.careerops.n8n.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.paulo.careerops.n8n.plist
launchctl kickstart -k gui/$(id -u)/com.paulo.careerops.n8n

launchctl bootout gui/$(id -u) ~/Library/LaunchAgents/com.paulo.careerops.n8n-radar-bridge.plist
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.paulo.careerops.n8n-radar-bridge.plist
launchctl kickstart -k gui/$(id -u)/com.paulo.careerops.n8n-radar-bridge
```
