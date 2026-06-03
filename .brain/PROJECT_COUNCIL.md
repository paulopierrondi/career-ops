---
type: project-local-council
project_id: "career-ops"
project_name: "career-ops"
managed_by: "/Users/paulopierrondi/agents-hub/scripts/install-project-local-council.py"
tags: [hub, council, local-agents, generated]
---
# Project Local Council - career-ops

This file is the local council overlay for `career-ops`. It turns the global Product Council into repo-specific operating roles.

## Project Snapshot

- Registry id: `career-ops`
- Name: `career-ops`
- Path: `/Users/paulopierrondi/Projects/career-ops`
- Type: `node`
- Obsidian note: `02_Projects/career-ops`
- Linear hint: `n/a`
- Branch snapshot: `codex/career-ops-railway-app`
- Domain lens: project-specific product domain

## Local Agents

| Local agent | Extends global role | Default coder | Question |
| --- | --- | --- | --- |
| `local-product-owner` | `agente_business_owner` | `kimi` | What concrete user/business problem should this project solve now? |
| `local-technical-lead` | `agente_technical_lead` | `codex` | What is the smallest technically coherent change and how do we verify it? |
| `local-qa-test-agent` | `agente_test_lead` | `gemini` | What evidence proves this did not regress the critical path? |
| `local-release-guardian` | `agente_release_lead` | `claude` | Can this ship safely, and what explicit approval is still required? |
| `local-automation-steward` | `agente_automation_lead` | `codex` | What should be automated here without increasing operational risk? |
| `local-growth-operator` | `agente_marketing_evolution` | `kimi` | What distribution or monetization evidence should drive the next decision? |
| `local-domain-agent` | `agente_unknown_unknowns` | `claude` | What domain-specific risk in project-specific product domain would a generic coder miss? |

## Agent Files

- `.brain/local-agents/local-product-owner.md`
- `.brain/local-agents/local-technical-lead.md`
- `.brain/local-agents/local-qa-test-agent.md`
- `.brain/local-agents/local-release-guardian.md`
- `.brain/local-agents/local-automation-steward.md`
- `.brain/local-agents/local-growth-operator.md`
- `.brain/local-agents/local-domain-agent.md`

## Required Use

- Use local agents before material changes, release decisions, automation, UI/UX, marketing, Linear updates, secrets or production work.
- Pick only the agents relevant to the task; do not call every role when the task is small.
- Keep one task or one Linear issue as the working unit.
- Local agents can recommend. They cannot approve deploy, App Store/TestFlight, paid ads, social publishing, production changes, bulk Linear edits or secrets.
- Prompt caching policy: `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md`. Keep stable repo/Hub/council context before dynamic issue diffs and report `prompt_cache` telemetry when available.

## Start Checklist

- Read `AGENTS.md`, `GEMINI.md`, `.brain/PROJECT_CONTEXT.md`, `.brain/HUB_COUNCIL_CONTEXT.md` and this file.
- Identify the likely Linear project/issue when the work is roadmap, bug, status, release, priority, sprint/cycle, automation or backlog related.
- Select the local agent(s) that match the task.
- Record the selected role(s) in the final handoff.

## Finish Checklist

- Summarize local agent recommendation and evidence.
- Update Obsidian project note or `.brain/SESSION_NOTES.md` after meaningful work.
- Update Linear if issue reality changed; no bulk close/archive/relabel without a cleanup proposal.
- Register screenshots, creative assets, build/deploy state or automation email evidence when relevant.
- Redact secrets.
