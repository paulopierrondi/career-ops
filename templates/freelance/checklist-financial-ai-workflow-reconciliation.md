# Financial AI Workflow / Reconciliation Checklist

Use this for projects that ingest messy financial files and turn them into auditable review workflows. The buyer usually does not need a chatbot; they need reliable data normalization, matching, exception handling and evidence.

## Discovery

- What documents arrive first: bank statements, GL exports, invoices, PDFs, CSV, Excel, screenshots or API data?
- What is the first reconciliation unit: transaction, account, entity, vendor, customer, period or engagement?
- What is the expected output: review queue, export, dashboard, exception report, client-ready deliverable or API?
- What decisions must stay human-approved?
- What accuracy threshold is acceptable before human review?
- What audit evidence must be retained for each AI-assisted decision?

## Data Contract

- Raw file metadata: source, upload user, timestamp, entity, period, checksum and retention policy.
- Canonical transaction fields: date, amount, currency, debit/credit, account, counterparty, memo, document reference, source row and confidence.
- Normalized entity fields: entity id, legal name, account ids, fiscal period, owner and reviewer.
- Exception fields: reason code, severity, confidence, suggested action, assigned reviewer, status and resolution note.
- Audit event fields: event type, actor, model/tool version, input reference, output reference, before/after state and timestamp.

## Matching Logic

- Start deterministic: exact amount/date/reference/account/entity matches.
- Add fuzzy only where deterministic fails: date windows, memo similarity, counterparty normalization and amount tolerance.
- Keep rules explainable: every match should expose why it matched and what evidence was used.
- Separate AI extraction confidence from reconciliation confidence.
- Never let AI silently overwrite source data; write proposed normalized values and reviewer decisions separately.

## AI Layer

- Use Claude/Anthropic or equivalent for extraction, classification, explanation and reviewer summaries.
- Force structured outputs with schema validation and rejection paths.
- Add regression fixtures for common failure modes: duplicated rows, split payments, currency symbols, missing dates, OCR mistakes and subtotal rows.
- Track model version, prompt version, latency, cost and validation failure rate.
- Prefer bounded worker jobs over synchronous UI calls for large files.

## Review UI

- Reviewer should see source row/document, normalized transaction, proposed match, confidence, reason codes and audit history.
- Required actions: accept, reject, split, merge, mark duplicate, request more info and add note.
- Include filters for low confidence, high amount, unmatched, duplicate risk and suspicious category.
- Preserve an exportable audit report for client delivery.

## Security And Operations

- Use client-approved storage only after contract.
- Encrypt files at rest and avoid storing secrets in docs, chat or logs.
- Use role-based access for uploaders, reviewers and admins.
- Keep deletion/retention policy explicit.
- Log every file upload, extraction job, review decision and export.
- Run a rollback path for bad imports or model regression.

## First Paid Slice

Recommended first milestone:

- Ingest one bank statement and one GL/export fixture.
- Normalize into canonical transactions.
- Run deterministic + fuzzy matching.
- Generate exceptions with confidence scores.
- Show a minimal review queue.
- Export an audit trail and reconciliation summary.

Acceptance criteria:

- Raw files preserved unchanged.
- Every normalized row links back to source evidence.
- At least five known edge cases are tested.
- Reviewer decisions update status without changing raw source data.
- Handoff includes data schema, matching rules, run commands and known limits.
