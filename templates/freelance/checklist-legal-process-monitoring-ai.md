# Legal Process Monitoring AI Checklist

Use for opportunities that ask for AI to monitor Brazilian judicial publications, extract movements and summarize legal process changes.

## Intake

- Confirm the exact source: Diario Oficial, court portal, client files, API, email or manual upload.
- Verify access is public, client-authorized and allowed by source terms.
- Confirm jurisdictions, publication frequency, party names, process numbers and expected alert SLA.
- Define whether the system only summarizes information or triggers legal workflow actions.

## Data Boundary

- Do not receive court login credentials, client private case files, cookies or tokens in chat/repo/email.
- Use fake or redacted samples before contract.
- Treat party names, process numbers and legal facts as sensitive operational data.
- Keep attorney/legal interpretation as human-reviewed output, not autonomous advice.

## First Phase

- Build a source map and permission/risk matrix.
- Define a normalized schema: process number, parties, publication date, movement, deadline hint, source URL, confidence and reviewer status.
- Prototype ingestion on a tiny redacted/fake fixture set.
- Add dedupe rules for repeated publications and corrected entries.
- Produce a human-review summary template.

## QA

- Test duplicate publications, missing process number, OCR noise, same party across multiple processes and ambiguous movement text.
- Require confidence scores and "needs review" status for uncertain extraction.
- Log source, timestamp, parser version and reviewer decision.
- Validate no autonomous legal deadline or advice is sent without human review.

## Proposal Angle

Sell a paid diagnostic plus first monitored-flow slice: source validation, extraction schema, dedupe, summary and reviewer queue. Do not promise a full legal monitoring platform at entry price.
