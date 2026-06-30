# Production n8n Operations Checklist

Use this for opportunities that ask for n8n plus WhatsApp Cloud, payment flows, Google Workspace, bots, qa/prod separation, observability, retries, idempotency, audit logs or stability testing.

Do not request or store real tokens, cookies, payment keys, private data or production credentials in proposals, reports or Markdown. Client credentials must stay in the client/provider account and be shared only after contract through a secure access path.

## Discovery

- Confirm the business process: trigger, user, expected response, failure owner and success metric.
- Split `qa` and `prod` flows before estimating production work.
- Identify every external system: WhatsApp Cloud, payment processor, Google Workspace, CRM/support tool, database and alert channel.
- Record the event types that matter: inbound message, payment started, payment confirmed, refund/cancel, support escalation, retry exhausted and manual override.
- Confirm WhatsApp opt-in, message-template requirements and human handoff rules.

## Access Boundary

- Ask for sandbox/test credentials first when available.
- Use client-controlled provider access after contract; never ask for secret values in chat.
- Separate read-only discovery access from write/send/payment permissions.
- Require a rollback owner before touching production flows.
- Confirm whether payment webhooks are test mode or live mode before connecting anything.

## Architecture

- Define one canonical event ID per workflow run.
- Add a `correlation_id` that travels across webhook, n8n execution, logs, storage and alerts.
- Add idempotency keys for payment, booking, order, message and workspace-creation events.
- Keep payment confirmation as a provider-verified event, not an LLM inference.
- Route ambiguous or high-risk actions to human approval.

## Observability

- Log start/end state, provider event ID, correlation ID, retry count and final outcome.
- Capture structured error categories: auth, validation, provider timeout, rate limit, duplicate event, data mismatch and manual-review-needed.
- Add alerts only for actionable failures, not every transient retry.
- Keep logs free of tokens, full payment data, raw private messages and unnecessary PII.
- Define the daily health view: successful runs, failed runs, retries, pending manual reviews and stale executions.

## Retry And Idempotency

- Retry provider timeouts with bounded backoff.
- Do not retry irreversible actions without an idempotency key.
- Store processed event IDs before downstream side effects where possible.
- Make duplicate webhook delivery safe.
- Define manual recovery steps for partially completed runs.

## Testing

- Test happy path, invalid payload, duplicate payload, provider timeout, payment not confirmed, WhatsApp template rejection and human handoff.
- Run at least one qa replay before production activation.
- Validate latency for the buyer's target response time.
- Confirm rollback or disable switch before go-live.
- Keep screenshots/log excerpts redacted.

## Handoff

- Deliver flow map, environment map, credential ownership notes, alert ownership, known limits and phase-2 backlog.
- Include a runbook for failed payment/webhook/message cases.
- Include a change log for each production touch.
- Leave the client with qa/prod names, expected event examples and safe test instructions.

## Proposal Angle

Lead with reliability:

> I would not start by wiring every automation at once. First I would harden one qa/prod flow with clear event IDs, retries, idempotency, logs, alerts and a rollback path. Once that is stable, the remaining bots and integrations become safer to expand.
