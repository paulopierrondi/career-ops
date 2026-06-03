# Railway Opportunity Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a Railway-hosted career-ops web app that monitors ServiceNow and AI opportunities daily and keeps applications human-gated.

**Architecture:** Add a small Node.js HTTP app around the existing career-ops file and script pipeline. Runtime state lives in `CAREER_OPS_STATE_DIR`; Railway uses `/data/career-ops` with a mounted volume. Existing `scan.mjs` remains the scanner, with a ServiceNow local parser and safer pipeline initialization.

**Tech Stack:** Node.js ESM, built-in `http`, `fs`, `child_process`, `crypto`, existing Playwright scanner path, Railway CLI.

---

### Task 1: State, Data Parsing, and Ranking

**Files:**
- Create: `app/config.mjs`
- Create: `app/career-data.mjs`
- Test: `app/app.test.mjs`

- [ ] Write tests for parsing `applications.md`, pending pipeline items, metrics, and ranking.
- [ ] Implement config path helpers.
- [ ] Implement data parsers and ranking.
- [ ] Run `node app/app.test.mjs` and confirm the parsing tests pass.

### Task 2: Auth and HTTP App

**Files:**
- Create: `app/auth.mjs`
- Create: `app/server.mjs`
- Create: `app/public/index.html`
- Create: `app/public/styles.css`
- Create: `app/public/app.js`
- Modify: `package.json`
- Test: `app/app.test.mjs`

- [ ] Write tests for unauthorized and authorized API access.
- [ ] Implement Basic/Bearer auth.
- [ ] Implement `/health`, `/api/summary`, `/api/applications`, `/api/opportunities`, `/api/scan`, `/api/daily`, and report routes.
- [ ] Implement the dashboard UI.
- [ ] Add `start`, `app:test`, and `test` scripts.
- [ ] Run `node app/app.test.mjs` and confirm endpoint tests pass.

### Task 3: Scanner Robustness and ServiceNow Parser

**Files:**
- Modify: `scan.mjs`
- Create: `app/parsers/servicenow-jobs.mjs`
- Create: `app/default-portals.yml`
- Modify: `portals.yml`
- Test: `app/app.test.mjs`

- [ ] Write tests for missing `data/pipeline.md` initialization and ServiceNow HTML parsing.
- [ ] Export and use `ensurePipelineFile` in `scan.mjs`.
- [ ] Implement the ServiceNow parser with Cloudflare/no-results safety.
- [ ] Add ServiceNow and ServiceNow/AI keywords to the runtime `portals.yml`.
- [ ] Run `npm run scan -- --dry-run --company ServiceNow` locally and record behavior.

### Task 4: Daily Monitor and Email

**Files:**
- Create: `app/runner.mjs`
- Modify: `app/server.mjs`
- Test: `app/app.test.mjs`

- [ ] Write tests for daily report generation with a fake scan runner.
- [ ] Implement state seeding from runtime files or defaults.
- [ ] Implement scan execution using cwd state dir.
- [ ] Implement daily monitor report writing.
- [ ] Implement optional Resend email with redacted logs and `EMAIL_FAILED` draft fallback.

### Task 5: Railway Packaging

**Files:**
- Create: `railway.json`
- Create: `.railwayignore`
- Modify: `package.json`

- [ ] Add Railway start command and health check configuration.
- [ ] Exclude secrets, local caches, generated output, and node_modules from deploy context.
- [ ] Run `node test-all.mjs --quick`.
- [ ] Run local smoke: `CAREER_OPS_ADMIN_TOKEN=local-test-token CAREER_OPS_DAILY_MONITOR=disabled npm start`.

### Task 6: Railway Deploy and Smoke

**Commands:**
- Use project `02b5ab73-2b7e-4592-bc50-9d98b440eb56`.
- Use service `2fd2c6df-230e-4b23-912d-bb8f810a0bca`.
- Use environment `production`.

- [ ] Link/unlink locally only if needed; deploy with explicit `--project`, `--service`, and `--environment`.
- [ ] Add volume at `/data` if absent.
- [ ] Set safe Railway variables via stdin or literal non-secret values.
- [ ] Deploy with `railway up --project ... --service ... --environment production --detach --json`.
- [ ] Generate Railway domain if absent.
- [ ] Smoke `/health`.
- [ ] Smoke authenticated `/api/summary`.

### Task 7: Finish Gate

**Files:**
- Modify: `/Users/paulopierrondi/Documents/Obsidian Vault/02_Projects/career-ops.md`
- Update: Agent Hub session journal/handoff as needed.

- [ ] Update the Obsidian project note with commands, files, Railway URL, tests, risks, and next actions.
- [ ] Send final automation/work summary email or record `EMAIL_FAILED`.
- [ ] Report local agent recommendations, prompt cache strategy, evidence, and residual risk.
