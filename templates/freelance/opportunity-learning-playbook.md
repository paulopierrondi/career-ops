# Freelance Opportunity Learning Playbook

Use this playbook whenever scanning, applying to, improving or monitoring freelance opportunities.

## Goal

Convert every serious freelance scope into:

1. a better proposal;
2. a faster delivery plan;
3. a reusable agent skill, checklist, starter template or demo;
4. a readiness gap Paulo can close before the client accepts.

## Extraction Steps

1. Capture the project title, platform, URL, client-visible constraints, budget signal, competition signal and freshness signal.
2. Extract the business problem in one sentence.
3. Break the scope into deliverables, integrations, data sources, auth model, user journey, admin/backoffice needs and handoff expectations.
4. List named tools and implied tools.
5. Identify policy risks: credentials, PII, LGPD, WhatsApp/Instagram/Meta policies, scraping, off-platform contact, payments and production access.
6. Define the fastest safe first phase Paulo can propose.
7. Score readiness from 1 to 5.
8. Create or update one prep action if readiness is below 5.

## 99Freelas Pricing Rule

On 99Freelas, Paulo prioritizes winning the deal/reply/review. Always derive the lowest defensible entry price:

1. identify the smallest useful deliverable;
2. price below the visible average and at/below the lowest credible competitor when visible;
3. cut scope, never quality gates;
4. state what is phase 1 and what becomes phase 2;
5. preserve tests, docs, security/LGPD/platform guardrails and handoff.

If the scope is broad, quote a paid diagnostic, blueprint, first fix or MVP slice instead of the full build.

## Standard Output Block

```yaml
opportunity_learning:
  platform:
  title:
  url:
  score_fit:
  score_readiness:
  lowest_defensible_entry_price:
  entry_scope:
  phase_2_scope:
  buyer_pain:
  requested_scope:
  fastest_safe_first_phase:
  tools_and_apis:
  procedure:
    - intake:
    - setup:
    - build:
    - test:
    - handoff:
  reusable_assets:
    proposal_snippet:
    discovery_checklist:
    architecture_skeleton:
    implementation_checklist:
    test_plan:
    runbook:
  risks:
    platform_tos:
    lgpd_or_pii:
    credentials:
    off_platform:
  prep_action:
```

## Readiness Rules

- `5`: Paulo can start immediately with existing assets.
- `4`: Paulo can start after reading client docs or adapting a template.
- `3`: Paulo can win, but should create a starter/checklist before signing.
- `2`: Only propose a paid diagnostic or discovery sprint.
- `1`: Do not pursue now.

## Default Faster-Than-Expected Delivery Pattern

For broad AI/automation requests, propose a small first phase:

1. map process and access boundaries;
2. confirm tools, APIs, sandbox and data shape;
3. implement one narrow working flow;
4. test happy path, error path and fallback;
5. deliver runbook plus phase-2 backlog.

This protects Paulo from underpriced full builds and gives the client visible progress quickly.

## Prep Asset Naming

Use one of these when creating new assets:

- `templates/freelance/checklist-{theme}.md`
- `templates/freelance/proposal-{theme}.md`
- `reports/freelance/{date}-{theme}-learning.md`
- `output/freelance-proposals/{date}-{platform}-{slug}.md`

## Prohibited Content

Never store secrets, cookies, OAuth tokens, API keys, private messages, client raw PII, payment details or confidential files in the tracker, Vault, reports, prompts or emails.
