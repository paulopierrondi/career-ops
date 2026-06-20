# Freelance Radar Design

## Goal

Build a local, safe freelance opportunity radar for Paulo that turns AI/automation marketplace leads into ranked opportunities, productized offer matches, and proposal drafts without sending outreach or mutating external services.

## Scope

- Read static configuration from `config/freelance-radar.yml`.
- Read seed opportunities from `data/freelance-leads.json`.
- Score leads by offer fit, revenue potential, delivery speed, automation leverage, and risk.
- Generate a Markdown report under `reports/freelance/`.
- Generate proposal drafts under `output/freelance-proposals/`.
- Keep all outbound actions as draft-only and dry-run safe.

## Non-Goals

- No automated sending on email, LinkedIn, WhatsApp, or marketplace chat.
- No scraping behind login walls.
- No paid ads, publishing, deploy, push, or Linear mutation.
- No ServiceNow/Bradesco/customer-confidential material.

## Architecture

`freelance-radar.mjs` is a standalone Node CLI. It follows the repo's existing script style: local files, deterministic JSON/Markdown output, no external credentials, and no long-running service.

Config holds source URLs, scoring weights, productized offers, and safety gates. Data holds manually seeded or future-imported opportunities. Templates hold reusable proposal copy. The script combines them into ranked output and draft proposals.

## Safety Gates

- Draft-only by default.
- External outreach requires manual copy/paste by Paulo after review.
- Outbound must follow LGPD guardrails: consent, dry-run, rate limits, opt-out, and no mass BCC.
- LinkedIn side-business content remains excluded unless Paulo explicitly overrides the current policy.

## Acceptance Criteria

- `node freelance-radar.mjs --self-test` passes.
- `node freelance-radar.mjs --dry-run --json` prints ranked opportunities without writing.
- `node freelance-radar.mjs --limit 8` writes one report and proposal drafts.
- `npm run verify` remains green.
