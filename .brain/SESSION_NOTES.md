# Session Notes To Sync Back To Obsidian

Repository: `/Users/paulopierrondi/Projects/career-ops`

Do not store secrets here.

## 2026-06-30 — GEO+SEO engine added to career-ops (Claude Code)

**Ask (Paulo):** "melhorar esse motor, quando eu falar de SEO tenho que falar de GEO tambem. tem que ser o motor perfeito para trabalhar com o meu n8n e brain." Decisions locked: generic engine, **brand-first** default; enforcement **contained in career-ops** (no global `~/.claude/CLAUDE.md` change).

**What shipped (all additive, no deploy, no secrets):**
- `geo-seo-audit.mjs` — zero-LLM served-artifact GEO+SEO scorer. 22 weighted signals (GEO 63 / SEO 37 = 100), tiers BEST≥90 / MATURE 75–89 / GOOD 55–74 / PARTIAL 35–54 / MISSING <35. Reference = AgentCore. Writes `reports/growth/geo-seo-audit-{host}-*.md/.json` + `.brain/geo-seo/{host}.json` + `.brain/geo-seo-audit-latest.json`. Pure-fn `--self-test` passes; table-driven (all fns < CCN 15).
- `modes/geo.md` — SEO+GEO coupled mode (SEO never without GEO), 4-engine model, artifact kit, answer-first, citation measurement.
- `modes/_custom.md` — durable house rule "SEO ⟹ GEO" + `growth radar` / `geo <site>` / `brand geo` workflows (survives `update-system.mjs`).
- `config/growth-targets.yml` (+ `.example.yml`) — brand-first target list (pierrondi.dev, agenticoscore.ai ref, faithschool/cantustudio/investcoach/creativeforge).
- `reports/growth/brand-kit/pierrondi.dev/` — deploy-ready, source-bounded brand GEO kit (llms.txt, geo.md, answers.json, person.jsonld, robots.txt, citation-prompts.md, README). Validated against auditor parsers.
- n8n: `scripts/n8n-growth-geo-seo-run.sh` (report-only, emails Paulo), `ops/n8n/growth-geo-seo-execution-prompt.md`, `ops/n8n/workflows/career-ops-growth-geo-seo.json` (`active:false`). npm: `geo:audit`, `geo:audit:all`, `geo:self-test`, `n8n:growth`.
- Council: `local-growth-operator` mission → ASO/SEO+GEO + citation rate.

**Live evidence (2026-07-01 audit):** agenticoscore.ai MATURE 90 · cantustudio.app MATURE 90 · faithschool.app MATURE 85 · creativeforge.ai MISSING 40 · **pierrondi.dev 76 MATURE on www** (corrected — see Addendum) · investcoach.ai MISSING 12. Matches the human `GEO Portfolio Audit 2026-06-29` (3 mature / 2 missing) — cross-validates the scorer.

**COMPLEXITY WAIVER:** `complexity-guard --changed` is BLOCKED by 10 pre-existing HARD violations in files I did NOT touch (`scripts/job-application-autopilot.mjs` ×8, `generate-pdf.mjs`, `scripts/build-operations-dashboard.mjs`). My new `geo-seo-audit.mjs` is NOT flagged (clean). Waiver reason: out-of-scope legacy debt; refactor tracked separately, not part of the GEO engine task.

**Next actions:** (1) deploy the pierrondi.dev gap-closing kit (human-gated); (2) optionally activate the n8n weekly radar; (3) map a Linear issue for career-ops (currently "Needs Linear project mapping").

### Addendum — "Ajuste" pass (host fix + gap-closing kit)

**Auditor bug fixed:** `gatherTarget` now resolves the CANONICAL host (follows the homepage redirect) before fetching artifacts. Auditing `pierrondi.dev` was measuring the **apex**, which 404s the GEO files; the real layer lives on **www**. Corrected: **pierrondi.dev = 76/100 MATURE** (was falsely 38 PARTIAL — a 38-pt false negative). Self-test extended; `geo-seo-audit.mjs` still clean on the complexity gate.

**pierrondi.dev already has GEO** (real llms.txt, robots with 11 AI-bot stanzas, sitemap 150 URLs, answers.json discovery index, JSON-LD Person/Org/WebSite, /ai-search-portfolio hub). So the brand kit was rebuilt as **gap-closing, NOT replacement** — the old templated kit (fake routes /sobre,/servicos) was removed before it could regress the live site. New kit in `reports/growth/brand-kit/pierrondi.dev/`: `geo.md`, `llms-full.txt`, `faqpage.jsonld`, `person.jsonld`, `answer-first-hero.md`, `answers-json.upgrade.md`, `llms.txt.upgrade.md`, `citation-prompts.md`, `README.md`. Real routes: `/about /atuacao /feitos /ai-search-portfolio /blog /paulo /contato`, EN mirror `/en/*`, canonical `www.pierrondi.dev`.

**P0 infra fix:** apex 301-redirects the homepage but **404s `/llms.txt` `/robots.txt` `/sitemap.xml` `/answers.json`** — redirect ALL apex paths to www (or serve on both). Path to BEST: close 6 gaps (+24) → ~100.
