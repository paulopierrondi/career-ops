# Freelance Radar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a safe local radar that ranks freelance AI/automation opportunities and produces proposal drafts for Paulo.

**Architecture:** A standalone Node script reads YAML config, JSON leads, and Markdown templates. It scores opportunities locally and writes Markdown reports/drafts only. There are no external sends or authenticated provider calls.

**Tech Stack:** Node.js ESM, `js-yaml`, local Markdown/JSON/YAML files.

## Global Constraints

- Do not send outreach, publish content, change ads, push, deploy, mutate Linear, or touch secrets.
- Preserve user-layer data and existing dirty worktree changes.
- Productized offers must stay conflict-safe and avoid ServiceNow/Bradesco confidential material.
- Outbound remains draft-only and LGPD-compliant.

---

### Task 1: Add Config, Seeds, and Templates

**Files:**
- Create: `config/freelance-radar.yml`
- Create: `data/freelance-leads.json`
- Create: `templates/freelance/proposal-ai-revenue-ops.md`
- Create: `templates/freelance/proposal-automation-audit.md`
- Create: `templates/freelance/proposal-content-repurposing.md`
- Create: `templates/freelance/proposal-agent-ops.md`

**Interfaces:**
- Produces: `sources`, `offers`, `scoring`, `gates`, and lead objects consumed by `freelance-radar.mjs`.

- [x] **Step 1:** Create config with source URLs, offer definitions, scoring weights, and gates.
- [x] **Step 2:** Seed current public marketplace opportunities from safe snippets and URLs.
- [x] **Step 3:** Create proposal templates with placeholders used by the renderer.

### Task 2: Add Radar CLI

**Files:**
- Create: `freelance-radar.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `config/freelance-radar.yml`, `data/freelance-leads.json`, `templates/freelance/*.md`.
- Produces: report object, Markdown report, proposal drafts.

- [x] **Step 1:** Implement argument parsing for `--json`, `--dry-run`, `--report`, `--proposals`, `--limit`, and `--self-test`.
- [x] **Step 2:** Implement scoring and offer matching.
- [x] **Step 3:** Implement Markdown report and proposal rendering.
- [x] **Step 4:** Add npm scripts for radar and self-test.

### Task 3: Add Usage Documentation

**Files:**
- Create: `docs/freelance-radar.md`

**Interfaces:**
- Produces: operator-facing runbook.

- [x] **Step 1:** Document commands, workflow, gates, and weekly operating rhythm.
- [x] **Step 2:** Document how to add leads safely without exposing PII or secrets.

### Task 4: Verify

**Files:**
- No source changes expected.

**Interfaces:**
- Consumes: CLI outputs and existing repo verifier.

- [x] **Step 1:** Run `node freelance-radar.mjs --self-test`.
- [x] **Step 2:** Run `node freelance-radar.mjs --dry-run --json`.
- [x] **Step 3:** Run `node freelance-radar.mjs --limit 8`.
- [x] **Step 4:** Run `npm run verify`.
