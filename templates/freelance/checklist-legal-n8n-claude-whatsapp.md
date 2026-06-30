# Legal n8n / Claude / WhatsApp Automation Checklist

Purpose: scope legal-demand and correspondent automation projects safely. Public-safe template only; never store client secrets, tokens, case files, personal data, payment details or private messages here.

## Best-Fit Scope

- Triage inbound legal requests from WhatsApp or web forms.
- Classify demand type, urgency, location and missing information.
- Route demand to a human coordinator or approved correspondent workflow.
- Generate structured summaries and next-step suggestions for human review.
- Maintain auditable case states and handoff notes.

## Fastest Safe First Phase

1. Map the legal operation: request sources, demand types, responsible users, SLA and current handoff.
2. Define a minimum case-state model: received, missing-info, under-review, assigned, in-progress, completed, blocked.
3. Build one n8n flow with fake data: inbound request, Claude classification, human approval, assignment notification and log entry.
4. Add guardrails: no autonomous legal advice, no off-platform data leakage, no irreversible action without human approval.
5. Test happy path, missing-information path, urgent-case path and model-uncertain path.
6. Deliver a runbook with access boundaries, audit fields, prompt versioning and phase-2 backlog.

## Intake Questions

- Which legal demand types should be supported first?
- Who reviews/approves classification before assignment?
- What system stores the official case record today?
- Which WhatsApp provider or official API path is allowed?
- What data is sensitive, regulated or client-confidential?
- What counts as an urgent case versus a normal queue item?
- Are correspondents internal, marketplace-based or external partners?

## Data And Auth Boundaries

- Use fake case payloads until contract and secure client access exist.
- Keep API keys, webhook secrets, WhatsApp tokens and LLM provider keys in provider/env access only.
- Do not paste case documents, names, phone numbers or legal facts into chat, Markdown, email or repo files.
- Store only minimal structured metadata required for routing and audit.

## Compliance / ToS Risks

- WhatsApp opt-in and template rules.
- LGPD and legal professional confidentiality.
- Unauthorized legal advice if the AI output is client-facing.
- Hallucinated legal classification without human review.
- Off-platform contact or correspondent solicitation rules.
- Retention of sensitive case data beyond the agreed purpose.

## Proposal Angle

I would start with a controlled operational pilot, not an autonomous legal system.

First phase: map the current demand flow, build one n8n workflow with Claude classification on fake/test data, add a human approval step, log each decision, and deliver a runbook. The AI helps organize and summarize; legal judgment and assignment approval stay with the responsible human.
