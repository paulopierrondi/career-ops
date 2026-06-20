# AI Voice / Telephony Agent Delivery Checklist

Use for opportunities that ask Paulo to configure voice AI for phone support, reception, qualification or FAQ automation.

## Positioning

Sell a short PoC first. Voice projects fail when the client has no clear telephony provider, call flow, fallback rule or consent policy.

Default first phase:
- map phone/PBX/SIP/VoIP setup;
- define one call flow;
- connect one voice-agent path in a safe test environment;
- test latency, fallback, transfer and transcript;
- hand off phase-2 options for production routing.

## Official References To Keep Current

- OpenAI Realtime and audio docs: https://developers.openai.com/api/docs/guides/realtime
- Twilio Media Streams overview: https://www.twilio.com/docs/voice/media-streams
- Twilio Media Streams WebSocket messages: https://www.twilio.com/docs/voice/media-streams/websocket-messages
- Twilio `<Stream>` TwiML docs: https://www.twilio.com/docs/voice/twiml/stream
- ElevenLabs Agents overview: https://elevenlabs.io/docs/eleven-agents/overview
- ElevenLabs SIP trunking integration: https://elevenlabs.io/agents/integrations/sip-trunking

## Stack Options

| Path | Best for | Notes |
|---|---|---|
| OpenAI Realtime + telephony bridge | Low-latency speech-to-speech agent with tool calls | Good when custom logic and app integration matter |
| Twilio Voice + Media Streams | Existing phone number/call routing plus WebSocket audio access | Strong for controlled PoCs and call logs |
| ElevenLabs Agents | Faster voice-agent setup with hosted agent tooling and telephony integrations | Good when speed and voice quality matter more than custom backend |
| STT + LLM + TTS pipeline | More control and easier debugging | Usually higher latency than native realtime/speech-to-speech |

## Discovery Questions

1. Is the phone number already on Twilio, Zenvia, TotalVoice, PABX, SIP trunk or another provider?
2. Is the AI expected to answer inbound calls, make outbound calls, or both?
3. What is the first use case: FAQ, lead qualification, appointment scheduling, triage or support status?
4. Should the agent transfer to a human? Which number, queue or department?
5. Is call recording allowed and disclosed?
6. Should transcripts be stored? Where?
7. What languages and accent are required?
8. What is the maximum acceptable delay before the agent speaks?
9. What data can the agent access or update?
10. What phrases must trigger immediate human fallback?

## Compliance And Risk Gates

- Confirm consent, recording disclosure and LGPD posture before storing audio/transcripts.
- Do not request production telephony credentials in chat.
- Do not promise carrier approval, perfect latency or 100% containment.
- Avoid outbound calling unless there is explicit opt-in, legal basis and platform-safe process.
- Keep emergency, legal, medical, financial and high-risk decisions routed to humans.

## Architecture Skeleton

```text
Inbound call
  -> telephony provider / SIP / PBX
  -> call routing or media stream
  -> voice agent session
  -> approved knowledge / business rules
  -> optional tool call or CRM lookup
  -> response audio
  -> transcript + safe logs
  -> human fallback / transfer
```

## PoC Procedure

1. Confirm current telephony provider and test number.
2. Draw one call flow: greeting, intent, data capture, answer, fallback, close.
3. Choose PoC path: hosted agent, Twilio stream bridge, or custom realtime bridge.
4. Build with synthetic FAQ and test data first.
5. Add strict prompt boundaries and disallowed actions.
6. Configure fallback phrases and confidence threshold.
7. Test 10 call scenarios.
8. Document latency, failures, unsupported questions and production requirements.

## Test Call Set

| Scenario | Expected result |
|---|---|
| Basic greeting | Agent introduces itself and asks the next question |
| Known FAQ | Agent answers from approved content |
| Unknown question | Agent routes to human or takes message |
| Human request | Agent transfers or logs callback request |
| Sensitive request | Agent refuses or routes to human |
| Silence/noise | Agent reprompts once, then fallback |
| Provider/API failure | Call does not loop; fallback path triggers |
| Long caller speech | Agent summarizes and confirms |
| Wrong number/off-topic | Agent closes safely |
| Recording disclosure | Disclosure happens if recording/transcript is enabled |

## Proposal Snippet

```text
Eu trataria como uma prova tecnica de voz, nao como implantacao definitiva logo de inicio. Primeiro valido o provedor telefonico/PBX, desenho um fluxo simples de atendimento, configuro um agente para FAQ/coleta de dados/fallback humano e testo latencia, transferencia, logs e transcricao. Depois disso fica claro o que precisa para producao.
```

## Handoff Deliverables

- Telephony provider map.
- Call flow diagram.
- Prompt and fallback rules.
- Test call evidence.
- Transcript/log policy.
- Production readiness checklist.
- Phase-2 options and risks.
