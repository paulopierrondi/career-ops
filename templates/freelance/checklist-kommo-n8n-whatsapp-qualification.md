# Kommo + n8n + WhatsApp Qualification Checklist

Purpose: prepare a fast, compliance-safe first phase for buyers asking for WhatsApp intake, AI qualification and Kommo CRM automation.

Do not store client credentials, WhatsApp numbers, contact exports, policy screenshots, private messages or payment data in this file or in reports.

## First Phase Scope

- Map the sales or support funnel in Kommo: stages, required fields, owner rules and loss reasons.
- Define the minimum qualification form: name, location, product/service need, urgency, current provider, decision maker and preferred callback window.
- Confirm WhatsApp path: official WhatsApp Cloud API or approved provider; avoid promises around unsupported personal-number automation.
- Build one narrow n8n flow: inbound message -> AI extraction -> Kommo lead update -> stage move -> human alert.
- Add fallback rules: low confidence, missing data, angry customer, price objection, policy-sensitive request and human takeover.
- Deliver a short runbook with setup, testing, failure modes and phase-2 backlog.

## Intake Questions

1. Is Kommo already configured, or should the first phase include pipeline and custom-field setup?
2. Which WhatsApp provider is approved for the account?
3. What data may the AI read, and what data must remain human-only?
4. What exact trigger means a lead is ready for human follow-up?
5. Which messages need template approval or legal review?
6. Who owns errors, retries and manual correction inside Kommo?

## Delivery Checks

- Use sandbox/test contacts before touching real leads.
- Log every write from n8n to Kommo with timestamp, lead id, changed field and source event.
- Keep AI output constrained to JSON fields before writing to CRM.
- Require human review before deleting, merging or bulk-updating CRM records.
- Validate opt-in, LGPD basis and WhatsApp template rules before outbound follow-ups.
- Document provider costs and limits without making approval guarantees.

## Proposal Angle

Offer a small diagnostic/build sprint: "I will first make one working qualification path end to end, with safe CRM writes, logs and a handoff runbook. After that, we can expand to more stages, campaigns and dashboards without rebuilding the foundation."
