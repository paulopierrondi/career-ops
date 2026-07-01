# Career Ops - Autonomous Application Improvement Summary

Date: 2026-07-01
Automation: `n8n-daily-us-ai-job-applications`
Coordinator: Codex

## What Changed

- n8n job application runner now reads non-secret defaults from `config/job-application-autopilot.yml`.
- Default mode for Paulo's authorized Career Ops run is `auto_submit_low_risk`; env vars still override it.
- Application packages now adapt CV keywords, cover-letter proof points, and form answers by role lane: Enterprise AI GTM, Agentic AI Solutions, Forward Deployed AI, and AI Transformation.
- Targeting now blocks pure ML/research roles such as `Machine Learning Researcher, Multimodal LLMs` unless the role also has customer, GTM, solutions, enterprise, implementation, or forward-deployed signal.
- Pipeline cleanup now archives bounded non-target items and prior prepared/blocked attempts so recurring n8n runs do not loop on the same URL.
- Ashby `possible spam` submit errors are classified as an ATS anti-automation blocker instead of `ready_for_submit`.

## Real Runs

- Config-autonomy smoke:
  - report: `reports/job-applications/2026-07-01T02-52-48-daily-us-ai-job-applications.md`
  - mode: `auto_submit_low_risk` from config, not env override
  - result: no confirmed submit; one Ashby spam gate surfaced on a pure research role, which triggered the targeting fix.
- Targeting/repeat-guard smoke:
  - report: `reports/job-applications/2026-07-01T02-56-17-daily-us-ai-job-applications.md`
  - result: Vapi Enterprise Account Executive reached submit click, but Ashby returned a possible-spam rejection; evidence persisted and the item was kept out of repeat submission.
- Repeat guard smoke:
  - report: `reports/job-applications/2026-07-01T02-59-54-daily-us-ai-job-applications.md`
  - result: archived 8 stale/non-target/prior-attempt items without reopening already attempted Vapi forms.
- Dry-run status check:
  - automation id: `codex-dry-run-status-check`
  - result: skip-only cleanup returns `no_hit`, not `failed`.

## Validation

- `node --check scripts/job-application-autopilot.mjs`
- `bash -n scripts/n8n-job-application-run.sh`
- `brain-env-run -- npm run jobs:autopilot -- --self-test`
- `git diff --check -- scripts/job-application-autopilot.mjs scripts/n8n-job-application-run.sh ops/n8n/README.md ops/n8n/job-application-execution-prompt.md ops/n8n/workflows/career-ops-daily-us-ai-job-applications.json config/job-application-autopilot.yml`
- `brain-env-run -- npm run dashboard:ops`
- `brain-env-run -- npm run freelance:dashboard`

## Persisted Artifacts

- Operations dashboard: `reports/dashboards/career-ops-operations-dashboard.html`
- Operations dashboard JSON: `reports/dashboards/career-ops-operations-dashboard.json`
- Freelance dashboard: `reports/freelance/dashboard/index.html`
- Freelance dashboard JSON: `reports/freelance/dashboard/freelance-activity-dashboard.json`
- n8n config defaults: `config/job-application-autopilot.yml`

## Operational Closeout

- Live n8n import was run through `brain-env-run -- npm run n8n:import`.
- Imported/published workflows:
  - `careerops-freelance-mail-radar`
  - `careerops-daily-us-ai-job-applications`
  - `careerops-ollama-codex-supervisor`
- n8n LaunchAgent was restarted with `launchctl kickstart -k gui/$(id -u)/com.paulo.careerops.n8n`.
- Post-restart n8n health:
  - `healthz`: ok
  - `bridge_healthz`: ok
  - `job_bridge_healthz`: ok
  - `ollama_codex_bridge_healthz`: ok
  - `ollama_healthz`: not reachable

## Residual Risk

- Ashby can reject automated submissions as possible spam even with correct form data. The runner now records that as an external ATS gate and avoids repeated retries.
- Existing local n8n env file has invalid lines; wrapper ignores them. This did not block execution.
- Ollama server on `127.0.0.1:11434` is currently not reachable. The n8n Ollama/Codex bridge self-test passes, but local LLM execution needs the Ollama backend to stay up.
- Worktree had large pre-existing and generated changes. The safe cleanup action is to commit the validated n8n application-autonomy block only, not unrelated local work.
