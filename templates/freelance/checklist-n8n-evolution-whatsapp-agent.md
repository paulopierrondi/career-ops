# n8n + Evolution API WhatsApp Agent Stabilization Checklist

Use for opportunities that ask Paulo to fix, implement or stabilize WhatsApp AI agents using n8n, Evolution API and OpenAI/Anthropic.

## Positioning

Sell stabilization first. Many clients already have a broken flow, unclear provider setup or unreliable prompt behavior.

Default first phase:
- diagnose current n8n workflow and Evolution API health;
- stabilize one inbound WhatsApp flow;
- improve prompt, memory and fallback;
- add logs and test conversations;
- hand off a clean runbook.

## Discovery Questions

1. Is the WhatsApp number already connected to Evolution API?
2. Is the issue connection, webhook, prompt, memory, routing or message delay?
3. Where is n8n hosted?
4. Which AI provider is used: OpenAI, Anthropic, Gemini or other?
5. Does the agent answer FAQs, qualify leads, book appointments or update CRM?
6. Is there a human handoff rule?
7. Are there existing logs or failed executions?
8. Are messages opt-in and compliant with platform rules?
9. Is production traffic active now?

## Access Boundaries

- Do not ask for tokens in chat.
- Use screenshare, temporary restricted access or client-side credential entry.
- Do not store WhatsApp numbers, message history or customer PII in repo/Vault.
- Do not promise deliverability or Meta approval.
- Avoid spam, cold DM automation or unauthorized outreach.

## Diagnostic Order

1. Check Evolution API instance status.
2. Confirm webhook URL and event delivery.
3. Check n8n workflow activation state.
4. Inspect trigger node and execution history.
5. Validate AI provider node/key boundary.
6. Confirm prompt and response parsing.
7. Confirm message send node and recipient format.
8. Check timeout, retries and duplicate sends.
9. Confirm human handoff and stop conditions.

## Minimum Workflow Skeleton

```text
WhatsApp inbound message
  -> Evolution webhook
  -> n8n trigger
  -> normalize sender/message
  -> policy/filter/intent check
  -> AI response with system prompt
  -> fallback/human handoff decision
  -> send WhatsApp reply
  -> log safe metadata
```

## Implementation Steps

1. Clone or backup current n8n workflow before changes.
2. Create a test path with one WhatsApp number or sandbox contact.
3. Normalize inbound payload fields.
4. Add guardrails: no hallucinated pricing, no legal/medical/financial claims unless approved.
5. Add fallback for unknown answer.
6. Add human handoff trigger.
7. Add execution logging without raw PII.
8. Run scripted conversations.
9. Document what changed.

## Test Conversation Set

| Scenario | Expected result |
|---|---|
| Greeting | Agent responds naturally and asks relevant next question |
| Known FAQ | Agent answers from approved source |
| Unknown question | Agent admits limitation or routes to human |
| Lead qualification | Agent captures required fields only |
| Duplicate message | No duplicate response loop |
| Provider/API failure | User receives fallback or no unsafe response |
| Human handoff phrase | Flow stops AI and routes to human |

## Proposal Snippet

```text
Eu trataria como um sprint de estabilizacao: revisar Evolution API, webhook, n8n, prompt, fallback e testes reais de conversa. A meta da primeira fase e deixar um fluxo WhatsApp funcionando de ponta a ponta, com logs e handoff, antes de ampliar automacoes.
```

## Handoff Deliverables

- Workflow map.
- Nodes changed.
- Provider boundaries.
- Prompt/fallback rules.
- Test conversation evidence.
- Known limitations.
- Next backlog.
