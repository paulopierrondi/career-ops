# Railway Opportunity Tracker Design

## Goal

Build a Railway-hosted operational web app for Paulo to monitor ServiceNow and AI opportunities daily, rank the best matches, feed the career-ops pipeline, and preserve human approval before any application is submitted.

## Architecture

The app will be a small Node.js web service with no framework dependency. It will read and write a state directory, defaulting to the project root locally and `/data/career-ops` on Railway via `CAREER_OPS_STATE_DIR`. Existing career-ops scripts remain the engine: the web service seeds missing files, triggers `scan.mjs`, parses tracker/pipeline/report files, and writes daily monitor reports.

The Railway service will run one web process. A Railway volume mounted at `/data` will persist `data/`, `reports/`, `output/`, `jds/`, `config/profile.yml`, `modes/_profile.md`, `portals.yml`, and `cv.md` when present. The app supports a daily in-process scheduler plus manual authenticated scan/run endpoints.

## Components

- `app/server.mjs`: HTTP server, routes, static asset serving, scheduler bootstrap.
- `app/auth.mjs`: Basic/Bearer auth using Railway env vars, no secrets in client code.
- `app/career-data.mjs`: parsers for `data/applications.md`, `data/pipeline.md`, `data/scan-history.tsv`, reports, summaries, and opportunity ranking.
- `app/runner.mjs`: state seeding, `scan.mjs` execution, daily report writing, optional Resend email.
- `app/parsers/servicenow-jobs.mjs`: zero-token ServiceNow careers parser with testable HTML parsing and Cloudflare-safe failure behavior.
- `app/public/*`: operational dashboard UI.
- `app/default-portals.yml`: fallback ServiceNow + AI config used only when no runtime `portals.yml` exists.
- `railway.json` and `.railwayignore`: Railway startup and build context guardrails.

## Data Flow

1. On startup, the app ensures the state directory and required files exist.
2. Manual or scheduled scan runs `node scan.mjs --verify` with cwd set to the state directory.
3. `scan.mjs` writes new opportunities to `data/pipeline.md` and `data/scan-history.tsv`.
4. Dashboard APIs parse applications, pending opportunities, scan history, reports, metrics, and recommended actions.
5. Daily monitor writes `reports/daily-monitor-YYYY-MM-DD.md` and sends a redacted email if email env vars are configured.

## Human Gate

The app can discover opportunities, rank them, prepare context, and track status. It must not submit applications. The UI and daily email will label applications requiring Paulo's review, especially statuses such as `Filled - pending submit confirmation`, `Evaluated`, and pipeline items.

## Deployment

Use the existing Railway project `bb-opportunity-tracker` (`02b5ab73-2b7e-4592-bc50-9d98b440eb56`) and service `bb-opportunity-tracker` (`2fd2c6df-230e-4b23-912d-bb8f810a0bca`). Do not deploy to the currently linked `Harmonizador` project. Deploy commands must pass explicit project, service, and environment selectors.

## Verification

- Unit tests for tracker parsing, opportunity ranking, auth behavior, ServiceNow parser extraction, and app endpoints.
- `node test-all.mjs --quick`.
- `node app/app.test.mjs`.
- Local smoke: start server and fetch `/health` plus an authenticated API route.
- Railway smoke: fetch public `/health`, then authenticated `/api/summary`.

## Prompt Cache

strategy: `cli-prefix-layout`
prefix_version: `2026-06-02-career-ops-railway-app`
cache_key_or_tag: `paulo:career-ops:railway-opportunity-tracker:2026-06-02`
cached_tokens: `null`
