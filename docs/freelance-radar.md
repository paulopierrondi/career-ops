# Freelance Radar Runbook

## Purpose

Use `freelance-radar.mjs` to find and prioritize AI/automation freelance opportunities for Paulo, then generate proposal drafts for manual review.

This is a local workflow. It does not send messages, publish content, spend money, scrape logged-in pages, or mutate external services.

## Commands

```bash
npm run freelance:radar
npm run freelance:radar:json
npm run freelance:radar:self-test
node freelance-radar.mjs --dry-run --json
node freelance-radar.mjs --limit 8
```

## Workana + 99Freelas Mail Radar

Use `scripts/freelance-mail-radar.mjs` to turn official marketplace email alerts into ranked leads and proposal drafts. This path is designed to be fast without scraping logged-in pages or auto-submitting proposals.

The Mail.app/n8n path is the operational inbox source while the Codex Gmail connector lacks mailbox read/search scope. As of 2026-06-30, Gmail connector profile access works, but label/search calls return `ACCESS_TOKEN_SCOPE_INSUFFICIENT`; treat that as `known_reauth_required` until Paulo reauthorizes the connector in Codex.

```bash
npm run mail:freelance -- --self-test
npm run mail:freelance -- --dry-run --json
npm run mail:freelance -- --source all --since-hours 12
npm run mail:workana -- --since-hours 12
npm run mail:freelance -- --source 99freelas --since-hours 12
```

Optional AI-generated drafts use any OpenAI-compatible endpoint configured through the environment. Run through the central env loader instead of pasting keys:

```bash
brain-env-run -- npm run mail:freelance -- --source all --since-hours 12 --ai-drafts
```

### Recurring Automation

The local Codex automation `99freelas-mail-fast-radar` is preserved as a fallback, but the active controller is now n8n.

### n8n Autopilot

Local n8n is installed for this operation and runs the Workana + 99Freelas radar every 10 minutes.

- n8n URL: `http://127.0.0.1:5678`
- n8n user folder: `/Users/paulopierrondi/.n8n-career-ops`
- n8n env file: `/Users/paulopierrondi/.config/career-ops-n8n/env` (chmod 600; do not print or commit)
- n8n LaunchAgent: `com.paulo.careerops.n8n`
- Local bridge LaunchAgent: `com.paulo.careerops.n8n-radar-bridge`
- Local bridge URL: `http://127.0.0.1:18765`
- Workflow file: `ops/n8n/workflows/career-ops-freelance-mail-radar.json`
- Mode: draft-only. The workflow detects leads, generates drafts, archives processed notification emails, and alerts Paulo. It prioritizes `hot_draft_for_paulo` leads but does not submit proposals.

Commands:

```bash
npm run n8n:status
npm run n8n:import
npm run n8n:radar
```

The n8n workflow does not expose arbitrary shell execution. It calls a localhost-only bridge protected by a local token, and the bridge can run only `scripts/n8n-freelance-radar-run.sh`.

`N8N_FREELANCE_AUTOMATED_VAI` must remain `false`. A `true` value is a misconfiguration and does not authorize n8n to submit proposals.

The previous Codex automation `99freelas-mail-fast-radar` was paused after n8n became active to avoid duplicate Mail.app scans.

### Codex Fallback

The local Codex automation `99freelas-mail-fast-radar` can be reactivated as `Workana + 99Freelas Mail Fast Radar` if n8n is unavailable.

- Schedule: every 10 minutes from 08:00 to 23:50 local time.
- Command: `brain-env-run -- npm run mail:freelance -- --source all --since-hours 8 --json --ai-drafts`
- Source: Apple Mail alerts from Workana and 99Freelas.
- Output: redacted report and draft paths only.
- Alert rule: email Paulo only when there is a new actionable lead or a failure/blocker.
- Human gate: no platform proposal submission, no credit/connection spend, no boost, no paid moderation, no login/CAPTCHA bypass, and no off-platform contact.

The command writes:

- `reports/freelance/YYYY-MM-DD-freelance-mail-radar-HH-MM-SS.md`
- `output/freelance-proposals/YYYY-MM-DD-workana-mail-*.md`
- `output/freelance-proposals/YYYY-MM-DD-99freelas-mail-*.md`

It also keeps a local processed-message state in `data/freelance-mail-radar-state.json` so the same alert is not drafted repeatedly. Use `--include-processed` when you intentionally want to reprocess old messages.

### Setup

1. In Workana, enable project email alerts for the categories/skills Paulo wants to sell: AI, automacao, APIs, dashboards, n8n, Python, Node.js, WhatsApp, CRM.
2. In 99Freelas, enable freelancer notifications for interesting/new projects and keep the same keyword focus. On 2026-06-30 this was verified in Chrome as enabled with immediate delivery (`Na hora em que for publicado`).
3. Make sure the alert emails land in Apple Mail on this Mac.
4. Run `npm run mail:freelance -- --source all --since-hours 12`.
5. Review the report and proposal drafts.
6. Submit manually inside Workana or 99Freelas only after review.

Workana account notification settings may request password confirmation before they can be changed. Do not paste passwords into chat or logs; unlock that page manually in Chrome if a setting change is needed.

### File Input Fallback

If Mail.app is not receiving the messages, export or paste alerts into a local JSON file and run:

```bash
npm run mail:freelance -- --source workana --input-file /path/to/messages.json --dry-run --json
```

Expected JSON:

```json
[
  {
    "source_id": "workana",
    "subject": "Novo projeto: Dashboard com IA",
    "sender": "notifications@workana.com",
    "dateReceived": "2026-06-30",
    "content": "Descricao publica do projeto",
    "url": "https://www.workana.com/job/example"
  }
]
```

Use `source_id: "99freelas"` for 99Freelas messages.

## Weekly Workflow

1. Open the source URLs in `config/freelance-radar.yml`.
2. Add promising leads to `data/freelance-leads.json`.
3. Run `node freelance-radar.mjs --limit 8`.
4. Review `reports/freelance/YYYY-MM-DD-freelance-radar.md`.
5. Review drafts in `output/freelance-proposals/`.
6. Manually decide what to submit.

## Offer Strategy

Default wedge: `AI Revenue Ops Pack`.

Use it when the buyer needs lead capture, CRM/follow-up, content, dashboards, or revenue operations. Use `Automation Hygiene Audit` when the request is broad or operationally messy. Use `Content Repurposing Engine` for creator/content buyers. Use `Agent Ops Implementation Kit` for technical teams already using agents or RAG.

## Safety Rules

- Do not send real outreach automatically.
- Do not scrape logged-in Workana/99Freelas pages in a loop.
- Do not auto-submit proposals or spend Workana/99Freelas credits.
- Do not target ServiceNow customers, partners, Bradesco, or adjacent account ecosystem.
- Do not use employer confidential material, screenshots, customer names, or work-time assets.
- Do not automate LinkedIn side-business outreach.
- Use dry-run first.
- Any real outreach must be one-to-one, reviewed, consent-aware, and include opt-out where applicable.

## Adding Leads

Add only public, non-secret metadata:

```json
{
  "id": "platform-short-slug-date",
  "source_id": "upwork_ai_automation",
  "platform": "Upwork",
  "title": "AI Automation Project",
  "buyer": "Small business",
  "url": "https://example.com/project",
  "posted": "2026-06-17",
  "budget": "Fixed-price or hourly clue",
  "description": "Short public summary",
  "tags": ["ai automation", "n8n", "crm"],
  "risk_notes": "No PII, no private messages, no secrets."
}
```

Never store client emails, phone numbers, private marketplace messages, cookies, tokens, or non-public personal data in this file.
