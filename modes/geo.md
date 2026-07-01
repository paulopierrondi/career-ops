# Mode: geo — GEO + SEO Readiness (Answer-Engine Optimization)

Audits and builds a target so it is **retrievable, cite-able and verifiable** by generative answer
engines (ChatGPT Search, Perplexity, Google AI Overviews/Gemini, Claude) **and** classic search.

> **THE RULE OF THIS ENGINE: SEO is never done without GEO.** Whenever the user asks for SEO — a
> landing page, meta tags, a sitemap, "rank this" — you also deliver the GEO layer in the same pass.
> GEO is the 63-point majority of the score; SEO is the 37-point remainder. A page that ranks but is
> never cited by an answer engine is losing the 2026 game. If you catch yourself producing SEO-only
> output, stop and add GEO.

## Why (the shift)

The unit of competition in 2026 is the **passage (chunk)**, not the page. LLMs score self-contained
passages and cite the most authoritative one. Optimizing only for Google leaves ~⅓ of AI traffic on
the table; only ~11% of domains appear in both ChatGPT and Perplexity. The metric that matters is
**Citation Rate**, not ranking.

## Inputs

- A target URL (default: the user's brand — `config/profile.yml` → `portfolio_url`).
- `config/growth-targets.yml` — the target list for `--all` runs (brand-first + portfolio).
- **For brand/entity content**, the source-of-truth boundary is absolute: generate only from
  `cv.md`, `article-digest.md`, `config/profile.yml`, `modes/_profile.md`, `writing-samples/`,
  `voice-dna.md`. **Never fabricate** a title, employer, metric, cert or authorship. Reorder and
  reframe; never invent. If a claim has no in-scope source, omit it.
- Paulo's canonical GEO playbook: `~/agents-hub/tmp/geo-playbook/` (00-consolidado + 01…05).
  Reference standard = **AgentCore (agenticoscore.ai)**, the 100-pt anchor.

## Step 1 — Audit (served-artifact, zero-LLM)

```bash
node geo-seo-audit.mjs https://target.com     # one target → reports/growth/ + .brain/geo-seo/
node geo-seo-audit.mjs --all                  # every target in config/growth-targets.yml
node geo-seo-audit.mjs --json                 # machine output for n8n/dashboards
```

It curls the **served production artifacts** (never the repo), scores 22 weighted signals
(GEO 63 / SEO 37), and writes a Markdown report, a JSON record, and a stable brain snapshot
(`.brain/geo-seo-audit-latest.json`). Tiers: **BEST ≥90 · MATURE 75–89 · GOOD 55–74 · PARTIAL 35–54 · MISSING <35**
(with hard gates: e.g. blocking an AI search bot, or no llms.txt + no JSON-LD, caps the tier).

Read the report's **Gaps** and **Signal detail** — each gap links to a playbook section.

## Step 2 — Build the GEO artifact kit (what to ship)

The AgentCore-reference fingerprint, every one required before "GEO done":

| Artifact | Serve at | Rule |
|---|---|---|
| `llms.txt` | `/llms.txt` (`text/plain`) | H1 = name/product; 1–3 sentence blockquote (who/what/for-whom); H1/H2 only; annotated links `- [Title](URL): desc`; ≤~3000 tokens; never link robots-blocked paths |
| `llms-full.txt` | `/llms-full.txt` | Longer concatenated body; must be larger than `llms.txt` |
| `geo.md` | `/geo.md` | Canonical, citation-ready fact sheet (entity block + answer-first + FAQ + `Last updated`) |
| `answers.json` | `/answers.json` (`application/json`) | Machine-readable Q&A; every answer 40–75 words, self-contained, dated |
| `robots.txt` | `/robots.txt` | **Explicit per-AI-bot stanzas** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, CCBot…), never blanket-`Disallow: /` a search bot, plus a `Sitemap:` directive |
| JSON-LD graph | inline `<script type="application/ld+json">` | Organization + WebSite (base) + the relevant rich types: SoftwareApplication, FAQPage, Service, OfferCatalog, **Person**, VideoObject, ContactPoint, BreadcrumbList, HowTo, Article. Align every property with visible content |
| `sitemap.xml` | `/sitemap.xml` | Real `<loc>` + `<lastmod>`; refresh so newest lastmod < 90 days |

Build on **static HTML** where possible — GPTBot, ClaudeBot and PerplexityBot do **not** execute
JavaScript (only Google's WRS does). A CSR/SPA page is invisible to 3 of the 4 engines.

## Step 3 — Content (answer-first is the whole game)

- **Answer-first / BLUF**: the first paragraph answers in **40–75 words** (ideally 40–60), before any
  preamble. Every H2 answers in 1–3 sentences. The engine scores the top first — a buried answer is an
  uncited answer.
- **Highest-citation formats in 2026**: (1) **Comparison pages/tables** ("X vs Y", "melhor alternativa a Z")
  with real semantic `<table>`; (2) **FAQ pages with FAQPage schema** (every visible FAQ ships a matching
  `acceptedAnswer`). Then glossary/definition pages and quotable-statistic blocks.
- **Passage self-containment ("answer islands")**: every paragraph makes sense alone (standalone-extraction
  test). Entity clarity: name the entity (who/what/for-whom) in the first paragraph; repeat the full name.
- **Cite named sources**: every statistic needs institution + year + link (≥1 stat per 300 words on
  informational pages). Factual voice: "X is Y", not "X may be considered Y".
- **Freshness**: 50% of cited content is <13 weeks old; Perplexity weights <30-day content 3.2×. Refresh quarterly.

## Step 4 — Measure citations, not rankings

Build a **prompt library** (see `citation-prompts.md` in a brand kit) and run each prompt 3× in fresh
sessions across the four engines. Track:

- **Citation Rate (AICF)** = prompts citing your URL / total prompts. Targets: 15–20% @90d, 25–35% @6m, 35–50% @12m.
- **AI Share of Voice** vs competitors · **Average Citation Position** (body=10 … sources-only=3 … absent=0)
  · **Sentiment** (>85% positive/neutral) · **AI Referral Sessions** (GA4 `AI Assistant` channel).

**Per-engine leverage:** Perplexity = best entry for a new/low-authority domain (freshness, FAQPage);
ChatGPT = passage↔query semantic alignment in the first 30% + Bing index (register Bing Webmaster Tools);
Google AIO = semantic-complete "answer islands" (134–167 words) + entity density + rich schema; Claude =
third-party authority (median DA 92 of cited sources — it won't cite self-description alone).

## Brand-first flow (the default)

1. `node geo-seo-audit.mjs https://pierrondi.dev` → see the gap.
2. Generate the deploy-ready kit into `reports/growth/brand-kit/{host}/` from in-scope sources only
   (`llms.txt`, `geo.md`, `answers.json`, `person.jsonld`, `robots.txt`, `citation-prompts.md`).
3. **STOP before deploy** — deploying to the live site is human-gated. Hand Paulo the kit + the re-audit
   command. Verify every templated route against the real site before shipping (no links to 404s).

## n8n + brain integration

- The audit writes `.brain/geo-seo/{host}.json` and `.brain/geo-seo-audit-latest.json` (stable paths).
- The n8n **Growth GEO/SEO Radar** (`ops/n8n/`) runs `--all` on a schedule, queues gaps, and emails Paulo
  (Automation Email Policy). Ollama-first triage; Codex/Gemini stay queue-only unless explicitly enabled.
- After a run, register the scorecard in the Obsidian project note / Marketing OS, mirroring
  `GEO Portfolio Audit 2026-06-29`.

## Guardrails

- **Report-only by default.** The audit reads public artifacts; it never mutates a site.
- **Deploy, Search Console mutations, GA/GTM config, paid ads and DNS are human-gated** (Paulo's explicit command).
- **No fabrication** in brand/entity content — in-scope sources only.
- Blocking an AI search/user bot is scored as a **failure** (a false block hides the site from answer engines).
