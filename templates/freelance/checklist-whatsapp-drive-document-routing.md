# WhatsApp + Google Drive Document Routing Checklist

Use for n8n/Evolution API or WhatsApp Cloud projects where inbound WhatsApp files must be routed to Google Drive with traceability.

## Phase 1 Scope

- Confirm WhatsApp provider: official Cloud API, Evolution API or another approved provider.
- Confirm file types, max size, naming convention and retention period.
- Create one controlled inbound flow: WhatsApp message -> webhook -> file validation -> Drive folder -> confirmation/log.
- Use fake/sample files for build validation until the client provides secure access after contract.
- Deliver a runbook with credential boundaries, retry handling and manual recovery steps.

## Access And Secret Boundary

- No WhatsApp tokens, Google OAuth credentials, service account JSON or VPS credentials before contract.
- Client creates or approves provider access in their own account.
- Store only env var names and permission scope in docs, never values.
- Prefer least-privilege Google Drive folder permissions over broad account access.
- If using Evolution API, document provider risk and fallback to official WhatsApp Cloud API when required.

## Acceptance Tests

- Valid file is saved in the correct Drive folder with expected name.
- Unsupported file type is rejected with a clear log entry.
- Duplicate webhook delivery does not create duplicate files.
- Missing Drive permission produces a visible error and retry path.
- Large file behavior is documented and tested against provider limits.
- Confirmation message does not expose internal links unless the client wants that behavior.

## Handoff

- Architecture diagram with provider, n8n, Drive and log store.
- Folder and file naming convention.
- Webhook retry/idempotency note.
- Access revocation steps.
- Phase 2 backlog for OCR, classification, metadata extraction or CRM write-back.
