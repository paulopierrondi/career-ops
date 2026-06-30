# Microsoft 365 Recruiting Workflow Checklist

Use for 99Freelas/Workana projects that ask for recruitment intake, CV storage and candidate tracking inside Microsoft 365 Business Basic.

## Client-Facing Offer Shape

- Sell a paid POC first when the client asks for proof before hiring.
- Keep the public chat high-level: outcome, ownership, timeline, price, validation and support.
- Do not disclose full column schema, matching rules, flow conditions or implementation sequence before the POC is paid.
- Keep all work inside the client's tenant. Do not use Paulo's personal Microsoft account as the base.
- Use 99Freelas/Workana payment and communication rules. Do not request off-platform contact.

## Intake

- Confirm the Microsoft 365 plan and available admin/RH permissions.
- Confirm which tenant account will own all lists, flows, SharePoint sites/libraries and mailbox rules.
- Confirm whether external candidates can submit Forms anonymously or must authenticate.
- Confirm the dedicated CV inbox, naming convention and expected attachment formats.
- Confirm candidate stages, statuses, vacancy IDs, RH roles and internal notification recipients.
- Confirm retention/LGPD expectations for candidate data and CV files.

## POC Acceptance Criteria

- One sample vacancy form captures candidate data.
- One sample candidate record appears in the central tracking list.
- One CV email with attachment is saved to the approved SharePoint location.
- The matching candidate record is updated with a CV link/status.
- RH receives a simple internal notification or can see the updated status.
- No personal provider account is used as the owner of the production artifacts.

## Build Checklist

- Create or configure the central candidate tracking structure.
- Set views for vacancy, status, stage, received CV and banco de talentos.
- Configure the approved SharePoint storage structure and permissions.
- Configure the mailbox/CV intake path and attachment handling.
- Configure automation for form response intake.
- Configure automation for CV intake and candidate matching.
- Configure basic RH notifications if approved.
- Add operational guardrails for duplicate candidates, missing CVs and unmatched email.

## Test Plan

- Happy path: form submission plus matching CV email.
- Missing CV: candidate exists but no attachment received.
- Unmatched CV: email arrives without clear candidate match.
- Duplicate candidate: same email/name across vacancies.
- Permission test: RH can operate; non-RH users cannot access restricted files.
- Handoff test: RH can create/adapt a new vacancy without Paulo.

## Documentation / Handoff

- Architecture summary at business level.
- List of created artifacts and owners.
- How to create a new vacancy form.
- How to adapt questions for a vacancy.
- How to track candidates and update stages.
- How to find CV files.
- How to handle unmatched CVs and operational exceptions.
- 10-day support window: validation, bug fixes and small operational adjustments.

## Pricing Guidance

- Aggressive 99Freelas POC: R$300-R$450, deductible from full implementation.
- Full first version: R$1.000-R$1.800 depending complexity, number of flows, documentation depth and support window.
- Keep broader enhancements as phase 2: dashboards, advanced scoring, integrations, portal, Azure, Power Pages or external tools.

## Red Flags

- Client asks to use Paulo's personal Microsoft account.
- Client wants production credentials pasted in chat.
- Client expects full free technical architecture before paid POC.
- Client needs Azure/Power Pages/third-party tools but budget only covers Business Basic.
- Client wants candidate data exported or stored outside approved Microsoft 365 environment.
