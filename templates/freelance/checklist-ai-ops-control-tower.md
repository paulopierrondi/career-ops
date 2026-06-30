# AI Operations Control Tower Checklist

Use this for freelance scopes where a buyer has many disconnected AI tools, dashboards, automations, CRMs, repositories or deployment surfaces and needs architecture, governance and visibility before more build work.

## Phase 1 Scope

- Map current systems, owners, critical workflows and user roles.
- Inventory integrations, automations, dashboards, data sources and deployment paths.
- Identify duplicated, obsolete, fragile or unowned components.
- Define a target control-tower architecture with phased implementation.
- Deliver one first artifact: workflow registry, access matrix, monitoring blueprint or risk/prioritization backlog.

## Intake Questions

- Which tools are in scope: GitHub, Vercel, Supabase, Chatwoot, Make, Tiny, Kommo, CRM, dashboards, agents or custom apps?
- Which workflows produce revenue, support clients or affect production?
- Who owns each workflow, integration, dashboard and deployment?
- What currently fails: visibility, speed, duplicated tools, access control, client data, logs, handoff or cost?
- Which systems can be reviewed with redacted exports, screenshots or read-only access after contract?
- Which actions are prohibited in phase 1: production changes, data migrations, credential rotation, deploys or client-facing workflow edits?

## Inventory Fields

| Field | Notes |
|---|---|
| System/tool | Product, repo, dashboard, workflow or provider name. |
| Owner | Business and technical owner if known. |
| Purpose | Revenue, support, reporting, operations, delivery or admin. |
| Data touched | Only categories, never raw PII or secrets. |
| Integrations | Upstream/downstream systems and trigger direction. |
| Auth boundary | Read-only, admin, API key, OAuth, service account or unknown. |
| Logs/evidence | Where failures and events can be checked. |
| Risk | P0/P1/P2 plus short reason. |
| Recommended action | Keep, consolidate, document, harden, replace or defer. |

## Control-Tower Deliverables

- System map showing tools, workflows, data flow and owners.
- Access and secret-boundary matrix.
- Workflow registry with status, owner, trigger, failure mode and log source.
- Duplication and obsolete-component matrix.
- Priority backlog with quick wins, risk fixes and phase-2 implementation.
- Operating cadence: weekly review, change control, runbook ownership and incident path.

## Safety Rules

- Do not request or store API keys, cookies, database dumps, private keys or provider exports in Markdown, chat, email or screenshots.
- Use redacted screenshots, metadata exports or client-controlled read-only access where possible.
- Do not change production workflows, deploy, rotate secrets or modify payment/account settings without explicit approval.
- Keep AI agents human-reviewed where outputs affect customers, money, support commitments or public content.
- Treat CRM, support, transaction and analytics data as sensitive even when the client calls it "internal only".

## Acceptance Criteria

- The client can name every critical workflow owner and system of record.
- The first control artifact exposes the top 5 risks and top 5 quick wins.
- The backlog separates audit/documentation, hardening and implementation work.
- Every recommended production change has rollback, access and approval requirements.
- Phase 2 can be quoted as bounded implementation slices instead of an open-ended cleanup.
