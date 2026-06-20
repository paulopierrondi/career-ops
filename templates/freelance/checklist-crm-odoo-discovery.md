# CRM / Odoo Discovery Worksheet

Use for opportunities around Odoo, Zoho, Pipedrive, Kommo, HubSpot or CRM migration/customization.

## Positioning

Sell a discovery/configuration sprint first. CRM projects become risky when the client asks for "configurar tudo" without a process map, field model, permission model or migration plan.

Default first phase:
- map pipeline/process;
- inspect current CRM configuration or spreadsheet source;
- define fields, stages, automations and owners;
- configure or prototype one critical flow;
- hand off backlog and migration/automation plan.

## Official Odoo References To Keep Current

- Odoo 18 External API docs: https://www.odoo.com/documentation/18.0/developer/reference/external_api.html
- Odoo 19 External JSON-2 API docs: https://www.odoo.com/documentation/19.0/developer/reference/external_api.html

Important current API note: Odoo external API access depends on plan/version. Confirm the client's edition, hosting and API availability before promising integrations.

## Discovery Questions

1. Which CRM is in scope: Odoo, Zoho, Pipedrive, Kommo, HubSpot or another?
2. Is this configuration, migration, integration, automation or support?
3. What process should be mapped first: sales, support, onboarding, finance or operations?
4. What stages exist today?
5. Which fields are mandatory?
6. Who owns each stage?
7. What data needs to be migrated?
8. Are there duplicate contacts/deals/products?
9. Which automations are required: reminders, status changes, WhatsApp, email, tasks, dashboards?
10. Are there permission or approval rules?
11. Which integrations matter: WhatsApp, website forms, ERP, email, calendar, payment, BI?
12. Who signs off the configuration?

## Odoo-Specific Checks

| Area | Questions |
|---|---|
| Edition/hosting | Odoo Online, Odoo.sh, self-hosted or partner-hosted? |
| Version | Which Odoo version? |
| Apps | CRM, Sales, Inventory, Accounting, Helpdesk, Website, Studio? |
| Customization | Native config, Studio, custom module or external integration? |
| API access | Is external API enabled for the plan/version? |
| Users | Number of users and roles? |
| Data | Leads, opportunities, contacts, products, invoices or activities? |
| Migration | Source system and export format? |
| Automation | Server actions, automated actions, email templates, webhooks or external n8n/Make? |

## Access Boundaries

- Do not request admin credentials in chat.
- Prefer screenshare or temporary restricted admin access after contract.
- Never store exports with client data in repo/Vault.
- Keep API keys and passwords in the client's system or approved secret path.
- Use redacted screenshots only when needed.

## CRM Process Map Template

| Stage | Owner | Entry criteria | Required fields | Automation | Exit criteria |
|---|---|---|---|---|---|
| New lead |  |  |  |  |  |
| Qualified |  |  |  |  |  |
| Proposal |  |  |  |  |  |
| Won/Lost |  |  |  |  |  |

## Field Map Template

| Object | Field | Type | Required | Source | Destination | Rule |
|---|---|---|---|---|---|---|
| Contact |  |  |  |  |  |  |
| Company |  |  |  |  |  |  |
| Deal/Opportunity |  |  |  |  |  |  |
| Activity |  |  |  |  |  |  |

## Implementation Steps

1. Capture current process and pain points.
2. Inventory apps/modules/users.
3. Build process map and field map.
4. Clean stage definitions and required fields.
5. Configure one priority pipeline or flow.
6. Add one or two automations only after fields/stages are stable.
7. Test with sample records.
8. Document migration risks and phase-2 backlog.

## Test Plan

| Test | Expected result |
|---|---|
| New lead creation | Required fields and owner are correct |
| Stage movement | Automations trigger only when expected |
| Duplicate contact | Duplicate policy is clear |
| Activity/reminder | Correct user receives task |
| WhatsApp/email integration | Message is logged without duplicate spam |
| Permission test | User sees only permitted records |
| Import sample | Fields map correctly and errors are visible |
| Dashboard/report | Metrics match field definitions |

## Proposal Snippet

```text
Eu comecaria por um sprint de configuracao/descoberta: mapear pipeline, campos, usuarios, regras e automacoes antes de mexer pesado no CRM. No Odoo, tambem valido versao/plano/API antes de prometer integracao. A entrega da primeira fase e um fluxo funcionando, mapa de campos e backlog claro de migracao/automacao.
```

## Handoff Deliverables

- Process map.
- Field map.
- User/permission notes.
- Automation backlog.
- Migration risk list.
- Test record evidence.
- Phase-2 plan.
