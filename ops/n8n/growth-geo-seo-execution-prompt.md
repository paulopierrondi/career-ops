# Career Ops — Growth GEO/SEO Radar (execution prompt)

Weekly, report-only radar that scores how retrievable/cite-able Paulo's brand and portfolio are by
generative answer engines (ChatGPT Search, Perplexity, Google AI Overviews/Gemini, Claude) **and**
classic search. **SEO is never scored without GEO.** Reference standard = AgentCore (agenticoscore.ai).

## What the workflow does

1. Schedule trigger (weekly) or manual run.
2. Execute Command → `scripts/n8n-growth-geo-seo-run.sh`, which:
   - runs `node geo-seo-audit.mjs --all` over `config/growth-targets.yml`,
   - curls only the **served production artifacts** (no browser, no LLM tokens, no site mutation),
   - writes per-target reports to `reports/growth/geo-seo-audit-{host}-{date}.md` + `.json`,
   - writes brain snapshots `.brain/geo-seo/{host}.json` + `.brain/geo-seo-audit-latest.json`,
   - writes a portfolio scorecard `reports/growth/{ts}-n8n-growth-geo-seo.md`,
   - emails Paulo (`pierrondi@gmail.com`) via `brain-send-automation-email` (Automation Email Policy).
3. Parse node summarizes the tier scorecard for downstream visibility.

## Operating policy

- **Report-only.** The radar reads public artifacts; it never deploys, mutates a site, or touches
  Search Console / GA / DNS. Generating a GEO kit is fine; **deploying it is human-gated** (Paulo).
- Ollama-first for any triage of the results; Codex/Gemini follow-up stays queue-only unless the
  specific env gate is enabled (same posture as the other career-ops bridges).
- No secrets in Markdown, workflow JSON, logs or email. Provider keys stay in the env provider path.
- Default `N8N_GROWTH_EMAIL_MODE=always` (send a summary every run); set `actionable` to email only
  when a target regressed, or `none` for silent runs.

## Env knobs (in `/Users/paulopierrondi/.config/career-ops-n8n/env`)

```bash
N8N_GROWTH_EMAIL_MODE=always          # always | actionable | none
N8N_GROWTH_LOCK_DIR=/tmp/career-ops-n8n-growth-geo-seo.lock
```

## Manual run

```bash
npm run n8n:growth                    # = scripts/n8n-growth-geo-seo-run.sh
node geo-seo-audit.mjs --all          # same audit, no email wrapper
node geo-seo-audit.mjs https://pierrondi.dev   # single target (brand-first)
```

## Guardrails

- Automatic deploy of any GEO artifact is prohibited without Paulo's explicit command.
- No Search Console mutation, GA/GTM config change, paid ads or DNS change.
- Brand/entity content is generated from in-scope sources only (`cv.md`, `config/profile.yml`,
  `modes/_profile.md`) — never fabricated.
- Blocking an AI search/user bot is scored as a failure (a false block hides the site from answer engines).
