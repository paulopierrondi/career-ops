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
