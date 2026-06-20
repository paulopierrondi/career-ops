# ERP API + Claude Delivery Checklist

Use for opportunities that ask Paulo to connect an ERP API to Claude/Anthropic or another LLM.

## Positioning

Sell a short technical proof first, not a full enterprise integration.

Default first phase:
- map ERP auth, endpoints and data shape;
- connect one safe read-only or controlled-action flow;
- return structured JSON from Claude;
- log requests, errors and model outputs;
- hand off a phase-2 map for more endpoints and permissions.

## Discovery Questions

1. Which ERP is used?
2. Is there official API documentation, OpenAPI/Swagger, Postman collection or vendor docs?
3. Is there a sandbox, test tenant or sample dataset?
4. Which 2 or 3 processes should be automated first?
5. Should Claude only consult data, or can it create/update records?
6. What authentication is available: API key, OAuth, basic auth, token exchange or service account?
7. Are there rate limits, audit logs or approval requirements?
8. What data is sensitive or prohibited for model prompts?
9. Who validates the output: business user, technical owner or both?

## Access Boundaries

- Do not request production credentials before contract and secure access path.
- Prefer docs, sandbox, sample payloads or screenshare for first diagnostic.
- Treat API keys, OAuth secrets and ERP exports as secrets or sensitive data.
- Do not store credentials in chat, reports, Vault, repo or screenshots.

## Architecture Skeleton

```text
Client ERP
  -> REST/JSON endpoint
  -> integration service
  -> validation + redaction layer
  -> Claude/Anthropic request
  -> structured JSON response
  -> business rule / permission check
  -> ERP read or controlled update
  -> logs + handoff report
```

## Implementation Steps

1. Confirm endpoint, auth and sample payload.
2. Create a minimal API client.
3. Normalize ERP response into a small internal JSON shape.
4. Define the Claude task: summarize, classify, extract, recommend or prepare update.
5. Force structured output with JSON schema or strict output instructions.
6. Validate model response before any writeback.
7. Add error handling for auth failure, timeout, empty response and invalid JSON.
8. Add logs without secrets or raw sensitive payloads.
9. Run 5-10 sample cases.
10. Write handoff with phase-2 backlog.

## Test Plan

| Test | Expected result |
|---|---|
| Valid API payload | Claude returns structured response |
| Missing field | Flow returns controlled error |
| Invalid auth | No model call; auth error is logged |
| Claude invalid JSON | Flow retries or fails safely |
| Sensitive field present | Redaction or exclusion is confirmed |
| Writeback disabled | No ERP update occurs |
| Writeback enabled | Update requires explicit rule and validation |

## Proposal Snippet

```text
Eu comecaria por uma prova tecnica curta: validar um fluxo ERP -> Claude em um caso de uso bem definido, com autenticacao segura, payload JSON controlado, resposta estruturada, logs e separacao clara entre consulta e alteracao de dados. Assim voce valida a arquitetura antes de expandir para varios processos.
```

## Handoff Deliverables

- API endpoint map.
- Auth approach, without secret values.
- Payload examples redacted.
- Claude prompt/output contract.
- Error/fallback behavior.
- Test evidence.
- Phase-2 backlog by endpoint/process.
