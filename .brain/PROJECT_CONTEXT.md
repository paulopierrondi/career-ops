# Project Brain Context

Generated: `2026-07-01 00:11:22`
Tool: `sync`
Local Obsidian vault: `/Users/paulopierrondi/Documents/Obsidian Vault`
Repository: `/Users/paulopierrondi/Projects/career-ops`

This is a non-secret snapshot of the local Obsidian second brain for this repository.

## Required Agent Workflow

1. Read the repo instruction file for your agent: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, or `KIMI.md`. For Google Antigravity, read both `AGENTS.md` and `GEMINI.md`.
2. Read this file before planning work.
3. If local vault access exists, prefer the live Obsidian notes over this snapshot.
4. If running in cloud without local vault access, use this file as the project memory source.
5. Select the relevant best-practice notes and checklists: app/web quality, screenshots, marketing creative/video, frontend, backend/API, web, iOS, Android, AI, release and security.
6. Never store real API keys or secrets in Markdown. Store only inventory metadata.
7. Capture reusable development lessons in the Learning Inbox or `.brain/SESSION_NOTES.md` when the vault is unavailable.
8. After meaningful work, update the live Obsidian project note or append durable context to `.brain/SESSION_NOTES.md`.

## Required Checklist Snapshot

## 04_Areas/Profile/Paulo Pierrondi Profile.md

---
type: profile
owner: Paulo Pierrondi
updated: 2026-05-15
tags:
  - profile
  - operating-context
  - service-now
  - bradesco
  - agent-memory
---
# Paulo Pierrondi Profile

This is required user context for Codex/GPT, Claude Code, Kimi and Gemini.

## Executive Summary

Paulo works across enterprise tech, personal products, family and faith. He is a Technical Account Executive at ServiceNow, focused on the Banco Bradesco account in Brazil, while also building side projects and monetizable frameworks/IP. He prefers direct, structured, information-dense responses with honest analytical pushback. Brazil-facing content defaults to Portuguese.

## Response Style

- Lead with the answer.
- Use executive summary first for complex topics.
- Use bullets and tables when they improve clarity.
- Be direct, dense and copy-paste ready.
- Avoid fluff, motivational tone and vague encouragement.
- Use PT-BR for Brazil-facing material.
- Analogies and frameworks are useful when they sharpen thinking.
- Push back when assumptions are weak, but keep the tone pragmatic.
- Prefer metrics, tradeoffs, explicit risks and next actions.
- Do not end with soft filler such as "se fizer sentido".

## Professional Context

- Role: Technical Account Executive (TAE) at ServiceNow, global team.
- Primary account: Banco Bradesco, FSI Brazil.
- Works with Rodrigo Rezende (Client Director) and Joao Saes (SC).
- Coordinates with Impact and CEG/Services.
- Recurring themes:
  - Bradesco account strategy.
  - CMDB/CSDM transformation.
  - Now Assist and AI Agents.
  - Governance and operating model.
  - FSI positioning.
  - 2026 roadmap.

## Personal Context

- Carioca.
- Lived for a long period in Dublin.
- Currently based in Sao Jose dos Campos, SP.
- Married, family-oriented.
- Faith-oriented worldview.
- Entrepreneurial mindset.
- Active interest in monetizing frameworks and IP.
- US or EMEA relocation is on the radar.

## Top Of Mind

- `pptx-engine`: TypeScript/Node.js CLI for executive deck generation, multi-LLM with Claude and GPT-4, four-phase architecture.
- Claude Code as autonomous long-running agents, including 8-hour runs, across apps such as `exploratorio` and `investcoach_ai`.
- Now Assist Bradesco Operating Model is active.
- Critical open question: direct ServiceNow investment versus Bradesco-authorized budget.

## Bradesco Live Context

- CMDB program organized in four plateaus:
  1. Fundacao.
  2. Fonte Unica.
  3. Conexao Negocio.
  4. Excelencia.
- Accenture is the primary executor, around 800 hours.
- Other partners: NTT, IBM and 4MATT.
- Governance stakeholders:
  - Edson: sponsor.
  - Fabio: strategic forum.
  - Marcena: operational forum.
  - Rodolfo and Rogerio: technical CCB.
- Recurring bottleneck: COI/Sayumi after the January SPM incident.
- Terminology rules:
  - Use `SPM`, not `ITBM`.
  - Use `forum`, not `committee/comite`, unless quoting source material.
  - `Cilmara` is spelled with C.

## Tools And Frameworks

- Claude Code skills:
  - `servicenow-project-pptx`.
  - `bradesco-project-pptx`.
- MCP `servicenow-ai-demo` for `cmdb_ci` queries.
- CMDB context: 61K+ records, with gaps in ownership, serial and IP.
- Framework SADA.
- CSDM Data Quality Analyzer:
  - Python.
  - Bilingual.
  - FSO/regulatory focus.

## Now Assist Editorial Rule

Every Bradesco Now Assist material must explicitly connect:

`operating model -> adoption velocity -> revenue expansion`

## How Agents Should Use This

- Before career, executive, ServiceNow, Bradesco, FSI, Now Assist, CSDM, deck, roadmap or positioning work, read this note.
- When writing for Bradesco or Brazil stakeholders, default to PT-BR and executive density.
- When writing internal or global ServiceNow strategy, keep terminology precise and avoid over-claiming.
- When creating decks, use a consultant-style structure: thesis, evidence, options, recommendation, risks, decision needed.
- For side projects, connect product decisions to monetization, distribution, operational leverage and reusable IP.
- For personal/career questions, balance enterprise credibility, entrepreneurial upside, family constraints, faith-aligned values and relocation optionality.

## Non-Goals

- Do not invent private facts beyond this profile and the project notes.
- Do not over-personalize routine code answers.
- Do not turn faith/family into generic motivational content.
- Do not expose personal or enterprise-sensitive details outside the intended context.

## 99_System/AI Agent Vault Policy.md

---
type: policy
status: generated
generated_at: "2026-07-01 00:09:43"
tags:
  - ai-agents
  - policy
  - second-brain
  - generated
---
# AI Agent Vault Policy

Vault principal: `/Users/paulopierrondi/Documents/Obsidian Vault`

Esta politica vale para Codex, Claude Code, Gemini CLI e Kimi CLI.

## User Operating Profile

- Perfil completo: [[04_Areas/Profile/Paulo Pierrondi Profile]]
- Paulo trabalha entre enterprise tech, side projects, familia e fe.
- Profissionalmente, e TAE na ServiceNow, foco Banco Bradesco / FSI Brasil.
- Estilo esperado: direto, executivo, denso, estruturado, copy-paste ready, sem fluff.
- PT-BR para conteudo Brasil; pushback analitico e bem-vindo.
- Para Now Assist no Bradesco, conectar sempre: modelo operacional -> velocidade de adocao -> expansao de receita.

## Inicio de sessao

- Identificar o `cwd` atual e procurar a nota correspondente em `02_Projects`.
- Ler [[04_Areas/Profile/Paulo Pierrondi Profile]] para entender quem e Paulo, contexto profissional/pessoal, estilo de resposta e prioridades.
- Ler `Home.md`, `02_Projects/Projects Index.md` e a nota do projeto antes de fazer mudancas relevantes.
- Ler `.brain/PROJECT_CONTEXT.md` quando existir no repo.
- Rodar `brain-linear-sync` ou ler [[04_Areas/Coding/Linear/Linear Git Sync Report]] para entender estado Git/local antes de iniciar.
- Para trabalho multi-coder, background coder, automacao, Antigravity ou sessao que precise continuidade, ler [[04_Areas/Coding/Agent Coder Integration OS]] e criar/atualizar handoff em `Hub_Agentes/06_Runtime/handoffs`.
- Para roadmap, bugs, status, prioridade, release ou planejamento, ler [[04_Areas/Coding/Linear/Linear Git Development Tracking OS]] e conferir o projeto/issue no Linear.
- Ler [[04_Areas/Coding/Best Practices/Development Best Practices Hub]] e as melhores praticas relevantes da plataforma.
- Ler [[04_Areas/Coding/Checklists/Project Checklist Hub]] e os checklists relevantes para a plataforma.
- Para app, site, tela, fluxo visual, screenshot ou store submission, ler [[04_Areas/Coding/Best Practices/App Web Quality Best Practices]], [[04_Areas/Coding/Checklists/App Web Preflight Checklist]] e [[04_Areas/Coding/Checklists/Screenshots Visual QA Checklist]].
- Para iOS, Android ou web app, ler tambem o preflight especifico da plataforma.
- Para iOS/App Store Connect/TestFlight/signing/IAP/APNS, ler [[04_Areas/Coding/Checklists/Apple Developer And App Store Connect Inventory]] e [[04_Areas/Coding/Checklists/App Store Connect Upload Runbook]] antes de pedir IDs, chaves, configurar CI ou fazer upload.
- Para produto, monetizacao, novas ideias de app, receita, pricing, growth ou priorizacao de side projects, ler [[04_Areas/Product/Product Revenue MOC]], [[04_Areas/Product/Nightly Opportunity Engine]], [[04_Areas/Product/App Ideas Revenue Backlog]], [[04_Areas/Product/App Refinement Backlog]] e [[04_Areas/Product/Nightly Opportunity Report]].
- Para criativos, videos, social, campanhas, ElevenLabs, legendas ou pierrondi.dev, ler [[04_Areas/Marketing/Marketing MOC]], [[04_Areas/Marketing/Pierrondi.dev Creative Video OS]], [[04_Areas/Marketing/ElevenLabs Voice And Subtitle Workflow]], [[04_Areas/Marketing/Social Video Platform Specs 2026]] e [[04_Areas/Marketing/Creative QA Checklist]].
- Para Apple Ads / ASA, App Store paid acquisition, ASO, CPP, campanhas pagas ou tuning de marketing de apps, ler [[04_Areas/Marketing/App Marketing Intelligence OS]], [[04_Areas/Marketing/Apple Ads ASA Tuning Runbook]], [[04_Areas/Marketing/App Marketing Metrics Inventory]], [[04_Areas/Marketing/App Marketing Daily Tuning Report]] e [[04_Areas/Marketing/App Marketing Tuning Backlog]].
- Para melhorar o proprio vault, memoria de agentes, Obsidian, MOCs ou rotinas, ler [[04_Areas/Second Brain/Second Brain Intelligence Loop]], [[99_System/Second Brain Intelligence Report]], [[99_System/Claude Code Nightly Second Brain Routine]] e [[04_Areas/Second Brain/External Source Watchlist]].
- Para qualquer automacao, rotina, job agendado, cron, LaunchAgent, cloud runner ou follow-up automatico, ler [[99_System/Automation Email Policy]] e enviar email de encerramento para `pierrondi@gmail.com`.
- Ler [[04_Areas/Coding/Checklists/Security Checklist]] antes de auth, dados, APIs, deploy ou IA.
- Ler [[99_System/Security And Secrets Policy]] antes de lidar com API keys, tokens, env vars ou credenciais.
- Para credenciais, tratar [[99_System/Credential Vault Operating Model]] como fonte canonica: o vault guarda inventario/referencia, nunca valor real.
- Para env vars em files locais e automacoes, ler [[99_System/Central Env File Operating Model]]: `/Users/paulopierrondi/Projects/.keys.env` (chmod 600, gitignored) e a fonte unica local, carregada via `brain-env-run -- <comando>`; `./.env` do projeto sobrescreve. Nunca `source .env` ou `python-dotenv` cru em scripts novos.
- Se a credencial estiver no escopo de [[99_System/Secret Exposure Incident - 2026-05-19]], exigir rotacao antes de uso e usar `/Users/paulopierrondi/.loc
...[truncated]

## 99_System/Prompt Caching Workflow Policy.md

---
type: policy
status: active
created: 2026-05-22
tags:
  - automation
  - agents
  - prompt-caching
  - cost-control
  - ai-runtime
---
# Prompt Caching Workflow Policy

## Rule

All recurring, high-token, multi-agent or production-adjacent AI workflows must be cache-aware.

The required prompt shape is:

```text
CACHEABLE_PREFIX_START
stable operating contract
stable agent / workflow policy
stable project context
stable quality gates
stable output schema
CACHEABLE_PREFIX_END

DYNAMIC_TASK_START
current date, live state, user request, diffs, logs, search results, blockers
DYNAMIC_TASK_END
```

Static context goes first. Dynamic context goes last. Do not mix timestamps, live status, search results, diffs, log tails or user-specific deltas into the cacheable prefix.

## Cacheable Prefix Order

Use this order whenever a workflow builds a prompt, handoff, CLI request or API call:

1. System role and non-negotiable safety rules.
2. Agent Hub enforcement and human gates.
3. Paulo profile, response style and operating preferences.
4. Runtime/provider routing policy.
5. Project static context: `AGENTS.md`, `CLAUDE.md`, `KIMI.md`, `GEMINI.md`, `CODEX_RULES.md`, `.brain/PROJECT_CONTEXT.md`.
6. Reusable checklists, quality gates, App Store rules, security policy and output contracts.
7. Tool schemas or structured output schema.
8. Dynamic task delta only after `CACHEABLE_PREFIX_END`.

## Never Cache

Do not include these in cacheable prefixes:

- API keys, tokens, cookies, private keys, `.env` values, session exports or credential screenshots.
- Current date/time, git dirty lists, live Linear issue bodies, App Store live status, provider dashboard state, web search results, logs, diffs or stack traces.
- Personal data or private note content that is not required by the workflow.
- Anything marked `ROTATE_REQUIRED`.

Secrets must stay in provider env vars, Keychain, 1Password when available, or approved secret-intake flows. The vault stores references and metadata only.

## Provider Mapping

| Provider / surface | Cache mechanism | Required workflow behavior |
| --- | --- | --- |
| OpenAI / Codex / OpenAI API | Automatic prompt caching for exact repeated prefixes on eligible long prompts; optional `prompt_cache_key`; optional `prompt_cache_retention`; usage exposes `cached_tokens` | Keep identical static prefix, put dynamic task last, use a stable `prompt_cache_key` when direct API calls share a prefix, and log `cached_tokens` when surfaced. |
| Anthropic / Claude API | Automatic or explicit `cache_control` breakpoints; default 5 minute TTL; optional 1 hour TTL; tool definitions can be cached | Put `cache_control` on the last stable block, not on timestamp or task delta. Keep stable tools/system/messages ordered; use deferred tools where available to avoid invalidating the prefix. |
| Gemini API | Implicit caching on supported models plus explicit cached content objects for guaranteed savings; usage metadata exposes cached token counts | Create/reuse cached content for stable docs; send only task delta as fresh prompt when direct API supports it. Put large common content at the beginning for implicit cache hits. |
| Kimi / Moonshot API | Context Caching with cache tags and `role=cache` references | Cache stable files/context with a workflow tag; pass `role=cache` reference plus task delta when direct API supports it. |
| CLI wrappers without direct cache controls | Stable prefix file plus dynamic task file | Keep prefix files byte-stable; pass current task as suffix. Record strategy as `cli-prefix-layout`. |

## Cache Keys

When a workflow can control cache routing or tag names, use a stable key with this shape:

```text
paulo:{workflow_id}:{agent_id}:{project_id}:{policy_version}:{context_version}
```

Do not include dates, branch names that churn daily, live issue titles or secrets in cache keys.

## Required Telemetry

Every recurring workflow report, run note or email must include a redacted prompt-cache block:

```yaml
prompt_cache:
  policy: "/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md"
  strategy: "openai-auto | anthropic-cache-control | gemini-cached-content | kimi-context-cache | cli-prefix-layout | not-supported"
  cache_key_or_tag: "redacted-or-nonsecret"
  prefix_version: "YYYY-MM-DD-or-hash"
  prefix_hash_recorded: true
  cached_tokens: null
  input_tokens: null
  output_tokens: null
  cache_hit_rate: null
  notes: "metrics unavailable in this CLI" 
```

If a CLI does not expose token telemetry, record `null` and explain the strategy used. Absence of telemetry is a workflow quality issue, not a blocker for urgent execution.

## Tool And Schema Hygiene

Provider docs agree that cache invalidation is usually caused by changing the prefix. For agent workflows:

- Keep always-needed tools and structured output schemas stable.
- Put optional or discovered tools after the cacheable prefix when the runtime supports deferred tool loading.
- Do not toggle web search
...[truncated]

## 99_System/Chat Context 60 Percent Guard.md

---
type: policy
status: active
updated: 2026-05-25
tags: [ai-agents, context, continuity, handoff, prompt-caching]
---

# Chat Context 60 Percent Guard

## Regra

Nenhum chat operacional deve passar de 60% de contexto sem checkpoint. Aos 60%, o agente para de expandir escopo, grava um resume pack e recomenda continuar em uma nova conversa.

## Por que

- Contexto cheio aumenta perda de detalhes, alucinacao de estado e esquecimento de gates.
- Compactacao automatica ajuda, mas nao substitui um resumo controlado com evidencias.
- O objetivo e preservar continuidade: decisoes, arquivos, comandos, riscos e proxima acao.

## Thresholds

| Contexto | Acao |
| --- | --- |
| 0-40% | Trabalhar normal, registrar decisoes relevantes no vault. |
| 40-50% | Criar checkpoint leve se a tarefa tiver mais de uma etapa. |
| 50-55% | Criar checkpoint obrigatorio antes de novas edicoes grandes. |
| 55-60% | Fechar unidade de trabalho atual, validar, escrever resume pack. |
| >=60% | Nao iniciar nova frente; abrir novo chat com o resume prompt. |

## Gatilhos sem medidor

Se a UI ou CLI nao mostrar percentual, usar estes gatilhos:

- Mais de 30 minutos de trabalho com terminal/patch.
- Mais de 3 arquivos alterados.
- Mais de 10 tool calls relevantes.
- Primeiro erro de validacao que exige investigacao longa.
- Mudanca de fase: diagnostico -> patch, patch -> validacao, validacao -> release/handoff.
- Qualquer trabalho envolvendo automacao, multi-agent, Linear, App Store, ads, deploy, secrets ou producao.

## Comandos

```bash
chat-context-guard doctor
chat-context-guard checkpoint --title "nome" --project "projeto" --context-percent 55 --summary "estado atual" --next "proxima acao"
chat-context-guard protocol
```

## Resume Pack minimo

Todo checkpoint precisa conter:

- Objetivo original.
- Estado atual.
- Decisoes tomadas.
- Arquivos tocados.
- Comandos/testes rodados.
- Riscos e bloqueios.
- Proxima acao exata.
- Prompt de retomada para novo chat.

## Frase padrao para o Paulo

Quando quiser preservar contexto, escreva:

> checkpoint 60: gere resume pack, salve no vault e me diga o prompt exato para abrir novo chat

## Regra para agentes

Ao perceber contexto perto de 55%, o agente deve dizer explicitamente: `Contexto perto do limite. Vou gerar checkpoint antes de continuar.`

Ao passar de 60%, o agente deve parar de iniciar novas tarefas e produzir apenas o resume pack.

## Prompt Cache

- strategy: `stable-context-prefix-dynamic-task-suffix`
- prefix_version: `chat-context-60-guard-v1`
- cache key/tag por checkpoint: `chat-context:<checkpoint_id>`
- cached_tokens: `null` quando o CLI nao expuser metrica.
- policy: `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md`

## 99_System/Central Env File Operating Model.md

---
type: policy
status: active
tags:
  - security
  - secrets
  - env
  - automation
  - second-brain
---
# Central Env File Operating Model

## Answer First

`/Users/paulopierrondi/Projects/.keys.env` e a **fonte unica** de variaveis de ambiente para todos os files do vault e automacoes locais de Paulo. O carregamento e feito por `/Users/paulopierrondi/.local/bin/brain-env-run`.

O vault continua **inventario** ([[99_System/Credential Vault Operating Model]]), o `.env` central continua **runtime local**, e provider env vars (Railway, Vercel, GitHub Actions) continuam **producao**. Nenhum dos tres armazena o mesmo papel.

## Precedence (last wins)

```text
1. shell environment (variaveis ja exportadas no shell)
2. /Users/paulopierrondi/Projects/.keys.env       <- central, fonte unica
3. ./.env in cwd                              <- project override quando existe
```

Se a mesma variavel aparece em mais de um local, o ultimo a ser carregado vence. Projetos com necessidade especifica (ex: `DATABASE_URL` diferente por app) sobrescrevem via `.env` local do projeto.

## Permitido no arquivo central

- Variaveis compartilhadas entre projetos (`OPENAI_API_KEY`, `GEMINI_API_KEY`, `ELEVENLABS_API_KEY`, `LINEAR_API_KEY`, `GITHUB_PAT`, `VERCEL_TOKEN`, `RAILWAY_*_TOKEN`, `ASC_KEY_ID`, `ASC_ISSUER_ID`, `APPLE_DEVELOPER_TEAM_ID`, `AGENT_HUB_SLACK_WEBHOOK_URL`, `SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN`, `AGENT_HUB_SLACK_CHANNEL`).
- Defaults locais validos para dev (nao para producao).
- Comentarios marcando grupo (`# === AI image ===`).

## Proibido no arquivo central

- Valores de producao que devam viver em Railway/Vercel/GitHub Actions Secrets.
- Conteudo de `.p8`, `.pem`, `.key`, `.p12` (esses arquivos continuam em disco, paths absolutos).
- Cookies de sessao, refresh tokens curtos, OAuth state.
- Senhas de usuario humano (continuam em Apple Passwords / 1Password).
- Qualquer key marcada `ROTATE_REQUIRED` em [[04_Areas/Coding/Checklists/Secrets And API Keys Register]] antes da rotacao.

## File hygiene

- `chmod 600` obrigatorio. `brain-env-run` avisa se a permissao for diferente.
- Nunca commitar. `/Users/paulopierrondi/Projects/.gitignore` protege caso `Projects/` vire repo.
- Nunca abrir em chat, Markdown do vault, Linear, screenshot, log de automacao ou email. Hard gate da [[99_System/Security And Secrets Policy]].
- Rotacao: a cada 90 dias ou apos incidente. Atualizar `Secrets And API Keys Register` na mesma operacao.
- Backups: nao copiar para iCloud Drive, Dropbox, Google Drive, Obsidian Sync. Se backup local for necessario, copiar para volume cifrado e apagar apos restore.

## Como usar via `brain-env-run`

```bash
# Rodar um comando com o env central + override local aplicados:
brain-env-run -- npm run dev
brain-env-run -- python3 scripts/factory.py

# Listar nomes de variaveis definidas (sem mostrar valores):
brain-env-run list

# Diagnostico de permissoes/keys:
brain-env-run check

# Exportar variaveis especificas para o shell corrente (uso pontual):
eval "$(brain-env-run export -- OPENAI_API_KEY GEMINI_API_KEY)"
```

Override do path central para casos especiais (ex: testes isolados):

```bash
BRAIN_CENTRAL_ENV=/tmp/test.env brain-env-run -- pytest
```

## Relacao com os outros wrappers

| Wrapper | Quando usar | Fonte do valor |
| --- | --- | --- |
| `brain-env-run` | Default para qualquer script/automacao local que precise das variaveis globais ou do override por projeto. | `/Users/paulopierrondi/Projects/.keys.env` + `./.env`. |
| `brain-load-secrets` | Quando o valor durable vive **so** no Apple Keychain (caso ainda nao migrado para o `.env` central) ou para regerar/sincronizar o `.env` a partir do Keychain. | Apple Keychain (`paulo-second-brain` namespace). |
| `brain-railway-run` | Quando o valor real vive em Railway Variables e o script roda dentro de um repo linkado. | Railway Provider env vars. |
| `op run` (futuro) | Apos migrar para 1Password CLI multi-machine. | 1Password vault (`op://...`). |

`brain-env-run` e `brain-load-secrets` sao composables: para regenerar o `.env` central a partir do Keychain, usar a recipe abaixo.

## Recipes operacionais

### Regerar `.env` central a partir do Apple Keychain

```bash
# Backup do .env atual:
cp /Users/paulopierrondi/Projects/.keys.env /Users/paulopierrondi/Projects/.keys.env.bak.$(date +%Y%m%d-%H%M%S)
chmod 600 /Users/paulopierrondi/Projects/.keys.env.bak.*

# Escrever as keys presentes do Keychain para o .env central (sem ecoar valores no terminal):
{
  cat /Users/paulopierrondi/Projects/.keys.env | grep -E '^[[:space:]]*#' # preserva comentarios
  echo ""
  brain-load-secrets --all export
} > /tmp/.env.new
chmod 600 /tmp/.env.new
mv /tmp/.env.new /Users/paulopierrondi/Projects/.keys.env
chmod 600 /Users/paulopierrondi/Projects/.keys.env

# Conferencia (so nomes):
brain-env-run list
```

Apagar o backup quando confirmar que o novo arquivo funciona em pelo menos um script (`brain-env-run -- python3 -c 'import os; print(bool(os.environ.get("OPENAI_API_KEY
...[truncated]

## 99_System/Session Journal Continuity Policy.md

---
type: policy
status: active
created: 2026-05-25
tags: [ai-agents, continuity, session-journal, handoff, vault]
---

# Session Journal Continuity Policy

## Regra

Todo trabalho operacional de coder deve deixar rastros incrementais no vault. Handoff final continua obrigatorio, mas nao pode ser o unico ponto de persistencia.

## Objetivo

Se a internet cair, o app fechar, o chat sumir ou o coder nao fizer handoff final, o Paulo ainda precisa conseguir recuperar:

- o objetivo da sessao;
- o que ja foi feito;
- arquivos tocados;
- comandos/testes rodados;
- riscos e blockers;
- proxima acao exata;
- prompt de retomada.

## Ferramenta

```bash
session-journal start --surface Codex --cwd "$PWD" --summary "inicio"
session-journal heartbeat --surface Codex --cwd "$PWD" --summary "estado" --done "..." --next "..."
session-journal close --surface Codex --cwd "$PWD" --summary "fechamento"
session-journal recover
session-journal doctor
```

O arquivo canonico fica em:

`/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/06_Runtime/session_journal/YYYY-MM-DD/<session_id>.md`

## Cadencia obrigatoria

- Start: no primeiro preflight ou antes da primeira edicao.
- Heartbeat: a cada 10 minutos de trabalho ativo.
- Heartbeat: depois de qualquer patch relevante.
- Heartbeat: depois de falha de teste/build/validacao.
- Heartbeat: antes de qualquer human gate.
- Heartbeat: ao chegar em 50-55% de contexto.
- Close: antes da resposta final ou handoff.

## Enforcement

- `agent-preflight.py` escreve um evento `preflight` automaticamente no session journal.
- Se o journal nao puder ser escrito em trabalho com `workspace_write` ou risco maior, o preflight deve falhar.
- Contextos globais dos coders devem carregar `SESSION_JOURNAL_GUARD_START`.

## Handoff vs Journal

- Session journal e caixa preta incremental.
- Handoff e fechamento sintetico.
- Se houver os dois, o handoff aponta para o journal.
- Se nao houver handoff, o journal e a fonte de recuperacao.

## Secrets

Nunca escrever valores reais de secrets, tokens, API keys, cookies, OAuth, senhas ou private keys. O journal redige padroes comuns, mas o agente continua responsavel por nao incluir segredo.

## Prompt Cache

- strategy: `stable-context-prefix-dynamic-task-suffix`
- prefix_version: `session-journal-v1`
- cache_key_or_tag: `session-journal:<session_id>`
- cached_tokens: `null` quando o CLI nao expuser metrica.
- policy: `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md`

## 99_System/Multi-LLM Auto-Improvement Routing Policy.md

---
type: policy
status: active
created: 2026-05-27
source_artifact: /Users/paulopierrondi/Downloads/Kimi_Agent_Prompt for Auto-Improving Agents.zip
tags:
  - ai-agents
  - multi-llm
  - routing
  - auto-improvement
  - agent-hub
---
# Multi-LLM Auto-Improvement Routing Policy

This policy installs the usable part of the Kimi Swarm Auto-Improve prompt across Codex, Claude Code, Gemini CLI and Kimi CLI while preserving Paulo's existing Agent Hub contract.

## Non-Negotiable Correction

No LLM CLI is the central orchestrator. Agent Hub remains the source of truth for registry, scheduler, handoffs, state, health and human gates.

Codex, Claude Code, Gemini and Kimi may classify, recommend, validate and log routing decisions, but they must not bypass Agent Hub preflight, human gates, security policy, Linear policy, session journal or Obsidian durable records.

## Tier Model

Use three execution tiers for every meaningful task.

| Tier | Name | Default Use | Examples |
| --- | --- | --- | --- |
| T1 | ECONOMICO | Fast, low-risk, repeatable work | summaries, formatting, initial triage, health checks, known-pattern docs |
| T2 | BALANCEADO | Medium complexity or multi-system work | code review, integration planning, MCP/API work, handoffs, focused debugging |
| T3 | PREMIUM | High-risk, irreversible or expensive-error work | production, deploys, secrets, App Store, paid ads, architecture, compliance, destructive migrations |

## ASI-Evolve / Evaluator-Driven Evolution

ASI-Evolve-style runs are routed as evaluator-driven lab work, not autonomous production execution.

- First execution of any new evolution pattern is `PREMIUM`.
- Prompt/policy/global-agent-contract evolution is `PREMIUM` until the evaluator and promotion path are proven.
- Report-only analysis of ASI-Evolve or run-spec drafting can be `BALANCEADO`.
- Deterministic sandbox runs on copied fixtures can downgrade to `BALANCEADO` after three clean runs with validation.
- Any run touching production, secrets, deploy, App Store/TestFlight, paid ads, Git push/merge or bulk Linear stays `PREMIUM` and human-gated.

Canonical operating note: [[99_System/ASI-Evolve Safe Evolution Lab]].

## Automatic Classification

Classify as `PREMIUM` if any condition applies:

- Production, deploy, paid ads, App Store/TestFlight, user data, financial impact or reputation risk.
- Secrets, credentials, env vars, provider config or production settings.
- Compliance, privacy, GDPR/LGPD, App Store policy or security-sensitive behavior.
- Irreversible architecture decision or first execution of a new operational pattern.
- User explicitly asks for final validation, maximum quality or "faz direito".

Classify as `ECONOMICO` only when all conditions apply:

- Pattern is known and previously successful.
- No production, sensitive data, external mutation, secrets or human-gated operation.
- Result is easy to review later.
- Tool use is simple and bounded.

Otherwise classify as `BALANCEADO`.

## Canonical LLM Routing

| Surface | Primary Role | Tier Bias |
| --- | --- | --- |
| Codex | Patch, local integration, tests, technical closure | T2/T3 for code changes |
| Claude Code | Architecture, compliance, security, iOS/App Store/release risk | T3 for high-risk reasoning; automated Claude must not use Sonnet |
| Claude Linear Swarm | Multiple independent Linear issues in one repo, isolated by Git worktree | T2/T3 bounded execution; local commits only, no push/merge |
| Kimi CLI | Broad research, portfolio scans, backlog triage, report-only sweeps | T1/T2, report-only unless explicitly approved |
| Qwen-local / Qwen Code | Private local synthesis, high-volume draft/scaffold, isolated prototypes and large-context Qwen coding drafts; Codex reviews before integration | T0/T1/T2 draft-first; no secrets printed; no production/release/push without gate |
| Gemini CLI | Independent validation, MCP/terminal checks, second opinion | T2/T3 validation |
| Google Antigravity | Browser, visual QA, screenshots, worktree and artifacts | T2 validation surface |

## Parallel Coder Concurrency

Complex work should fan out only when subtasks are independent and a single coordinator can join the result. The canonical config is:

`/Users/paulopierrondi/agents-hub/configs/coder_concurrency.yaml`

Defaults:

| Limit | Value |
| --- | ---: |
| Global soft cap | 6 |
| Global hard cap | 16 |
| Write soft cap | 2 |
| Write hard cap | 3 |
| Per-repo write cap | 1 |
| Premium hard cap | 2 |
| kimi_cli soft/hard | 12 / 24 |
| kimi_agent_swarm soft/hard | 16 / 32 |
| Research swarm soft/hard | 16 / 32 |

Rules:

- `16`/`32` are burst hard caps, not defaults — but Kimi is intentionally loose: **Kimi sem economia** (cheap report-only; spawn freely, the limit is CPU/RAM not cost).
- One writer per repo unless isolated worktrees are explicitly declared.
- `claude-linear-swarm <ids>` is the canonical isolated-worktree exception for multiple independent Linear issues in one repo; it creates `.swarm/worktrees/<issue>` and
...[truncated]

## 04_Areas/Coding/Linear/Linear Git Development Tracking OS.md

---
type: "coding-note"
status: "indexed"
normalized_on: "2026-05-20"
tags:
  - coding
  - frontmatter-normalized
---
# Linear App + Git Development Tracking OS

Status: active
Owner: Paulo
Updated: 2026-05-16

This is the operating system for keeping the Linear app, Git and the Obsidian second brain aligned. `brain-linear-sync` is useful, but it is not the source of truth for Linear. The Linear app connector is the source of truth for projects, issues, cycles/sprints, statuses, labels, assignees, comments and project updates.

## Sources Of Truth

- Code and local state: Git repositories.
- Product/development queue: Linear app workspace `Agentcore`.
- Durable memory: Obsidian project notes, AI history and `.brain/PROJECT_CONTEXT.md`.
- Local machine report: [[04_Areas/Coding/Linear/Linear Git Sync Report]] generated by `brain-linear-sync`; this is only Git metadata + mapping hints.
- Live Linear objects: read through the Linear app connector before planning, status, sprint/cycle or cleanup decisions.
- Linear mapping notes: [[04_Areas/Coding/Linear/Linear Project Map]].
- Cleanup queue: [[04_Areas/Coding/Linear/Linear Cleanup Backlog]].

## Required Start Gate

Before planning or coding in any project:

1. Run `brain-linear-sync` or read the latest [[04_Areas/Coding/Linear/Linear Git Sync Report]] for local Git state only.
2. Read the matching project note from [[02_Projects/Projects Index]].
3. Read matching AI history under [[03_AI-Chats/AI Chats Index]] when relevant.
4. Use the Linear app connector to read the live Linear project/issue whenever the task is roadmap, bug, status, scope, priority, release, sprint/cycle, automation, product planning or backlog cleanup related.
5. For a normal coding chat, identify the likely Linear issue before edits. If no issue exists and the task is more than a tiny one-off, create or propose a Linear issue instead of letting work disappear into chat history.
6. Check branch, dirty files, ahead/behind state, live Linear status, cycle/sprint and assignee before editing.
7. Record the Slack/outbox mission and Vault/handoff destination for any work that will continue beyond a trivial answer.

## Operational Regression Rule - 2026-06-17

Paulo escalated that Linear, Slack, Vault and preflight have been drifting out of
some coder flows. Treat this as a standing regression guard:

- A durable project must have a Linear project or issue backlog before work is
  allowed to become substantial.
- If no Linear project/issue exists and identity is clear, create it through the
  Linear connector; if identity is not clear, create/propose a review item under
  the relevant operational project.
- Every finish summary must say whether Linear was updated, commented, left as a
  proposal, or intentionally skipped because the task was trivial.
- Weekly hygiene must verify open actions, stale statuses, closure/replan needs,
  Slack/outbox visibility and Vault updates. Twice-weekly reinforcement is
  preferred for coder/runtime surfaces.
- Do not do bulk destructive Linear cleanup without Paulo's explicit approval.

## Required Finish Gate

After meaningful work:

- Update the Obsidian project note with decisions, commands, files changed, risks, deploy state and next steps.
- Update the Linear issue when issue reality changed: status, assignee, priority, labels, cycle/sprint, blocker, evidence or completion state.
- Add a Linear comment/status summary when work produced meaningful evidence but should not change status yet.
- Re-check open actions and explicitly state whether anything needs closing, replanning or a new issue.
- Keep Linear issue links in the project note when a task is driven by Linear.
- Store no secrets in Linear or Obsidian. Secret values stay in providers or secret managers.
- If the work creates reusable practice, add it to [[04_Areas/Coding/Best Practices/Learning Inbox]].

## Linear Connector Rules

- Use the Linear app connector for live reads: projects, issues, cycles/sprints, labels, statuses, assignees, comments and project status updates.
- Do not treat [[04_Areas/Coding/Linear/Linear Git Sync Report]] as a substitute for live Linear. It only says which repos look mapped or unmapped from local metadata.
- Every new chat that performs coding/project work must either attach itself to an existing Linear issue/project or explicitly record why no Linear update is appropriate.
- Do not bulk-close, archive, delete, relabel or assign without an explicit cleanup step.
- Automation can generate cleanup proposals, not destructive changes.
- Treat old `Done` issues with missing labels/assignees as cleanup candidates, not coding blockers.
- Treat `In Progress` issues with stale Git repos as daily-priority candidates.
- Treat cycles/sprints as planning data: read current/next cycles before moving work into or out of sprint scope.

## Daily Sync Output

Daily sync should produce:

- Git repo health: dirty/ahead/behind/stale/unmapped.
- Linear app health: active projects, curren
...[truncated]

## 04_Areas/Coding/Linear/Linear Project Map.md

---
type: "coding-note"
status: "indexed"
normalized_on: "2026-05-20"
tags:
  - coding
  - frontmatter-normalized
---
# Linear Project Map

Updated: 2026-06-06

This map links Linear projects to local repos and Obsidian project notes. It is mapping metadata only.

Important: this note is not the Linear source of truth. Always verify live projects/issues/cycles through the Linear app connector before updating status, scope, sprint/cycle, labels or assignees.

## Mapping Verification - 2026-06-18

Weekly runtime-enforcement review refreshed live Linear and the current bounded backlog is now clearer than the older project narrative.

- Project `Second Brain Operating System` still reads `In Progress`, but its latest project status update is still the stale `atRisk` update from `2026-05-25`.
- `AGE-1668` is now the active runtime-enforcement tracker: `In Progress`, due `2026-06-17`.
- `AGE-1469`, `AGE-1470`, `AGE-1471`, `AGE-1472` and `AGE-1473` are all `Done` and should not be reused as if they were still open.
- Current backlog should be interpreted through `AGE-1668` plus local evidence:
  - coder runtime bond audit still shows `29` Codex automation TOML gaps
  - `6` `workspace_write` LaunchAgent contract/task gaps
  - `2` Gemini invalid slugs
- Remaining local repo-mapping debt is still upkeep/proposal work, not unfinished `AGE-1471`, unless Paulo explicitly opens a fresh tracker.

## Mapping Verification - 2026-06-15

`brain-linear-sync` refreshed at `2026-06-15 03:33:39` and reports `55` local repos, `54` repos with local changes, `2` ahead, `0` behind and `13` still needing Linear project mapping. Live Linear connector read succeeded read-only for the `Second Brain Operating System` project, its recent project status updates and child issue list/comments. No Linear status, label, assignee, cycle, archive or project metadata was mutated.

Current live `Second Brain Operating System` reality:

- Project remains `In Progress`, target `2026-05-31`, latest project status update still `atRisk` from `2026-05-25`.
- `AGE-1469` is `Done`, completed `2026-06-10`, with follow-on comments on 2026-06-13 about Agent Hub enforcement work.
- `AGE-1470` is `Done`, completed `2026-06-08`.
- `AGE-1471` is `Done`, completed `2026-06-10`.
- `AGE-1472` is `Done`, completed `2026-06-08`.
- `AGE-1473` is also `Done`, completed `2026-06-08`.

Implication:

- Prior weekly-review notes that still described `AGE-1469` to `AGE-1472` as open are now stale and should not drive new close/replan decisions.
- The remaining `13` unmapped repos from the local sync are a fresh upkeep/proposal queue, not unfinished work inside `AGE-1471` unless Paulo explicitly opens a new tracking issue.

| Linear project | Status | Priority | Repo / path hint | Obsidian note hint | Notes |
| --- | --- | --- | --- | --- | --- |
| ServiceNow Implementation OS - Bruno PDI Demo | In Progress | High | vault + PDI + ServiceNow demo artifacts | `ServiceNow Implementation OS` | New live project created `2026-06-04`; immediate queue is `AGE-1628` PDI readiness, `AGE-1629` FSO pack, `AGE-1630` IRM pack, `AGE-1631` demo script and `AGE-1632` rehearsal. `AGE-1627` command center is Done. |
| Itaú NowMobile ServiceNow | Backlog | High | `itau-nowmobile-servicenow` | search Projects Index | New live project from 2026-05-21; repo appears in local sync as `/Users/paulopierrondi/Projects/itau-nowmobile-servicenow` on `codex/AGE-1517-vibe-code-integration` and as `/Users/paulopierrondi/Documents/itau-nowmobile-servicenow` in the project description. |
| nowassistdemo | Planned | High | `nowassistdemo` | search Projects Index | ServiceNow AI demo control plane. Newest project in Linear. |
| Pierrondi.ia - Apple Design Redesign | Backlog | High | `pierrondi-ia` | `pierrondi-ia` | Design-system redesign track for public site and Studio. |
| fifa26bolao - Bolao Express | Backlog | No priority | `fifa2026bolao`, `bolao` | search Projects Index | iOS + Railway backend. Active issues remain in progress/todo. |
| Jarvis Butler Experience | Backlog | No priority | `pierrondi-ia` | `pierrondi-ia` | Butler/chat/voice/dashboard experience inside Marketing OS. |
| ServiceNow Agent Army | In Progress | Urgent | `servicenow-agent-army` | search Projects Index | Community ServiceNow agent product. |
| Pierrondi Marketing OS | In Progress | Urgent | `pierrondi-ia` | `pierrondi-ia` | Core marketing platform and Studio. |
| PPT_Formation | Backlog | High | `ppt_engine`, `ppt` | search Projects Index | Agentic PPTX engine. |
| Fashion Stylist AI | Completed | High | `fashion` | search Projects Index | Completed in Linear, still useful as app pattern source. |
| Faith | Completed | High | `faith`, `faithschool` | `faithschool-web` | Moved to Past Projects after iOS `2.5.2 (64)` was submitted for App Store Review on 2026-05-26. |
| Design System Consistency | Backlog | High | `csdm-validator` | search Projects Index | CSDM visual consistency project. |
| Privacy & Cookie Compliance | Planned | N
...[truncated]

## 99_System/Automation Email Policy.md

---
type: policy
status: active
tags:
  - automation
  - email
  - notification
---
# Automation Email Policy

Regra fixa: toda automacao, independente de rodar em Codex, Claude, Kimi/OpenClaw, Gemini, LaunchAgent local, cloud runner ou script agendado, deve enviar um email de encerramento para `pierrondi@gmail.com`.

## Obrigatorio

- Enviar email ao final de cada run, tanto em sucesso quanto em falha.
- Destinatario padrao unico: `pierrondi@gmail.com`.
- Assunto deve identificar automacao e status.
- Corpo deve incluir:
  - nome/id da automacao;
  - status final;
  - horario;
  - principais mudancas/achados;
  - arquivos/relatorios atualizados;
  - decisoes humanas pendentes;
  - falhas ou bloqueios.
- Redigir segredos antes do envio.

## Transporte Local Padrao

Em automacoes locais no Mac, usar:

```bash
/Users/paulopierrondi/.local/bin/brain-send-automation-email --automation "<id>" --status "<success|failed>" --log "<path>"
```

Para LaunchAgents ou `run.sh`, usar o wrapper/trap:

```bash
/Users/paulopierrondi/.local/bin/brain-run-with-email --automation "<id>" --log "<path>" -- <command>
```

ou:

```bash
source /Users/paulopierrondi/.local/bin/brain-automation-email-trap
brain_automation_email_setup "<id>"
```

## Cloud / Connector Rule

Se a automacao rodar fora do Mac local:

- usar o conector/ferramenta de email disponivel para enviar a `pierrondi@gmail.com`;
- se nao houver transporte de email disponivel, criar um draft em Markdown e registrar `EMAIL_FAILED` em [[99_System/Automation Email Log]];
- a falha de transporte deve aparecer no relatorio final e no vault.

## Guardrails

- Esta regra e a unica excecao padrao a "nao enviar mensagens externas".
- Nao enviar email para terceiros automaticamente.
- Nao anexar `.env`, tokens, API keys, cookies, private keys, credenciais, dumps de banco, PII bruta ou logs sem redacao.
- Nao usar `/usr/bin/mail` direto para Gmail; usar Mail.app/iCloud local quando no Mac.
- Se o email falhar, salvar draft seguro em [[99_System/Automation Email Drafts]].

## 99_System/Credential Vault Operating Model.md

---
type: policy
status: active
tags:
  - security
  - secrets
  - credentials
  - second-brain
---
# Credential Vault Operating Model

## Answer First

O Obsidian pode ser o **cofre operacional** das credenciais, mas nao deve guardar o **valor real** de API keys, tokens, senhas, cookies, private keys ou arquivos `.env`.

Modelo correto:

```text
Obsidian             = indice, inventario, runbook, owner, escopo, rotacao, referencia
/Projects/.keys.env       = fonte unica local para files e automacoes (chmod 600, gitignored)
Apple Keychain       = cofre durable de valores (paulo-second-brain namespace)
1Password (futuro)   = referencias multi-machine via op://...
Provider env vars    = runtime/producao (Railway, Vercel, GitHub Actions)
```

Carregamento canonico em scripts locais: `brain-env-run -- <comando>`. Detalhes operacionais em [[99_System/Central Env File Operating Model]].

## Por que nao guardar segredo real em Markdown

- O Obsidian guarda notas como arquivos Markdown em texto plano no filesystem local.
- Obsidian Sync pode proteger o remote vault, mas o vault local continua legivel para qualquer processo/usuario com acesso ao Mac desbloqueado.
- Plugins, indexadores, backups, search, logs, screenshots e agentes podem acabar lendo o conteudo.
- LLMs e automacoes devem usar referencias e inventario, nao receber valor real.

## Onde guardar o valor real

| Uso | Local recomendado | Motivo |
| --- | --- | --- |
| Variaveis compartilhadas entre projetos locais | `/Users/paulopierrondi/Projects/.keys.env` (chmod 600, gitignored) carregado via `brain-env-run` | Fonte unica para files e automacoes; precedence aceita override por projeto. |
| Override por projeto local | `./.env` no diretorio do projeto | Aplicado apos o central, vence em conflito. |
| Senhas/passkeys pessoais | Apple Passwords / iCloud Keychain ou 1Password | Sync seguro com devices aprovados. |
| API keys de desenvolvimento durable | 1Password Developer / 1Password CLI | Permite `op://...` references e `op run` sem plaintext. |
| Secrets de producao Railway/Vercel/Netlify/Fly/Render | Provider env vars | O runtime injeta sem passar pelo vault. |
| CI/CD | GitHub Actions Secrets ou provider equivalente | Separacao de acesso por repo/env. |
| Cloud enterprise | AWS/GCP/Azure secret manager | IAM, audit, rotacao e least privilege. |
| Fallback local Mac | Apple Keychain via `brain-load-secrets`/`brain-secret-intake` | Bom para credenciais humanas e backing durable do `.env` central. |

## O que o vault deve guardar

Guardar em [[04_Areas/Coding/Checklists/Secrets And API Keys Register]]:

- Nome da env var.
- Provider.
- Projeto/repos que usam.
- Ambiente: local, staging, prod, CI.
- Onde o valor real esta guardado.
- Referencia segura, quando houver, como `op://vault/item/field`.
- Escopo/permissao.
- Owner.
- Data de criacao/rotacao.
- Procedimento de revogacao.
- Evidencia de que `.env.example` existe sem valor real.

## O que o vault nunca deve guardar

- API key real.
- Bearer token, refresh token, session token ou cookie.
- Senha.
- Private key `.p8`, `.pem`, `.key`, `.p12`.
- Service account JSON.
- `.env` completo.
- Screenshot mostrando credenciais.
- Output de CLI que imprima secrets.

## Padrao recomendado para Paulo

### 1. `/Users/paulopierrondi/Projects/.keys.env` como fonte unica local

Carregar com `brain-env-run`:

```bash
brain-env-run -- npm run dev
brain-env-run -- python3 scripts/factory.py
brain-env-run list           # mostra apenas nomes
brain-env-run check          # confirma chmod 600 e contagem de keys
```

Regras: `chmod 600`, gitignored, nunca em Markdown/chat/Linear/email/screenshot. Detalhes em [[99_System/Central Env File Operating Model]].

### 2. Apple Keychain como backing durable do `.env` central

`brain-secret-intake` grava no Keychain; `brain-load-secrets` exporta no shell ou subprocess. Useful para regerar o `.env` central apos rotacao ou em maquina nova. Receita completa em [[99_System/Central Env File Operating Model]].

### 3. 1Password como cofre principal multi-machine (futuro)

Quando `op` estiver instalado:

```bash
export OPENAI_API_KEY="op://Developer/OpenAI/api-key"
op run -- npm run dev
```

Regra: `.env.op` pode guardar referencias `op://...`; `.env.local` com valor real fica local e gitignored.

### 4. Apple Passwords / iCloud Keychain para credenciais humanas

Usar para contas, passkeys, senhas de apps e acesso no iPhone/Mac. Bom para uso humano; nao e o melhor formato para automacoes de coders porque nao tem referencias `op://...` portaveis por repo.

### 5. Provider env vars para producao

Railway/Vercel/GitHub/etc. continuam fonte de runtime. O vault guarda somente:

```text
RAILWAY_PROJECT=x
RAILWAY_SERVICE=y
ENV_VAR_NAME=OPENAI_API_KEY
stored_at=Railway Variables
value=never stored here
```

## Regras para coders

- Default para automacoes locais: `brain-env-run -- <comando>`. Carrega `/Projects/.keys.env` central + override de projeto, sem ecoar valores.
- Nunca pedir que Paulo co
...[truncated]

## 04_Areas/Coding/Best Practices/Development Best Practices Hub.md

---
type: best-practices-hub
tags:
  - best-practices
  - coding
  - learning-loop
---
# Development Best Practices Hub

Este e o hub vivo de melhores praticas de desenvolvimento.

## Como usar

Antes de implementar, revisar ou desenhar arquitetura, escolha os guias relevantes:

- App/Web quality: [[04_Areas/Coding/Best Practices/App Web Quality Best Practices]]
- High-craft frontend visual standard: [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]]
- Guided tour UX: [[04_Areas/Coding/Best Practices/Guided Tour UX Standard]]
- Mobile opening motion: [[04_Areas/Coding/Best Practices/Mobile App Opening Motion Standard]]
- Mobile privacy/consent: [[04_Areas/Coding/Best Practices/Mobile App Privacy Consent Standard]]
- iOS QA/TestFlight closure: [[04_Areas/Coding/Best Practices/iOS Functional QA And TestFlight Closure Standard]]
- Web/Next/React: [[04_Areas/Coding/Best Practices/Web Next React Best Practices]]
- Frontend UI/UX: [[04_Areas/Coding/Best Practices/Frontend UI UX Best Practices]]
- Agent-readable design systems: [[04_Areas/Coding/Best Practices/DESIGN.md Agent Design System Standard]]
- Backend/API: [[04_Areas/Coding/Best Practices/Backend API Best Practices]]
- Database/Data: [[04_Areas/Coding/Best Practices/Database Data Best Practices]]
- Mobile/iOS: [[04_Areas/Coding/Best Practices/Mobile iOS Best Practices]]
- Android: [[04_Areas/Coding/Best Practices/Android App Best Practices]]
- Python/Data tools: [[04_Areas/Coding/Best Practices/Python Data Best Practices]]
- AI/LLM apps: [[04_Areas/Coding/Best Practices/AI LLM Best Practices]]
- DevOps/Railway: [[04_Areas/Coding/Best Practices/DevOps Railway Best Practices]]
- Testing/QA: [[04_Areas/Coding/Best Practices/Testing QA Best Practices]]
- **Cyclomatic complexity (mandatory end-of-activity gate): [[99_System/Cyclomatic Complexity Policy]]**
- Agent workflow: [[04_Areas/Coding/Best Practices/Agent Workflow Best Practices]]
- External engineering skills adoption: [[04_Areas/Coding/Best Practices/Matt Pocock Skills Local Adoption Notes]]
- Security baseline: [[04_Areas/Coding/Checklists/Security Checklist]]
- Authorized security testing / bug bounty engine: [[04_Areas/Coding/Best Practices/Authorized Security Testing Engine]]
- Platform checklists: [[04_Areas/Coding/Checklists/Project Checklist Hub]]

## Como aprender automaticamente

Todo coder deve registrar aprendizados reutilizaveis em:

- [[04_Areas/Coding/Best Practices/Learning Inbox]]
- [[04_Areas/Coding/Best Practices/Patterns To Promote]]

## Padrões recentemente promovidos

- Authorized security testing: gated request harness (default-deny scope, ≤1 req/s, auto-redacted evidence, no active request without human gate), self-evolution loop (outcomes → lessons → behavior, EV-ranked targets), adversarial self-audit of safety tooling. Ver [[04_Areas/Coding/Best Practices/Authorized Security Testing Engine]].

- DESIGN.md local standard: use repo-level `DESIGN.md` for repeated visual work, multi-agent frontend changes, design-system drift and screenshot QA. Promoted from `google-labs-code/design.md` as static template only; no CLI/package install required. Ver [[04_Areas/Coding/Best Practices/DESIGN.md Agent Design System Standard]] and [[06_Templates/DESIGN.md]].
- External skills intake: do not install third-party skill packs globally by default. Promote specific practices into Agent Hub/Vault instead; for `mattpocock/skills`, adopted vertical TDD, red-capable debugging loops, deep-module vocabulary, domain glossary discipline and handoff shape as local guidance only. Ver [[04_Areas/Coding/Best Practices/Matt Pocock Skills Local Adoption Notes]].
- Development QA + Ornith finish gate: qualquer desenvolvimento, bugfix, refactor, automacao de codigo, code review, arquitetura ou regra de agente so fecha depois de testes/checks proporcionais, QA da superficie e segunda passada local com Ornith/Onif quando disponivel (`@ornith`, `ask_ornith`, `delegate provider="ornith"` ou `qwen-code --model ornith-coder:1.0`). Se Ornith/Ollama estiver indisponivel, registrar blocker e risco residual; nao afirmar "totalmente validado". Final/journal/handoff devem listar testes, QA, resultado/blocker Ornith, arquivos e risco.
- Prompt caching e workflow layout: separar prefixo estável de delta dinâmico, registrar `prompt_cache.strategy`, `prefix_version` e telemetria quando houver.
- ASI-Evolve/evaluator-driven evolution: usar apenas como laboratório com `run_spec`, sandbox, timeout, score objetivo, análise por round e proposta de promoção; nunca plugar o pipeline cru em Agent Hub, Vault, Linear, produção ou prompts globais. Ver [[99_System/ASI-Evolve Safe Evolution Lab]].
- CLI/headless orchestration: comandos batch devem ter modo não-interativo explícito; quando o CLI default for TUI, usar flag headless/documentada antes de integrar em automação.
- CLI batch verification: se a ferramenta puder cair para TUI/interactive shell mode, tratar isso como falha do pipeline até provar `--print`/head
...[truncated]

## 04_Areas/Coding/Best Practices/App Web Quality Best Practices.md

---
type: best-practices
platform: app-web-quality
tags:
  - best-practices
  - apps
  - web
  - screenshots
  - quality
---
# App Web Quality Best Practices

## Principio

Qualidade de app/web e uma combinacao de produto, design, estado, performance, acessibilidade, privacy, store readiness e evidencia visual. **Qualidade sempre sobe. Nunca degrada conscientemente.** Cada release, cada tela, cada screenshot, cada copy substituida deve estar igual ou melhor que a versao anterior. Se um deliverable parece pior que o anterior, ou pior que o competidor, e nao-aceitavel; refazer.

## O padrao Paulo

- Construir a experiencia real primeiro.
- Evitar landing generica quando o pedido e app/ferramenta.
- Todo app precisa nascer com identidade publica completa: icone final forte, landing page publica de padrao superior e links legais vivos. Isso e parte do produto, nao acabamento.
- **REGRA FIXA — Logo e favicon:** toda pagina/site/app web deve ter, no minimo:
  1. **Logo no topo** (navbar/header), na maxima qualidade possivel (SVG preferencialmente), nunca placeholder, nunca distorcido, nunca pixelado.
  2. **Favicon decente** em multipla resolucao: `favicon.ico` (16x16, 32x32), `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` (180x180), `android-chrome-192x192.png`, `android-chrome-512x512.png`, mais `site.webmanifest`.
  3. Tags `<link rel="icon">`, `<link rel="apple-touch-icon">` e `<link rel="manifest">` em **todas** as paginas HTML, sem excecao.
  4. O favicon deve ser derivado do logo oficial; nunca favicon generico de framework, nunca inline SVG de baixa resolucao como unico favicon.
  5. Smoke test deve validar favicon.ico e webmanifest acessiveis.
- **REGRA FIXA - Footer publico e paginas de confianca:** toda web, mobile web, PWA, landing publica e app shell acessivel no browser deve ter um footer/top-footer serio como parte do produto, nao como acabamento opcional:
  1. O top-footer deve incluir marca/wordmark, uma frase curta de proposito do produto, seletor ou links de idioma quando o app for bilingue, e navegacao de confianca escaneavel.
  2. Links minimos: About, Mission, How It Works/How To Use, Compliance, Legal, Privacy Policy, Terms of Use, Contact e Support.
  3. Links condicionais obrigatorios quando aplicavel: Cookies, Accessibility, Security, Data Deletion, Refunds/Cancellation, Subscription Terms, Community Guidelines e Status.
  4. Cada pagina publica essencial deve existir em ingles e portugues (`en` e `pt-BR`/`pt`) com roteamento/locale explicito; nao misturar PT/EN por fallback de browser, string hardcoded ou asset antigo.
  5. Contact e Support devem usar alias/formulario do produto ou dominio do app, por exemplo `support@<app-domain>` ou uma chave de configuracao equivalente. Nunca usar email pessoal, telefone, endereco, empregador, dados familiares, localizacao privada ou outros detalhes pessoais do Paulo como fallback publico.
  6. Se o projeto ainda nao tiver alias de suporte, implementar a UI com placeholder/config nao pessoal e registrar a pendencia; nao substituir por dado pessoal.
  7. QA antes de release, review, campanha paga ou launch deve validar links do footer, mobile wrapping, nomes acessiveis, consistencia privacy/terms/compliance e ausencia de dados pessoais.
- App icon nunca pode ser placeholder. Antes de review, TestFlight, launch, deck ou paid campaign, validar o icone dentro do build/app instalado, no asset catalog completo da plataforma e na landing/favicons/OG image.
- Landing page publica nunca pode ser resposta JSON, pagina generica ou placeholder. `GET /` deve entregar HTML responsivo, branded, com proposta de valor clara, visual real do produto, CTA, links de suporte/privacy/terms e metadata social/SEO.
- Interfaces operacionais devem ser claras, densas e rapidas.
- Apps consumer podem ser mais expressivos, mas ainda precisam de fluxo obvio.
- Idioma e contrato de produto: cada app precisa declarar um idioma primario canonico por mercado/release e nenhuma rota/tela deve misturar PT/EN por fallback de browser, string hardcoded ou asset antigo. Apps bilingues precisam de locale explicito, switch claro e QA separada por idioma.
- Todo app mobile deve ter uma pequena animacao de abertura contextual ao dominio do app, antes de privacidade/auth/home, sem parecer splash generico e sem atrasar o uso.
- Em app iOS, modificacao significativa so fecha depois de teste funcional no app instalado e upload do novo build para TestFlight/App Store Connect, salvo excecao explicita.
- Screenshots sao deliverable de primeira classe, nao "depois". Submission, release, post, deck, anuncio ou pagina nova so e "feito" quando os arquivos finais artisticos existem, validados e registrados.
- Privacidade e consentimento tambem sao deliverable de primeira classe. Todo app novo precisa ter tela padrao de primeira abertura, links legais vivos e tracking desligado por padrao antes de qualquer SDK/evento de marketing.
- Toda tela importante precisa lidar com loading, erro, vaz
...[truncated]

## 04_Areas/Coding/Best Practices/Recent App Web Screenshot Learnings.md

---
type: learning-review
area: app-web-quality
tags:
  - screenshots
  - visual-qa
  - apps
  - web
  - learning-loop
---
# Recent App Web Screenshot Learnings

Consolidado das criacoes e artefatos recentes encontrados no workspace.

## Fontes observadas

- `pierrondi-ia/docs/marketing/campaigns/.../buildinpublic-stats-1080x1350.png`
- `ppt_engine/workspace/.../*.preview.png`
- `fashioncore/apps/ios/fastlane/screenshots/en-US/*_1284x2778.png`
- `fifa2026bolao/artifacts/review/*iphone*.png`
- `fifa2026bolao/artifacts/review/*ipad*.png`
- `servicenow-agent-army/marketing/video-*`
- `pierrondi-ia/test-results`
- `pierrondi-ia/tmp/ui-review`

## Aprendizados promovidos

- Screenshot de review/store precisa provar plataforma e tamanho, nao apenas "parece bonito".
- App Store/Google Play pedem conjuntos diferentes de evidencia: phone, tablet/large screen quando aplicavel, idioma, dark/light e ausencia de dados sensiveis.
- Imagens de marketing precisam nascer no formato de destino: feed, story, deck, landing, preview e video nao devem reaproveitar crop por acidente.
- Screenshots de UI precisam capturar estado real: loading, empty, erro, permissao, auth, pagamento, onboarding e sucesso.
- Render preview de deck/documento/site e uma forma de teste visual; se nao renderizou, nao esta pronto.
- `node_modules`, package fixtures e snapshots de dependencias nao contam como evidencia do produto.
- O vault deve registrar paths e decisao de qualidade, nao copiar imagens sensiveis nem inflar a memoria com dumps.

## Regra operacional

Quando um agente mexer em app/web visual:

- usar [[04_Areas/Coding/Checklists/Screenshots Visual QA Checklist]];
- registrar os paths de evidencia na nota do projeto;
- transformar falhas recorrentes em item de checklist;
- nao anexar screenshot com segredo, PII, token, cookie ou ambiente de producao exposto.

## Destinos

- [[04_Areas/Coding/Best Practices/App Web Quality Best Practices]]
- [[04_Areas/Coding/Checklists/App Web Preflight Checklist]]
- [[04_Areas/Coding/Checklists/Screenshots Visual QA Checklist]]

## 04_Areas/Coding/Best Practices/Android App Best Practices.md

---
type: best-practices
platform: android
tags:
  - best-practices
  - android
  - google-play
---
# Android App Best Practices

## Principios

- Android nao e apenas "iOS portado": respeitar back navigation, intents, permissions, density, large screens e lifecycle.
- Estado do usuario deve sobreviver background, rotacao e navegacao.
- Permissoes perigosas precisam ser minimizadas e pedidas no contexto certo.
- Data safety e privacy policy precisam bater com codigo e SDKs.

## UI

- Usar Material 3 quando estiver no stack.
- Touch targets e fontes precisam escalar.
- Layouts devem funcionar em phone, tablet e foldable quando relevante.
- Dark mode precisa ser intencional, nao acidental.

## Arquitetura

- Segredos nunca entram no APK/AAB.
- Offline e rede ruim precisam de estado explicito.
- Background work deve usar APIs apropriadas e respeitar bateria.
- Analytics/crash SDKs devem estar no inventario de privacy.

## Release

- Version code/name atualizados.
- App Bundle com signing correto.
- Store listing honesta.
- Test track antes de producao.
- Data safety atualizado a cada novo SDK/coleta.

## Links

- [[04_Areas/Coding/Checklists/Android App Preflight Checklist]]
- [[04_Areas/Coding/Best Practices/App Web Quality Best Practices]]

## 04_Areas/Coding/Best Practices/Agent Workflow Best Practices.md

---
type: best-practices
platform: agents
tags:
  - best-practices
  - agents
  - codex
  - claude
  - kimi
  - gemini
  - cursor
---
# Agent Workflow Best Practices

## Principios

- Primeiro ler memoria; depois planejar; depois editar.
- Agente nao deve pedir segredo que pode ser acessado via provider/CLI.
- Mudancas devem ser pequenas, verificaveis e registradas.
- Aprendizado reutilizavel deve voltar para o vault.
- Quando houver subagentes, manter ownership claro e nao duplicar o mesmo escopo de escrita.
- Antes de promover um padrao, diferenciar lição madura de caso puntual com dependencias de plataforma.
- Para trabalhos paralelos, cada worker precisa de escopo disjunto, nao pode reverter edits de outros e deve aceitar que a base do codigo nao esta isolada.
- Background Coders ativos sao Codex, Claude Code, Kimi CLI, Gemini CLI e Google Antigravity. Cursor Background Agent fica dormente, salvo ativacao explicita do Paulo.
- `GEMINI.md` deve ficar em paridade operacional com `AGENTS.md`; Gemini CLI usa essa memoria e Antigravity tambem deve conseguir ler `AGENTS.md` + `GEMINI.md`.
- Antigravity deve operar com Project folders explicitos. Se o vault nao estiver no Project, usar `.brain/PROJECT_CONTEXT.md` ou pedir acesso ao vault antes de assumir contexto vivo.
- Qualquer relato de progresso ou gap precisa vir de estado vivo lido nesta sessao; memoria, note antiga e resumo de chat nao bastam.
- Nao alegar verificacao sem evidencia de tool call ou leitura recente na mesma sessao.
- `workspace_write` exige `cwd` contratual com `AGENTS.md` ou `.brain/PROJECT_CONTEXT.md`; `$HOME` e caminhos genericos nao servem.

## Inicio

- Rodar/usar `brain-preflight`.
- Ler `.brain/PROJECT_CONTEXT.md`.
- Ler nota do projeto e AI history.
- Ler best practices e checklists relevantes.
- Confirmar comandos canonicos.
- Para trabalho multi-agent, criar primeiro um mission packet com `agent-mastery intake --goal "..."`; usar `--all-core-coders` quando a intencao for acionar Kimi, Qwen, Codex, Gemini, Antigravity e Claude no mesmo desenho operacional.
- Para background work, confirmar `.brain/BACKGROUND_CODER_CONTEXT.md`, owner (`codex`, `claude`, `kimi`, `gemini` ou `antigravity`), issue/tarefa unica, artefato esperado e stop condition.

## Durante

- Nao deixar chat operacional passar de 60% de contexto sem checkpoint. Em 50-55%, rodar `chat-context-guard checkpoint`; em >=60%, produzir resume pack e continuar em novo chat.
- Manter session journal vivo. Preflight escreve automaticamente, mas coders devem rodar `session-journal heartbeat` a cada 10 minutos de trabalho ativo, depois de patch relevante, falha de teste/build, mudanca de fase, human gate ou contexto em 50-55%.
- Journals e handoffs precisam provar entrega: incluir sempre `Done`, `Evidence` e `Next action`. Se faltar um desses, tratar como `partial`, nunca como concluido.
- Usar a superficie certa antes de chamar outro LLM: `llm-routing-guard route --task "..."` quando houver duvida. Codex integra; Claude resolve risco complexo; Kimi pesquisa/triage; Gemini valida; Antigravity faz browser/visual/worktree; Qwen faz draft isolado.
- Usar a tool certa antes de executar: `tool-usage-guard route --task "..."` quando houver duvida. Obsidian registra memoria duravel; Linear registra realidade viva de produto; Git/GitHub registra codigo/PR/CI; CodeGraph responde estrutura de codigo; Browser/Antigravity prova visual/browser; secrets ficam fora de Markdown/chat/logs.
- Para qualquer desenvolvimento, bugfix, refactor, automacao de codigo, code review, arquitetura ou regra de agente, aplicar o gate QA + Ornith: testes/checks proporcionais, QA da superficie e segunda passada local com Ornith/Onif (`@ornith`, `ask_ornith`, `delegate provider="ornith"` ou `qwen-code --model ornith-coder:1.0`) antes de declarar `done`. Se Ornith/Ollama estiver indisponivel, registrar blocker e risco residual; nao afirmar "totalmente validado".
- Antes de relatar gap, regressao ou falha em producao, ler o arquivo/config atual e anexar a evidencia viva. Handoff, nota antiga e memoria resumida nao bastam como prova do estado atual.
- Preservar mudancas do usuario.
- Evitar refactor fora do escopo.
- Usar ferramentas seguras para secrets: Railway, provider env vars, 1Password/Keychain.
- Nao imprimir env completo.
- Nao pedir a nenhum background coder para operar secrets, deploy, App Store/TestFlight, paid ads, social publishing, migrations de producao ou multi-repo changes sem aprovacao explicita.

## Fim

- Atualizar nota do projeto.
- Atualizar `.brain/SESSION_NOTES.md` se sem vault.
- Registrar aprendizado em [[04_Areas/Coding/Best Practices/Learning Inbox]] quando reutilizavel.
- Sugerir promocao para best practice quando padrao aparecer de novo.
- Se a entrega veio de background coder, registrar owner, handoff aceito/rejeitado e atualizar Linear apenas depois de validação local.

## Aprendizados locais

- Adicionar aqui comportamento que melhorou entregas dos coders.

- 2026-05-21: Cursor Ba
...[truncated]

## 04_Areas/Coding/Checklists/Project Checklist Hub.md

---
type: checklist-hub
tags:
  - checklist
  - coding
  - security
---
# Project Checklist Hub

Este e o hub obrigatorio de checklists para todos os projetos.

## Uso por agentes

Antes de implementar, revisar ou fazer deploy, o agente deve escolher os checklists relevantes:

- Preflight essencial app/web: [[04_Areas/Coding/Checklists/App Web Preflight Checklist]]
- Visual QA/screenshots: [[04_Areas/Coding/Checklists/Screenshots Visual QA Checklist]]
- High-craft frontend/site/portfolio: [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]]
- Frontend: [[04_Areas/Coding/Checklists/Frontend Checklist]]
- Backend/API: [[04_Areas/Coding/Checklists/Backend API Checklist]]
- Web/Next/Node: [[04_Areas/Coding/Checklists/Platform Web Next Node Checklist]]
- Web app quality: [[04_Areas/Coding/Checklists/Web App Preflight Checklist]]
- Mobile/iOS: [[04_Areas/Coding/Checklists/Platform Mobile iOS Checklist]]
- iOS app quality: [[04_Areas/Coding/Checklists/iOS App Preflight Checklist]]
- iOS QA/TestFlight closure: [[04_Areas/Coding/Best Practices/iOS Functional QA And TestFlight Closure Standard]]
- App Store Connect upload: [[04_Areas/Coding/Checklists/App Store Connect Upload Runbook]]
- **🚨 Apple reject resolution (LEITURA OBRIGATÓRIA antes de tocar em qualquer reject):** [[04_Areas/Coding/Checklists/Apple Reject Resolution Audit Checklist]]
- Android app quality: [[04_Areas/Coding/Checklists/Android App Preflight Checklist]]
- Python/Data: [[04_Areas/Coding/Checklists/Platform Python Data Checklist]]
- IA/LLM: [[04_Areas/Coding/Checklists/AI Integrations Checklist]]
- Deploy/Release: [[04_Areas/Coding/Checklists/Release Deploy Checklist]]
- Seguranca: [[04_Areas/Coding/Checklists/Security Checklist]]
- Secrets/API keys: [[04_Areas/Coding/Checklists/Secrets And API Keys Register]]
- Apple/App Store Connect: [[04_Areas/Coding/Checklists/Apple Developer And App Store Connect Inventory]]
- Railway variables: [[04_Areas/Coding/Checklists/Railway Secrets Inventory]]

## Regra dura

O vault guarda inventario, decisoes e referencias. O vault **nao guarda valores reais** de API keys, tokens, senhas, cookies, private keys, refresh tokens ou credenciais de producao.

## Start gate para qualquer projeto

- [ ] Identificar plataforma: web, mobile, backend, IA, data, infra.
- [ ] Abrir nota do projeto em `02_Projects`.
- [ ] Abrir `.brain/PROJECT_CONTEXT.md` quando existir.
- [ ] Rodar `brain-linear-sync` ou ler [[04_Areas/Coding/Linear/Linear Git Sync Report]] para estado Git/local.
- [ ] Para roadmap, bug, status, prioridade, release, sprint/cycle, automacao ou backlog cleanup, ler o projeto/issue vivo no Linear via conector quando disponivel.
- [ ] Selecionar checklists relevantes deste hub.
- [ ] Para app, site, tela, fluxo visual ou store submission, abrir [[04_Areas/Coding/Checklists/App Web Preflight Checklist]].
- [ ] Para portfolio, landing premium, hero, animacao ou referencia visual, abrir [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]].
- [ ] Para mudanca visual, planejar screenshots com [[04_Areas/Coding/Checklists/Screenshots Visual QA Checklist]].
- [ ] Verificar riscos e decisoes antigas.
- [ ] Confirmar onde secrets reais devem ficar.
- [ ] Para iOS/App Store, abrir o inventario Apple antes de pedir IDs ou chaves.
- [ ] Para mudanca iOS significativa, planejar QA funcional instalada e upload TestFlight no fechamento.
- [ ] Definir comandos de lint, test e build.

## Finish gate para qualquer projeto

- [ ] Atualizar nota do projeto.
- [ ] Atualizar Linear quando a realidade da issue/projeto mudou; se nao for apropriado alterar status, registrar proposta clara em [[04_Areas/Coding/Linear/Linear Cleanup Backlog]] ou na nota do projeto.
- [ ] Nao fechar, arquivar, relabelar, reatribuir ou mover issues em massa sem proposta e aprovacao explicita.
- [ ] Atualizar inventario de env vars/secrets sem valores reais.
- [ ] Atualizar inventario Apple quando houver mudanca de Issuer ID, Team ID, Key ID, APNS, IAP ou signing.
- [ ] Registrar comandos rodados.
- [ ] Para iOS significativo, registrar TestFlight build/version/status ou excecao explicita.
- [ ] Registrar paths dos screenshots relevantes ou motivo de nao capturar.
- [ ] Registrar riscos, decisoes e proximos passos.
- [ ] Confirmar que nenhum segredo foi escrito em Markdown, logs, commits ou screenshots.
- [ ] Se isto foi automacao/rotina/job/cloud runner, enviar email final para `pierrondi@gmail.com` conforme [[99_System/Automation Email Policy]].

## Referencias externas

- Apple HIG: https://developer.apple.com/design/human-interface-guidelines
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Android Core App Quality: https://developer.android.com/docs/quality-guidelines/core-app-quality
- Android technical quality: https://developer.android.com/quality/technical
- Google Play Developer Program Policy: https://support.google.com/googleplay/android-developer/answer/16933379
- Web V
...[truncated]

## 04_Areas/Coding/Checklists/App Web Preflight Checklist.md

---
type: preflight-checklist
area: app-web-quality
tags:
  - preflight
  - apps
  - web
  - ios
  - android
  - quality
---
# App Web Preflight Checklist

Este e o preflight mais importante antes de criar, alterar ou revisar qualquer app, web app, site, tela, fluxo, release, screenshot ou submission.

## 0. Classificar o trabalho

- [ ] Tipo: web app, site, iOS, Android, cross-platform, backend-for-frontend, landing, dashboard, game, marketing page.
- [ ] Plataforma alvo primaria definida.
- [ ] Plataforma secundaria definida.
- [ ] Usuario alvo e momento de uso definidos.
- [ ] Fluxo principal em uma frase.
- [ ] Risco principal: design, dados, auth, pagamento, store review, performance, privacy, AI, deploy.

## 0.1 Regra maxima de ads tracking

> Todo app novo ou em uso precisa ter tracking de aquisicao e performance de ads como requisito de produto, nao como tarefa de marketing posterior.

- [ ] Mobile app: TikTok App Events SDK ou MMP equivalente planejado/implementado quando o app puder receber TikTok/Meta/social paid.
- [ ] iOS: SKAN/AdServices/ATT/App Privacy/PrivacyInfo revisados e com um unico owner de conversion value.
- [ ] Web/PWA/landing: TikTok Pixel + Events API/UTM capture planejado/implementado quando houver trafego pago/social.
- [ ] Evento de funil minimo definido: app open/install, onboarding completed, ativacao principal, paywall viewed, trial/purchase started, purchase/subscription completed.
- [ ] Reporting central definido: app, channel, campaign, spend, impressions, clicks/taps, installs/leads, CPA/CPT e receita/trial quando existir.
- [ ] Test Events ou equivalente documentado antes de qualquer campanha paga, budget scale, creative refresh pago ou paid launch.
- [ ] Segredos ficam em secret manager/build env/provider env; vault registra somente nomes de env vars e local de armazenamento.

## 1. Ler memoria e padroes

- [ ] Nota do projeto em `02_Projects`.
- [ ] `.brain/PROJECT_CONTEXT.md`.
- [ ] AI history do projeto.
- [ ] `brain-linear-sync` rodado ou [[04_Areas/Coding/Linear/Linear Git Sync Report]] lido.
- [ ] Linear issue/projeto vivo lido via conector quando o trabalho for roadmap, bug, release, status, prioridade, sprint/cycle, backlog ou automacao.
- [ ] [[04_Areas/Coding/Best Practices/Development Best Practices Hub]]
- [ ] [[04_Areas/Coding/Best Practices/Frontend UI UX Best Practices]]
- [ ] [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]] quando houver site publico, portfolio, landing, hero, animacao, referencia visual ou pedido de qualidade premium.
- [ ] [[04_Areas/Coding/Checklists/Project Checklist Hub]]
- [ ] [[04_Areas/Coding/Checklists/Screenshots Visual QA Checklist]]
- [ ] [[04_Areas/Coding/Checklists/Security Checklist]]

## 2. Plataforma

- [ ] Web: [[04_Areas/Coding/Checklists/Web App Preflight Checklist]]
- [ ] iOS: [[04_Areas/Coding/Checklists/iOS App Preflight Checklist]]
- [ ] Android: [[04_Areas/Coding/Checklists/Android App Preflight Checklist]]
- [ ] Backend/API: [[04_Areas/Coding/Checklists/Backend API Checklist]]
- [ ] AI/LLM: [[04_Areas/Coding/Checklists/AI Integrations Checklist]] — se houver IA, smoke real do endpoint + fluxo UI no runtime alvo sao obrigatorios; sem isso, production/TestFlight/App Store/Play Console e NO-GO.
- [ ] Release/deploy: [[04_Areas/Coding/Checklists/Release Deploy Checklist]]

## 3. Produto e UX

- [ ] Primeira tela mostra valor real, nao placeholder ou marketing vazio.
- [ ] Todo app tem identidade publica pronta: icone final forte, landing page publica superior e links legais vivos.
- [ ] Mobile app tem opening motion contextual ao dominio do produto, curto, offline, sem spinner generico e sem bloquear o uso.
- [ ] `GET /` do dominio publico entrega landing HTML responsiva, nao JSON cru, pagina vazia ou placeholder.
- [ ] Landing inclui nome do app, promessa clara, visual real/screenshot, CTA, support/privacy/terms, favicon/app icon e Open Graph/Twitter metadata.
- [ ] Footer/top-footer serio existe em desktop e mobile web, com About, Mission, How It Works/How To Use, Compliance, Legal, Privacy Policy, Terms of Use, Contact e Support.
- [ ] Paginas publicas essenciais existem em ingles e portugues com locale explicito; nao ha mistura PT/EN por fallback.
- [ ] Contact/Support usa alias ou formulario do produto, nunca email pessoal, telefone, endereco, empregador, localizacao privada ou outros dados pessoais do Paulo.
- [ ] Fluxo principal tem inicio, acao, feedback, erro e conclusao.
- [ ] Se for app iOS com mudanca significativa, fechamento inclui QA funcional no app instalado e upload TestFlight/App Store Connect.
- [ ] Estados vazios, loading, erro, offline e permissao negada foram tratados.
- [ ] Usuario consegue recuperar de erro sem perder trabalho.
- [ ] Copy esta em idioma correto e nao promete o que app nao entrega.
- [ ] Nenhum texto explica funcionalidade que a UI deveria tornar obvia.

## 4. Qualidade visual

> **Regra zero:** screenshots para loja, marketing ou release sao deliverabl
...[truncated]

## 04_Areas/Coding/Checklists/Screenshots Visual QA Checklist.md

---
type: checklist
area: visual-qa
tags:
  - screenshots
  - visual-qa
  - quality
---
# Screenshots Visual QA Checklist

> **Regra zero — sempre awesome, nunca degrada.** Toda screenshot destinada a loja, marketing, post, deck ou capa de release e deliverable de primeira classe. Sai composta, brandada, no formato exato do destino, em todos os idiomas relevantes. Nao existe "screenshot ok pra primeira versao". Cada nova versao deve ser igual ou melhor que a anterior — degradacao visual e regressao e bloqueia release.

## Quando capturar

- [ ] Mudanca visual em tela, componente, landing, dashboard ou app.
- [ ] Novo fluxo de onboarding, auth, pagamento, upload, IA ou deploy.
- [ ] Submission App Store/Google Play — **bloqueador**: sem 6 telas finais composed em cada idioma + device class, nao submete.
- [ ] Resubmission apos rejeicao Apple/Google — refazer set inteiro se o build mudou de jeito visivel.
- [ ] Lancamento de feature consumer — pelo menos 1 hero shot artistico para post/release notes.
- [ ] Bug visual, overflow ou responsividade.
- [ ] Antes/depois de refactor de UI — comparar lado-a-lado.
- [ ] Marketing post, anuncio, deck, video preview — formato e dimensoes do canal final, nao reaproveitar de outro lugar.
- [ ] Site/landing/portfolio com referencia visual externa — capturar referencia e resultado novo em desktop/mobile para comparar.

## Viewports

- [ ] Mobile estreito.
- [ ] Mobile alto.
- [ ] Tablet quando aplicavel.
- [ ] Desktop padrao.
- [ ] Desktop largo quando layout for responsivo.
- [ ] Light/dark mode quando suportado.

## Sites, landings e portfolio high-craft

- [ ] Primeiro viewport mostra marca, pessoa, produto ou objeto principal sem depender de texto pequeno no nav.
- [ ] Se ha referencia visual, o resultado foi comparado contra a referencia por tese visual, movimento, composicao, tipografia, paleta e assets.
- [ ] Ha screenshot do hero e pelo menos um screenshot em scroll state.
- [ ] Canvas/WebGL/SVG animado foi validado como nao branco, nao travado, corretamente enquadrado e respeitando reduced motion quando aplicavel.
- [ ] Foto, produto ou diagrama principal parecem parte do sistema visual, nao colagem.
- [ ] CTA, contato, SEO/Open Graph e favicon foram conferidos quando a pagina e publica.

## "Super awesome" para store/marketing — checklist obrigatorio

- [ ] Composicao branded: brand gradient/textura + headline tipografica + frame de device realista + footer com wordmark/logo.
- [ ] Headline tipografica forte (display font, peso 800+, tamanho >= 100px no 1320px), idealmente com gradient sutil.
- [ ] Eyebrow curta acima do headline (uppercase, letter-spacing alto, cor accent da marca).
- [ ] Subhead em uma linha que explica o beneficio.
- [ ] Frame de device com bezel realista, Dynamic Island/notch correto, side buttons, drop shadow.
- [ ] Screenshot interna mostra produto em uso real, com dados de demo plausiveis (nao login, nao splash, nao tela vazia).
- [ ] Resolucao EXATA do destino:
  - iPhone 6.9": 1320x2868
  - iPhone 6.7": 1290x2796
  - iPhone 6.5": 1242x2688
  - iPhone 5.5": 1242x2208
  - iPad 13": 2064x2752
  - iPad 12.9": 2048x2732
  - Instagram feed: 1080x1350
  - Instagram story: 1080x1920
  - LinkedIn post: 1200x627
- [ ] Status bar: 9:41, bateria 100%, sinal cheio, sem operadora estranha. `xcrun simctl status_bar` ou device fisico ja configurado.
- [ ] Por idioma do mercado (minimo pt-BR + en-US para Brasil/global; adicionar es-MX/es-AR/pt-PT conforme distribuicao).
- [ ] Storytelling: 6 screenshots = arco (hook -> mecanica -> payoff -> social -> monetizacao -> upgrade).
- [ ] Comparada lado-a-lado com a versao anterior: igual ou melhor. Nunca pior.
- [ ] Comparada lado-a-lado com competidor direto: aguenta sem parecer pior.

## O que reprova

- [ ] Texto cortado.
- [ ] Texto ou controles sobrepostos.
- [ ] Botao muda tamanho no hover/loading.
- [ ] Cards dentro de cards sem motivo.
- [ ] Hero generico sem produto/objeto real.
- [ ] Imagem escura, cortada ou decorativa quando deveria explicar produto.
- [ ] Loading/empty/error com layout quebrado.
- [ ] Conteudo principal abaixo da dobra sem sinal visual.
- [ ] Cores muito monocromaticas sem hierarquia.
- [ ] Screenshot cru de simulator/device enviado para loja ou marketing sem composicao.
- [ ] Screenshot em idioma errado para o mercado.
- [ ] Apenas tela de login, splash ou title art (Apple Guideline 2.3.3 reprova).
- [ ] Resolucao aproximada (1290x2796 enviado como 6.9" e errado — Apple aceita mas perde fidelidade).
- [ ] Reaproveitar screenshot de release anterior sem comparar — risco de regressao silenciosa.
- [ ] Screenshot de dependencia, fixture ou `node_modules` tratado como prova do app.

## Evidencia

- [ ] Paths dos screenshots registrados na nota do projeto.
- [ ] Cada screenshot de QA tem interpretacao humana registrada: o que passou, o que falhou, se bloqueia release e qual e o proximo passo.
- [ ] Screenshot em simulador/device compartilhado com outros apps/agentes nao conta como evide
...[truncated]

## 04_Areas/Coding/Checklists/Web App Preflight Checklist.md

---
type: preflight-checklist
platform: web
tags:
  - preflight
  - web
  - quality
---
# Web App Preflight Checklist

## UX / Brand

- [ ] **Logo no topo (navbar/header) em SVG/maxima qualidade; nunca placeholder.**
- [ ] **Favicon decente em todas as paginas: favicon.ico + PNGs + apple-touch-icon + site.webmanifest.**
- [ ] O primeiro viewport mostra produto, estado real ou tarefa principal.
- [ ] Para portfolio, landing premium, hero, animacao ou referencia visual, aplicar [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]].
- [ ] Navegacao principal e retorno sao claros.
- [ ] Estados empty/loading/error/success existem.
- [ ] Forms preservam dados em erro.
- [ ] Tabelas/listas funcionam em mobile ou tem alternativa.
- [ ] Conteudo real nao depende de lorem ipsum/placeholder.

## Web performance

- [ ] LCP target: ate 2.5s quando medido em experiencia real.
- [ ] INP target: ate 200ms.
- [ ] CLS target: ate 0.1.
- [ ] Imagens com dimensoes, lazy loading quando adequado e formatos corretos.
- [ ] Fontes nao bloqueiam render sem motivo.
- [ ] JS pesado foi evitado ou code-split.

## Accessibility

- [ ] WCAG 2.2 como alvo de referencia.
- [ ] Focus nao fica escondido.
- [ ] Target size/touch target aceitavel.
- [ ] Drag-and-drop tem alternativa.
- [ ] Autenticacao acessivel.
- [ ] Ajuda consistente em fluxos complexos.

## Technical

- [ ] SEO/metadata quando pagina publica.
- [ ] Canonical/robots/sitemap quando relevante.
- [ ] CSP, CORS e security headers considerados.
- [ ] API client nao carrega secrets.
- [ ] Error boundaries/logging sem PII.
- [ ] Analytics respeitam consent/privacy.

## Visual QA

- [ ] Screenshot desktop.
- [ ] Screenshot mobile.
- [ ] Para site/landing high-craft, screenshot do hero e de estado com scroll em desktop/mobile.
- [ ] Canvas/WebGL/SVG animado validado como nao branco, nao travado e corretamente enquadrado quando aplicavel.
- [ ] Screenshot de estado de erro/loading se mudou fluxo.
- [ ] Sem overflow horizontal.
- [ ] Sem texto sobrepondo UI.

## Referencias

- Web Vitals: https://web.dev/articles/vitals
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- High Craft Frontend Visual Standard: [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]]

## 04_Areas/Coding/Checklists/iOS App Preflight Checklist.md

---
type: preflight-checklist
platform: ios
tags:
  - preflight
  - ios
  - app-store
  - quality
---
# iOS App Preflight Checklist

## Produto e UX

- [ ] App segue convencoes iOS/HIG em navegacao, controles, gestos e feedback.
- [ ] App tem opening motion contextual ao dominio, implementado apos LaunchScreen estatico, curto e sem bloquear o uso.
- [ ] Fluxo principal funciona em device/simulador.
- [ ] Fluxos core e feature alterada foram testados no app instalado antes do fechamento.
- [ ] Safe area, Dynamic Type, dark mode e orientacao foram considerados.
- [ ] Permissoes aparecem no momento certo e explicam valor ao usuario.
- [ ] Offline/network slow nao quebra estado.
- [ ] Nenhum segredo real embutido no app.

## App Store review

- [ ] App nao tem placeholders, telas vazias ou conteudo temporario.
- [ ] App icon e final, forte, reconhecivel e consistente com a landing/App Store; nao e placeholder.
- [ ] App icon esta completo no asset catalog/build final da plataforma, nao apenas como PNG 1024 isolado.
- [ ] Backend esta online para review.
- [ ] URL raiz publica (`GET /`) entrega landing HTML responsiva de padrao superior, nao JSON cru.
- [ ] Landing tem nome do app, promessa clara, screenshots/visual real, CTA, suporte, privacy, terms, favicon/app icon e metadata social.
- [ ] Demo account ou demo mode existe quando login e necessario.
- [ ] Se login e necessario, Apple Sign-In e criacao de conta por e-mail foram testados em producao ou build release-like.
- [ ] App Review Information contem usuario demo e senha no App Store Connect; senha nao foi registrada no vault.
- [ ] Metadata, screenshots, descricao e notas de review batem com o app real.
- [ ] Support URL, Privacy URL e Terms URL retornam `200 text/html` antes da submissao.
- [ ] Se o dominio do produto nao estiver pronto, usar `https://www.pierrondi.dev/apps/<app-slug>/support`, `/privacy` e `/terms` como fallback oficial.
- [ ] Gate de release registrado no vault antes de push/upload: comandos, build number, simulator/device, screenshots, pass/fail humano, blockers e decisao final.
- [ ] Se houver outro chat/agente/processo trabalhando no app, usar simulador/device isolado ou registrar conflito; screenshot de device compartilhado nao conta como evidencia final sem confirmar app/bundle/processo.
- [ ] Push/ASC bloqueados se qualquer fluxo core abrir web indevidamente, mostrar app errado, ficar preso em login sem demo account/demo mode, tiver texto truncado, placeholder visual ou acao principal nao validada.
- [ ] Fluxos nativos minimos testados no app instalado: Auth/demo, Home, Planner/AI planner, Coach, Devotional, Records e Settings/sign-out.
- [ ] IAP/subscriptions estao visiveis, funcionais e explicados.
- [ ] Privacy policy e App Privacy Details batem com SDKs e coleta real.
- [ ] Opening motion nao inicializa tracking/ads/marketing antes de consentimento e respeita Reduce Motion.
- [ ] Privacy manifest (`PrivacyInfo.xcprivacy`) bate com dominios reais usados em producao.
- [ ] UGC tem report, block, moderation e contato quando aplicavel.
- [ ] Kids, saude, financeiro, sorteios/jogos, IA ou conteudo sensivel foram revisados.

## Build

- [ ] Bundle ID correto.
- [ ] Version/build number atualizados.
- [ ] Entitlements/capabilities revisados.
- [ ] Signing/provisioning ok.
- [ ] Archive/test build validado.
- [ ] Crash/logs revisados.
- [ ] Para upload/TestFlight/App Store Connect API, [[04_Areas/Coding/Checklists/Apple Developer And App Store Connect Inventory]] foi conferido.
- [ ] Para upload/TestFlight/App Store Connect API, [[04_Areas/Coding/Checklists/App Store Connect Upload Runbook]] foi seguido.
- [ ] `APP_STORE_CONNECT_ISSUER_ID` usa identificador nao-secreto do inventario; `.p8`, shared secrets e certificados ficam em secret manager/provider env vars.
- [ ] Large app icon 1024px nao tem alpha (`sips -g hasAlpha ...` retorna `no`).
- [ ] Asset catalog de AppIcon tem todos os slots/tamanhos exigidos pelo build alvo ou usa configuracao universal comprovadamente aceita pelo Xcode/App Store; validar no app instalado/TestFlight, nao so no arquivo fonte.
- [ ] Build number foi incrementado antes de novo upload.
- [ ] Upload nao sera considerado concluido ate App Store Connect mostrar build processing/`VALID`.
- [ ] Ao fechar mudanca iOS significativa, novo build foi enviado ao TestFlight/App Store Connect ou excecao explicita foi registrada.

## Screenshots

- [ ] Screenshots mostram valor real do app.
- [ ] Sem dados sensiveis.
- [ ] Textos localizados corretamente.
- [ ] Dispositivos/tamanhos exigidos foram cobertos.
- [ ] Idiomas suportados tem screenshots separados no `fastlane/screenshots/<locale>`.
- [ ] Dimensoes dos screenshots foram validadas por script.

## Fechamento TestFlight

- [ ] [[04_Areas/Coding/Best Practices/iOS Functional QA And TestFlight Closure Standard]] foi seguido.
- [ ] Comando de upload usado foi registrado.
- [ ] IPA/archive/dSYM path registrado quando aplicavel.
- [ ] Status App Store Connect regis
...[truncated]

## 04_Areas/Coding/Checklists/Android App Preflight Checklist.md

---
type: preflight-checklist
platform: android
tags:
  - preflight
  - android
  - google-play
  - quality
---
# Android App Preflight Checklist

## Produto e UX

- [ ] App segue Core App Quality e padroes Android.
- [ ] App tem opening motion contextual ao dominio, curto, offline e coerente com Material/brand.
- [ ] Material 3/Compose ou sistema visual escolhido foi aplicado consistentemente.
- [ ] Back navigation funciona e nao perde dados.
- [ ] Estado e restaurado ao voltar do background.
- [ ] Layout funciona em diferentes tamanhos, densidades, orientacoes e fontes.
- [ ] Foldables/tablets foram considerados se o app se beneficiar.
- [ ] Permissoes perigosas sao pedidas so quando ligadas ao caso de uso principal.

## Technical quality

- [ ] Startup, scroll, transicoes e memoria aceitaveis.
- [ ] Opening motion respeita animator duration scale/acessibilidade e nao bloqueia o app por mais de 2s.
- [ ] Crash-free e ANR considerados.
- [ ] Offline/network slow tratado.
- [ ] WorkManager/background work usado de forma apropriada.
- [ ] Battery/network usage nao abusivo.
- [ ] Nenhum segredo real embutido no APK/AAB.

## Google Play

- [ ] Privacy policy publica e dentro do app quando necessario.
- [ ] Data safety section consistente com coleta real e SDKs terceiros.
- [ ] Permissions declaration coerente.
- [ ] Content rating completo.
- [ ] Store listing sem claims enganosos.
- [ ] Account deletion e data deletion quando aplicavel.
- [ ] Test track/review notes preparados.

## Build/release

- [ ] Application ID correto.
- [ ] Version code/name atualizados.
- [ ] Release signing configurado.
- [ ] Android App Bundle pronto.
- [ ] ProGuard/R8 rules revisadas.
- [ ] Smoke test em device/emulator.

## Screenshots

- [ ] Phone screenshots.
- [ ] Tablet/large screen screenshots se aplicavel.
- [ ] Sem dados sensiveis.
- [ ] UI legivel em light/dark mode.

## Referencias

- Android Core App Quality: https://developer.android.com/docs/quality-guidelines/core-app-quality
- Android technical quality: https://developer.android.com/quality/technical
- Google Play policies: https://support.google.com/googleplay/android-developer/answer/16933379

## Fonte verificada

- `2026-05-18`: Android Core App Quality consultado; pagina oficial indica ultimo update em `2026-04-08 UTC`.

## 04_Areas/Coding/Checklists/Security Checklist.md

---
type: checklist
area: security
tags:
  - checklist
  - security
---
# Security Checklist

## Baseline

- [ ] Nenhum segredo real em Markdown, commits, screenshots, logs ou issues.
- [ ] `.env`, private keys, certificates e service account files estao no `.gitignore`.
- [ ] `.env.example` existe quando util, sem valores reais.
- [ ] Dependencias novas foram revisadas.
- [ ] Input externo e validado no servidor.
- [ ] Output sensivel nao e exposto ao cliente.

## OWASP web

- [ ] Broken access control: checar autorizacao por recurso.
- [ ] Cryptographic failures: nao armazenar senha/token em claro.
- [ ] Injection: usar queries parametrizadas e sanitizacao apropriada.
- [ ] Insecure design: revisar abusos obvios do fluxo.
- [ ] Security misconfiguration: headers, CORS, debug e permissao.
- [ ] Vulnerable components: revisar dependencias.
- [ ] Auth failures: sessoes, reset, MFA quando aplicavel.
- [ ] Integrity failures: supply chain, builds, webhooks assinados.
- [ ] Logging/monitoring: eventos criticos sem secrets.
- [ ] SSRF: validar URLs externas e metadata endpoints.

## API

- [ ] BOLA/BFLA: usuario nao acessa objeto/funcoes de outro usuario.
- [ ] Rate limit por user/IP/token.
- [ ] Object properties sensiveis nao aceitam mass assignment.
- [ ] Excessive data exposure evitada.
- [ ] Webhooks e callbacks validam assinatura.
- [ ] Consumo de APIs externas tem timeout, retry e allowlist quando possivel.

## Mobile/client

- [ ] Nenhum segredo real embutido no app.
- [ ] Chaves publicas client-side sao tratadas como publicas.
- [ ] Deep links e callbacks validam destino.
- [ ] Storage local nao guarda token sensivel sem protecao adequada.

## IA

- [ ] Prompt injection e tool abuse foram considerados.
- [ ] Modelo nao recebe segredo real.
- [ ] Output de IA nao executa acao destrutiva sem validacao.
- [ ] Logs de IA redigem PII e secrets.

## Antes de finalizar

- [ ] Rodar busca por padroes de segredo antes de commit quando houver risco.
- [ ] Atualizar [[04_Areas/Coding/Checklists/Secrets And API Keys Register]] se env vars mudaram.
- [ ] Registrar risco residual na nota do projeto.

## 04_Areas/Coding/Checklists/Secrets And API Keys Register.md

---
type: secrets-register
tags:
  - checklist
  - secrets
  - api-keys
  - security
---
# Secrets And API Keys Register

Este arquivo e inventario. Ele **nao guarda valores reais**.

## Fonte unica local

Variaveis de ambiente compartilhadas vivem em `/Users/paulopierrondi/Projects/.keys.env` (chmod 600, gitignored). Carregamento canonico via `brain-env-run -- <comando>`. Override por projeto: `.env` no diretorio do projeto. Detalhes em [[99_System/Central Env File Operating Model]].

Este register continua sendo **inventario** (nome, owner, projeto, ambiente, status, rotacao). O valor real continua em `/Projects/.keys.env` + Apple Keychain durable + provider env vars de producao.

## Regra

Guardar aqui:

- nome da env var;
- fornecedor;
- projeto;
- ambiente;
- onde o valor real esta guardado;
- data de rotacao;
- dono/responsavel;
- risco e escopo.

Nao guardar aqui:

- API key real;
- token;
- senha;
- cookie;
- private key;
- refresh token;
- service account JSON;
- arquivo `.p8`, `.pem`, `.key`, `.p12`, `.mobileprovision` ou equivalente.

## Locais recomendados para valor real

- `/Users/paulopierrondi/Projects/.keys.env` (chmod 600, gitignored) — fonte unica local; carregar com `brain-env-run`.
- `./.env` do projeto — override quando o projeto precisa de valor diferente do global.
- Apple Keychain via `brain-secret-intake`/`brain-load-secrets` — backing durable do `.env` central.
- 1Password ou outro password manager com referencias seguras, por exemplo `op://Developer/OpenAI/api-key`.
- Apple Passwords / iCloud Keychain para senhas/passkeys humanas.
- GitHub Actions Secrets.
- Vercel/Railway/Netlify/Fly/Render environment variables (producao).
- AWS/GCP/Azure secret manager.

## Modelo de uso

Ver [[99_System/Credential Vault Operating Model]].

- Valor real nunca entra neste arquivo.
- Referencia segura pode entrar, por exemplo `op://vault/item/field`.
- Provider env var pode entrar, por exemplo `Railway Variables -> project/service -> OPENAI_API_KEY`.
- Se `op`/secret manager nao existir no ambiente, deixar acao humana clara em vez de pedir key em chat.
- Intake local seguro disponivel em `/Users/paulopierrondi/.local/bin/brain-secret-intake`; ele pede o valor no prompt do Apple Keychain, sem passar segredo por argumento de shell.
- Intake por arquivo temporario disponivel em `/Users/paulopierrondi/.second-brain-secrets.env`; importar com `/Users/paulopierrondi/.local/bin/brain-secret-intake import /Users/paulopierrondi/.second-brain-secrets.env --delete`.

## Checklist para nova API key

- [ ] Existe env var com nome claro.
- [ ] Valor real esta em secret manager, nao no vault.
- [ ] `.env.example` foi atualizado sem valor real.
- [ ] Se usado arquivo temporario de intake, ele foi apagado apos importacao.
- [ ] Escopo/permissao minima.
- [ ] Ambiente separado: dev/staging/prod.
- [ ] Rotacao/revogacao planejada.
- [ ] Quem usa a key esta documentado.
- [ ] Logs nao imprimem a key.
- [ ] Client nao recebe segredo server-side.

## Incidente de exposicao - 2026-05-19

Valores reais de credenciais foram colados em chat em `2026-05-19`. Tratar como comprometidos. Nenhum valor real deve ser copiado para o vault.

Registro canonico: [[99_System/Secret Exposure Incident - 2026-05-19]].

| Area | Referencias afetadas | Onde o valor novo deve ficar | Status |
| --- | --- | --- | --- |
| Google Gemini | `GEMINI_API_KEY` | 1Password/Apple Keychain + provider env vars | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| ElevenLabs / Eventlabs | `ELEVENLABS_API_KEY`, `EVENTLABS_API_KEY` | 1Password/Apple Keychain + provider env vars | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| Pexels | `PEXELS_API_KEY` | 1Password/Apple Keychain + provider env vars | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| Creatomate | `CREATOMATE_API_KEY` | 1Password/Apple Keychain + provider env vars | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| YourVersion | `YOURVERSION_API_KEY` | 1Password/Apple Keychain + provider env vars | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| Linear | `LINEAR_API_KEY` | 1Password/Apple Keychain + local automation env | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| Railway | `RAILWAY_ACCOUNT_TOKEN`, `RAILWAY_PPT_TOKEN`, `RAILWAY_PIERRONDI_IA_TOKEN`, `RAILWAY_CSDM_TOKEN` | 1Password/Apple Keychain + Railway/GitHub Actions as needed | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| Cantus mobile | test user password | Apple Passwords/1Password; nao Markdown | **ROTATE_REQUIRED** - exposta em chat 2026-05-19 |
| Apple App Store Connect | API key metadata/private key file | Apple Developer Portal + local secure `.p8` path | **VERIFY_AND_ROTATE_IF_PRIVATE_KEY_EXPOSED** |

## Inventario

| Projeto | Env var | Fornecedor | Ambientes | Onde esta o valor real | Escopo | Rotacao | Dono | Status |
|---|---|---|---|---|---|---|---|---|
| _template_ | `OPENAI_API_KEY` | OpenAI | local/staging/prod | 1Password + provider env vars | server-side model calls | trimestral ou
...[truncated]

## 04_Areas/Marketing/Marketing MOC.md

---
type: moc
area: marketing
tags:
  - marketing
  - creative-os
  - video
  - pierrondi-dev
---
# Marketing MOC

Este e o centro de operacao para criativos, videos curtos, campanhas, legendas, voz, distribuicao social e aprendizado de marketing.

## Pierrondi.dev

- [[04_Areas/Marketing/Pierrondi.dev Creative Video OS]]
- [[04_Areas/Marketing/Creative Forge UGC Video Production OS]]  ← local UGC ad pipeline, M5 Max, ~$0.02/peça
- [[04_Areas/Marketing/Social Video Ad Trends 2026]]  ← hook templates + formats que estão batendo · revalidar a cada 6 semanas
- [[04_Areas/Marketing/ElevenLabs Voice And Subtitle Workflow]]
- [[04_Areas/Marketing/Social Video Platform Specs 2026]]
- [[04_Areas/Marketing/Creative QA Checklist]]
- [[04_Areas/Marketing/Creative Prompt Starters]]
- [[04_Areas/Marketing/Creative Learning Loop]]
- [[04_Areas/Marketing/Marketing Growth Backlog]]
- [[04_Areas/Marketing/Creative Pipeline Secrets Inventory]]
- [[04_Areas/Marketing/Product SEO Mandatory Baseline]]

## App Marketing / ASA

- [[04_Areas/Marketing/FaithSchool Ads Marketing Learnings 2026-06-13]]
- [[04_Areas/Marketing/FaithSchool Google Ads Daily Report]]
- [[04_Areas/Marketing/FaithSchool Google Ads Daily Measurement Runbook]]
- [[04_Areas/Marketing/Paid War Room/2026-06-13-Google-Search-10USD-FaithSchool-CantuStudio]]
- [[04_Areas/Marketing/Soro SEO App Distribution OS]]
- [[04_Areas/Marketing/Soro SEO Automation - Claude Code Runbook]]
- [[04_Areas/Marketing/Soro SEO Automation - Kimi Runbook]]
- [[04_Areas/Marketing/Ready App Campaign Factory Procedure]]
- [[04_Areas/Marketing/Ready Apps Sales Effectiveness Scorecard]]
- [[04_Areas/Marketing/Apple Connect Ready Apps Campaign Matrix]]
- [[04_Areas/Marketing/App Marketing Intelligence OS]]
- [[04_Areas/Marketing/iOS App Paid Growth Execution OS]]
- [[04_Areas/Marketing/Apple Ads ASA Tuning Runbook]]
- [[04_Areas/Marketing/App Marketing Metrics Inventory]]
- [[04_Areas/Marketing/App Marketing Daily Tuning Report]]
- [[04_Areas/Marketing/App Marketing Tuning Backlog]]
- [[04_Areas/Marketing/TikTok Financial Ads Compliance Runbook]]

## Product / Revenue

- [[04_Areas/Product/Product Revenue MOC]]
- [[04_Areas/Product/Nightly Opportunity Engine]]
- [[04_Areas/Product/Nightly Opportunity Report]]
- [[04_Areas/Marketing/AgenticosCore SEO Organic Engagement OS]]

## Projeto

- [[02_Projects/pierrondi-ia]]
- Repo: `/Users/paulopierrondi/Projects/pierrondi-ia`
- Studio: `/studio/videos`, `/studio/creatives`, `/studio/creatives/factory`, `/studio/campaigns`, `/studio/topics`, `/studio/approvals`, `/studio/health`

## Regra

### Regra de ouro — LinkedIn

- **Ate Paulo dizer explicitamente o contrario, LinkedIn e canal exclusivo de ServiceNow.**
- Nao criar, agendar, aprovar, publicar ou sugerir LinkedIn sobre temas genericos de IA, n8n, WhatsApp, freelancing, automacao para PMEs, produto digital, apps consumer, lifestyle ou build-in-public.
- Temas permitidos para LinkedIn: ServiceNow, Now Assist, AI Agents na ServiceNow, CSDM, CMDB, ITSM/ITOM/SPM, Workflow Data Fabric, AI Control Tower, K26, arquitetura de plataforma ServiceNow, demos ServiceNow, Bradesco/FSI quando apropriado.
- Qualquer excecao precisa de confirmacao explicita do Paulo no momento da execucao. Silencio, ambiguidade ou backlog antigo nao autoriza excecao.
- Antes de agendar/publicar LinkedIn, verificar fila futura e bloquear conteudo fora de ServiceNow.

Todo pedido de criativo deve gerar um pacote, nao apenas uma peca:

- brief;
- roteiro;
- voz;
- legendas;
- visual/b-roll;
- versoes por canal;
- copy de publicacao;
- QA;
- aprendizado/metricas.

### Regra de ouro — Video ads para qualquer app

- Todo ad de app, UGC ou nao UGC, deve passar pelo fluxo nativo `Creative Video Factory` do Pierrondi IA Studio antes de geracao, upload ou publicacao.
- Tela canonica: `/studio/creatives/factory`.
- API canonica: `/api/marketing-os/content-factory/creative-video`.
- Engine canonica: `/Users/paulopierrondi/Projects/pierrondi-ia/lib/marketing-os/content-factory/creative-video-factory.ts`.
- O app standalone `creative-video-factory` e os artefatos do `investcoach_ai` sao biblioteca/prototipo historico, nao a fonte de verdade.
- Primeiro perguntar e registrar: canal principal (`TikTok`, `Instagram`, `LinkedIn`, `YouTube`), objetivo, pago/organico, tela real do app, hook dos 2 primeiros segundos e angulo de venda.
- Sempre que possivel, capturar demo real via Xcode/iOS Simulator antes de usar b-roll generico. A prova de produto deve vir antes de UGC, avatar, Veo ou Pexels.
- O pacote minimo por ad group pago e 4 videos: app real/problema, IA/interface, feature proof, trust/compliance.
- Stack premium preferida: demo real do produto + Veo/Gemini para b-roll + ElevenLabs para voz + Pexels como fallback/complemento.
- Para LinkedIn, manter a regra existente: canal exclusivo de ServiceNow salvo excecao explicita do Paulo.

### Regra de ouro — Paid marketing

- Apple Ads / ASA, Meta, TikTok, YouTube, LinkedIn Ads ou qualquer canal pa
...[truncated]

## 04_Areas/Marketing/Pierrondi.dev Creative Video OS.md

---
type: operating-system
area: marketing
project: pierrondi-ia
tags:
  - pierrondi-dev
  - creative-os
  - video
  - social
---
# Pierrondi.dev Creative Video OS

## Objetivo

Criar criativos e videos de marketing de alta qualidade para Pierrondi.dev e produtos do portfolio, com um workflow repetivel para LinkedIn, YouTube Shorts, TikTok, Instagram/Reels e campanhas pagas.

O output bom nao e "um video". E um pacote de campanha com roteiro, voz, legendas, assets, variacoes por canal, QA e aprendizado.

## Pierrondi.dev site visual language

O site publico de Paulo deve operar como prova executiva de capacidade, nao como landing generica de IA.

Padrao visual atual:
- preto profundo + branco forte + lime como sinal eletrico;
- campo neural vivo como camada de sistema;
- sinapses/sinais conectando agentes, workflows, governanca, inferencia e plataformas;
- foto executiva integrada ao ambiente visual, sem fundo branco colado;
- diagramas de arquitetura com fluxo de contexto, permissao, acao e evidencia;
- movimento real no scroll, com progress bar, reveal e responsividade;
- copy executiva, sem nome de cliente quando nao houver autorizacao.

Antes de mexer em pierrondi.dev, ler [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]], [[04_Areas/Coding/Best Practices/App Web Quality Best Practices]], [[04_Areas/Coding/Checklists/App Web Preflight Checklist]] e [[04_Areas/Coding/Checklists/Screenshots Visual QA Checklist]].

## Regra de ouro — LinkedIn

- **LinkedIn fica 100% restrito a ServiceNow ate Paulo dizer explicitamente o contrario.**
- Nao usar LinkedIn para campanhas genericas de IA, n8n, WhatsApp, automacao para PME, freelancing, produto digital, apps consumer ou build-in-public.
- LinkedIn pode usar apenas: ServiceNow, Now Assist, AI Agents na ServiceNow, CSDM, CMDB, ITSM/ITOM/SPM, Workflow Data Fabric, AI Control Tower, K26, arquitetura/demos ServiceNow e Bradesco/FSI quando fizer sentido.
- Se um roteiro/copy/video nao passa nesse filtro, gerar para outro canal ou deixar como rascunho nao agendado; nunca agendar/publicar em LinkedIn.

## Fonte de verdade no repo

- Repo: `/Users/paulopierrondi/Projects/pierrondi-ia`
- Creative Video Factory: `/Users/paulopierrondi/Projects/pierrondi-ia/docs/marketing-os/creative-video-factory.md`
- Studio: `/studio/creatives/factory`
- API: `/api/marketing-os/content-factory/creative-video`
- Engine: `/Users/paulopierrondi/Projects/pierrondi-ia/lib/marketing-os/content-factory/creative-video-factory.ts`
- Creative engine runbook: `/Users/paulopierrondi/Projects/pierrondi-ia/docs/marketing/creative-engine-test-runbook.md`
- Criativos curados: `/Users/paulopierrondi/Projects/pierrondi-ia/assets/creatives/post-images/`
- Background videos: `/Users/paulopierrondi/Projects/pierrondi-ia/assets/video-backgrounds/`
- API force video: `/api/marketing-os/force-video`
- Preflight: `/api/marketing-os/video/preflight`

## Regra de ouro — Creative Video Factory

- Todo pedido de video para TikTok, Instagram/Reels, YouTube Shorts, LinkedIn, UGC ou app ads deve passar por `/studio/creatives/factory`.
- A API canonica e `/api/marketing-os/content-factory/creative-video`; novos apps e coders devem chamar esse endpoint, nao criar pipelines standalone.
- O standalone `creative-video-factory` e os assets do InvestCoach ficam como biblioteca/prototipo historico.
- Perguntar sempre: canal, objetivo, pago/organico, tela real do app, hook dos 2 primeiros segundos e angulo de venda.
- Para ad group pago, planejar no minimo 4 videos: app real/problema, IA/interface, feature proof e trust/compliance.
- Sempre que possivel, usar Xcode/iOS Simulator para demo real antes de Veo, Pexels, avatar ou stock.
- Stack premium: demo real + Veo/Gemini para b-roll + ElevenLabs para voz + Pexels como fallback/complemento.
- Apps financeiros: vender organizacao, clareza, educacao e controle; nunca oportunidade financeira, lucro, renda extra, retorno, enriquecimento ou compra/venda de ativos.

## Pipeline atual

1. Brief do tema, publico, oferta e canal.
2. Script generator cria hook, corpo, CTA, b-roll keywords e UTMs.
3. Agent council revisa clareza, promessa, risco, canal e qualidade.
4. ElevenLabs gera voz com timestamps.
5. Captions convertem timestamps em palavras e ASS karaoke.
6. Visual usa criativos curados primeiro, background videos depois, Pexels como fallback.
7. Render FFmpeg local gera MP4 1080x1920.
8. Creatomate fica como backend premium opcional.
9. QA valida duracao, audio, legenda, safe zone, black frames, CTA, links e formato.
10. Publicacao fica em draft/review/approval antes de ir para canal externo.
11. Metricas entram no aprendizado para remix.

## Regra de qualidade

- Primeiro frame precisa explicar por que parar o scroll.
- Primeiros 2 segundos precisam ter tese, contraste ou prova.
- O roteiro precisa soar falado, nao escrito.
- Legenda precisa ser legivel sem audio e sem cobrir UI do canal.
- Voz precisa combinar com o canal: LinkedIn mais autoridade, TikTok/Ree
...[truncated]

## 04_Areas/Marketing/ElevenLabs Voice And Subtitle Workflow.md

---
type: workflow
area: marketing
tags:
  - elevenlabs
  - subtitles
  - captions
  - tts
  - video
---
# ElevenLabs Voice And Subtitle Workflow

## Objetivo

Gerar voz natural e legendas sincronizadas para videos de marketing, sem perder qualidade, acessibilidade ou controle de seguranca.

## Fluxo recomendado

1. Escrever roteiro falado, curto e com pausas naturais.
2. Escolher voz por objetivo: founder, autoridade tecnica, energia social, corporate ou analitica.
3. Gerar TTS no ElevenLabs usando endpoint com timestamps.
4. Salvar audio como asset do render, nunca em Markdown.
5. Converter timestamps por caractere para timings por palavra.
6. Gerar dois tipos de legenda:
   - ASS burned-in karaoke para Shorts/TikTok/Reels.
   - SRT sidecar para YouTube e LinkedIn.
7. Renderizar MP4 1080x1920 com FFmpeg local.
8. Rodar QA de sincronia, legibilidade e safe zone.
9. Registrar no projeto: voice slug, roteiro, caminhos de assets, render ID e aprendizados.

## ElevenLabs no repo

- Adapter: `/Users/paulopierrondi/Projects/pierrondi-ia/lib/marketing-os/voice/elevenlabs.ts`
- Captions: `/Users/paulopierrondi/Projects/pierrondi-ia/lib/marketing-os/video/captions.ts`
- Env vars:
  - `ELEVENLABS_API_KEY`
  - `ELEVENLABS_PAULO_VOICE_ID`
  - `JARVIS_ELEVENLABS_VOICE_ID`
  - `ELEVENLABS_DEFAULT_VOICE_ID`

## Regras de roteiro para voz

- Escrever como fala: frases curtas, sem paragrafo longo.
- Evitar siglas sem explicar na primeira vez.
- Colocar pausa onde o video precisa respirar.
- Nao pedir "voz viral"; pedir emocao operacional: calmo, urgente, professoral, provocativo, executivo, founder-led.
- Para PT-BR: revisar acentos, nomes proprios, pronuncia de siglas e palavras inglesas.
- Para EN: evitar literalismo do portugues; reescrever a ideia.

## Legendas

### Burned-in

Use em TikTok, Reels e Shorts quando a retencao depende de ler sem audio.

- 1 ou 2 linhas.
- Janela curta de 3 a 5 palavras.
- Contraste forte e outline.
- Nao ocupar topo com hooks longos.
- Evitar rodape baixo: UI do TikTok/Reels/Shorts cobre a area inferior.
- Usar highlights com parcimonia: uma palavra ativa por vez e suficiente.

### Sidecar

Use como arquivo separado quando a plataforma aceita closed captions.

- YouTube: SRT e VTT sao formatos aceitos; SRT UTF-8 e o default simples.
- LinkedIn: usar SRT simples; nao depender de cor, fonte ou markup.
- Manter o SRT master junto do render e registrar o path.

## Conversao de timing

ElevenLabs retorna `alignment` e `normalized_alignment` com timestamps por caractere. O pipeline deve:

1. preferir `normalized_alignment` quando texto foi normalizado;
2. agrupar caracteres nao-espaco em palavras;
3. usar inicio do primeiro caractere e fim do ultimo;
4. snapar cortes para limites de palavra;
5. validar que o ultimo timestamp fica perto da duracao real do audio.

## QA de voz

- [ ] Voz nao parece leitura monotona.
- [ ] Nomes proprios e termos tecnicos corretos.
- [ ] Pacing cabe no tempo alvo.
- [ ] Sem respiracao, riso ou tag textual renderizada por acidente.
- [ ] Audio sem clipping.
- [ ] Legenda bate com a fala.
- [ ] CTA falado e visivel.
- [ ] Sem uso de voz clonada sem consentimento.

## Referencias oficiais

- ElevenLabs timestamps API: https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
- YouTube caption file formats: https://support.google.com/youtube/answer/2734698
- LinkedIn video captions specs: https://www.linkedin.com/help/linkedin/answer/a424737

## 04_Areas/Marketing/Social Video Platform Specs 2026.md

---
type: reference
area: marketing
tags:
  - platform-specs
  - video
  - linkedin
  - youtube
  - tiktok
  - instagram
---
# Social Video Platform Specs 2026

Verificado em 2026-05-15 com fontes oficiais. Specs mudam; revalidar antes de campanha paga grande.

## Master recomendado

Use este master sempre que possivel:

- MP4
- H.264 video
- AAC audio
- 1080x1920
- 9:16
- 30fps
- legendas burned-in para short-form
- SRT sidecar para canais que aceitam caption upload

## YouTube Shorts

- Square ou vertical ate 3 minutos e classificado como Shorts.
- Upload via YouTube app ou YouTube Studio.
- Se tiver Content ID claim e durar mais de 1 minuto, pode ser bloqueado globalmente.
- Recomendo: 15-60s para performance; usar 60-180s somente quando a historia precisa.
- Caption: SRT simples ou VTT; manter master SRT.

## TikTok

- Recomendado: vertical 9:16.
- Non-Spark ads suportam 9:16, 16:9 e 1:1; vertical recomendado.
- Minimo vertical oficial: >= 540x960.
- Formatos: MP4, MOV e outros aceitos para ads.
- Tamanho: ate 500 MB para in-feed ads.
- Duração de ads Non-Spark: ate 10 minutos; Spark Ads puxa specs do video organico.
- Direct Post API exige consentimento explicito e clients nao auditados ficam restritos a private mode.
- Recomendo criativo organico/pago: 15-45s, key message dentro de safe zone.

## Instagram / Reels / Meta

- Reels aceitam proporcao entre 1.91:1 e 9:16.
- Minimo oficial: 30 FPS e resolucao minima de 720px.
- Para Reels ads, Meta recomenda criativos 9:16 com audio e key elements em safe zone.
- Recomendo: 1080x1920, 9:16, audio claro, legendas burned-in, CTA visual acima da UI inferior.
- Cover Reels: referencia oficial 420x654.

## LinkedIn

- Video ads: MP4.
- File size: 75 KB a 500 MB.
- Codec: H.264 ou VP8.
- Audio: AAC ou MPEG4.
- Frame rate: menor que 30 FPS segundo spec oficial de ads.
- Captions: SRT, somente texto; nao contar com cor, fonte ou markup.
- Videos menores que 30s podem loopar ate completar 30s de playback.
- Video precisa ser upload direto no LinkedIn, nao link do YouTube/Vimeo.
- Recomendo: 20-45s para founder/proof, 45-90s para tutorial executivo.

## Export matrix

| Canal | Export principal | Legenda | Melhor uso |
|---|---|---|---|
| YouTube Shorts | 1080x1920 MP4 | Burned-in + SRT | prova, tutorial, narrativa |
| TikTok | 1080x1920 MP4 | Burned-in | hook agressivo, trend, discovery |
| Instagram Reels | 1080x1920 MP4 | Burned-in | visual proof, social proof, product story |
| LinkedIn | 1080x1920 ou 1080x1350 MP4 | SRT + opcional burned-in leve | autoridade, case, tese B2B |
| LinkedIn feed image/carousel | 1080x1350 PNG/JPG | texto no card | resumo, framework, prova |

## Safe-zone padrao

- Manter textos e rosto/produto entre y=220 e y=1500 no master 1080x1920.
- Evitar CTA no rodape.
- Nao colocar texto essencial perto de bordas laterais.
- Testar primeiro frame como thumbnail.

## Referencias oficiais

- YouTube Shorts 3 minutos: https://support.google.com/youtube/answer/15424877
- YouTube caption formats: https://support.google.com/youtube/answer/2734698
- TikTok In-Feed Ads specs: https://ads.tiktok.com/help/article/tiktok-auction-in-feed-ads
- TikTok Direct Post API: https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
- Instagram Reels size/aspect ratio: https://www.facebook.com/help/1038071743007909
- Meta Reels ads guidance: https://www.facebook.com/business/ads/facebook-instagram-reels-ads
- LinkedIn video ad specs: https://www.linkedin.com/help/linkedin/answer/a424737

## 04_Areas/Marketing/Creative QA Checklist.md

---
type: checklist
area: marketing
tags:
  - qa
  - creative
  - video
  - social
---
# Creative QA Checklist

## Antes de gerar

- [ ] Objetivo claro: awareness, leads, prova, produto, retargeting, authority.
- [ ] Canal primario definido: TikTok, Instagram, LinkedIn ou YouTube.
- [ ] Perguntas obrigatorias respondidas: canal, objetivo, pago/organico, tela real do app, hook e angulo.
- [ ] Produto/oferta e CTA definidos.
- [ ] Publico e dor especificos.
- [ ] Prova ou demo real escolhida; para app iOS, preferir Xcode/iOS Simulator sempre que possivel.
- [ ] Assets obrigatorios listados.
- [ ] Riscos de marca/compliance revisados.
- [ ] Nenhum segredo ou PII em screenshots/assets.
- [ ] Se for app do portfolio, manifest criado no `Creative Video Factory` nativo do Pierrondi IA Studio (`/studio/creatives/factory` ou API `/api/marketing-os/content-factory/creative-video`).
- [ ] Para ad group pago, existem 4 videos planejados/ativos: app real/problema, IA/interface, feature proof e trust/compliance.
- [ ] Se usar Veo/Gemini, ElevenLabs ou Pexels, eles complementam uma prova de produto real; nao substituem demo real quando ela e possivel.

## Script

- [ ] Hook nos primeiros 2 segundos.
- [ ] Uma tese principal, nao tres.
- [ ] Linguagem falada.
- [ ] CTA unico.
- [ ] Duracao estimada bate com o canal.
- [ ] Sem promessa que produto nao entrega.
- [ ] Sem claims de resultado sem prova.
- [ ] Para finanças/TikTok, sem linguagem de oportunidade, lucro, renda extra, retorno, enriquecimento ou compra/venda de ativos.

## Voz

- [ ] Voice slug escolhido.
- [ ] Pacing escolhido: slow, normal ou fast.
- [ ] Pronuncia de nomes e siglas revisada.
- [ ] Audio sem clipping.
- [ ] Voz combina com canal.
- [ ] Voz clonada tem consentimento e uso permitido.

## Legendas

- [ ] Burned-in legivel no celular.
- [ ] SRT gerado quando canal aceita caption upload.
- [ ] Sincronia palavra/fala validada.
- [ ] Texto dentro de safe zone.
- [ ] Sem legenda cobrindo CTA, rosto, produto ou UI importante.

## Visual

- [ ] Usa produto real, screenshot, demo Xcode/iOS Simulator ou b-roll relevante.
- [ ] O primeiro frame prova o produto, o hook ou o problema sem parecer stock generico.
- [ ] Criativos curados foram verificados antes de gerar via IA.
- [ ] Background videos locais foram verificados antes de Pexels.
- [ ] Primeiro frame funciona como thumbnail.
- [ ] Nenhum frame todo preto/branco ou quebrado.
- [ ] Sem stock generico quando a peca precisa provar algo.

## Site/portfolio creative standard

- [ ] Para pierrondi.dev, site pessoal ou portfolio executivo, ler [[04_Areas/Coding/Best Practices/High Craft Frontend Visual Standard]] antes de editar.
- [ ] Primeiro viewport prova Paulo, a oferta ou o sistema de trabalho; nao pode parecer landing generica de IA.
- [ ] Referencia visual foi decomposta em tese, movimento, composicao, tipografia, paleta e assets antes da implementacao.
- [ ] Foto executiva, diagramas e workflows estao integrados ao ambiente visual.
- [ ] Nao citar nomes de clientes sem autorizacao; usar prova por categoria, industria, padrao tecnico e resultado.
- [ ] Contato, email, SEO/Open Graph e CTA foram tratados como parte da conversao, nao acabamento.

## Export

- [ ] MP4 H.264/AAC.
- [ ] 1080x1920 para short-form.
- [ ] 1080x1350 ou 1080x1080 gerado se feed precisar.
- [ ] Duracao dentro do alvo.
- [ ] File size dentro do canal.
- [ ] SRT/VTT salvo quando aplicavel.
- [ ] Caminhos de output registrados.

## Publicacao

- [ ] Approval gate criado quando externo.
- [ ] Copy por canal revisada.
- [ ] Copy digitada na plataforma revisada contra typos antes de submit.
- [ ] UTM correto.
- [ ] Thumbnail/capa validada.
- [ ] Canal/conector pronto.
- [ ] Se TikTok Direct Post ainda nao auditado, tratar como draft/private/native completion.
- [ ] Para TikTok financeiro, [[04_Areas/Marketing/TikTok Financial Ads Compliance Runbook]] concluido.
- [ ] Se conteudo tiver IA, checkbox/rotulo AI-generated marcado e assets correspondentes selecionados.

## Aprendizado

- [ ] Hipotese do criativo registrada.
- [ ] Canal e variacao registrados.
- [ ] Metricas de 24h, 72h e 7d planejadas.
- [ ] O que remixar definido.
- [ ] Aprendizado registrado em [[04_Areas/Marketing/Creative Learning Loop]].

## 04_Areas/Marketing/Creative Prompt Starters.md

---
type: prompt-library
area: marketing
tags:
  - prompts
  - creative
  - video
  - social
---
# Creative Prompt Starters

Use estes prompts com Codex, Claude Code, Kimi, Gemini ou dentro do Studio. Sempre peça pacote completo, nao peca "um post".

## Criativo completo

```text
Use o vault e o repo pierrondi-ia. Leia:
- 04_Areas/Marketing/Pierrondi.dev Creative Video OS.md
- 04_Areas/Marketing/ElevenLabs Voice And Subtitle Workflow.md
- 04_Areas/Marketing/Social Video Platform Specs 2026.md
- 04_Areas/Marketing/Creative QA Checklist.md
- 02_Projects/pierrondi-ia.md
- /Users/paulopierrondi/Projects/pierrondi-ia/docs/marketing-os/video-render-pipeline.md

Crie um pacote de criativo para:
Produto/oferta: <produto>
Canal primario: <linkedin | youtube_shorts | tiktok | instagram_reels>
Canais secundarios: <...>
Publico: <quem>
Dor: <dor>
Prova/demo: <prova>
CTA: <cta>
Idioma: <pt-BR | en>
Duracao alvo: <15s | 30s | 45s | 60s>
Tom: <founder-led, tecnico, provocativo, executivo, tutorial>

Entregue:
1. brief
2. 5 hooks
3. roteiro final falado
4. direcao de voz ElevenLabs
5. legenda/caption plan
6. b-roll/screenshot plan
7. export targets
8. copy por canal
9. checklist de QA
10. aprendizado esperado e metricas para acompanhar

Nao publique. Nao use segredos. Se precisar de API key, cite apenas o nome da env var.
```

## YouTube Shorts

```text
Crie um YouTube Shorts para <tema>. Target 35-60s, 1080x1920, hook em 2s, roteiro falado, CTA unico e SRT sidecar. Use voz founder se fizer sentido. Gere tambem titulo, descricao com UTM, 3 thumbnails textuais e plano de remix caso retenção caia antes de 5s.
```

## TikTok/Reels

```text
Crie uma versao TikTok/Reels para <tema>. Target 15-35s, visual proof antes de explicacao, captions burned-in, safe zone vertical, ritmo mais rapido e linguagem menos corporativa. Entregue 3 aberturas alternativas e uma versao "menos polida, mais nativa".
```

## LinkedIn

Regra obrigatoria: LinkedIn e exclusivo para ServiceNow ate Paulo dizer explicitamente o contrario. Prompts LinkedIn devem tratar de ServiceNow, Now Assist, AI Agents na ServiceNow, CSDM, CMDB, ITSM/ITOM/SPM, Workflow Data Fabric, AI Control Tower, K26, demos/arquitetura ServiceNow ou Bradesco/FSI. Nao gerar LinkedIn para IA generica, n8n, WhatsApp, freelancing, automacao PME, produto digital, apps consumer ou build-in-public.

```text
Crie uma versao LinkedIn para <tema>. Target 30-60s, tom founder/executivo, prova concreta, sem hype. Entregue video script, SRT simples, copy do post, headline, CTA e 3 comentarios de follow-up que Paulo pode postar depois.
```

## Creative remix

```text
Pegue o criativo abaixo e gere 5 remixes mudando apenas um eixo por vez:
1. hook
2. prova
3. visual
4. CTA
5. pacing/voz

Preserve a tese principal. Para cada remix, diga por que pode performar melhor e qual metrica validaria.

Criativo atual:
<colar resumo ou path>
```

## Pedir execucao no repo

```text
No repo /Users/paulopierrondi/Projects/pierrondi-ia, use o pipeline existente de video factory. Antes de mexer, rode/consulte o preflight do video. Gere apenas draft/review, sem publicar automaticamente. Use RENDER_BACKEND=ffmpeg como default e registre output paths, renderId, scriptId, custos, blockers e proximos passos no vault.
```

## Kimi Claw - radar diario de video ads

2026-05-18: prompt operacional criado para tarefa diaria no Kimi Claw as 22:40, com pesquisa avancada de video ads por plataforma, ranking de tendencias, matriz de IA por custo-beneficio, prompts por ferramenta e backlog de criativos. Arquivo: `/Users/paulopierrondi/Documents/Codex/2026-05-18/quero-um-prompt-para-o-kimi-2/kimi-claw-daily-video-ads-intelligence-prompt.md`.

2026-05-19: prompt ampliado para Kimi Claw / Kimi CLI como `Kimi Growth War Room`, cobrindo pesquisa ampla de marketing digital, comunidades, ferramentas/agentes, ASO/ASA, App Store, melhoria de apps por receita, pacotes de campanha, criativos, posts e escrita segura no vault. Arquivo: `/Users/paulopierrondi/Documents/Codex/2026-05-19/me-da-um-super-maximo-prompt/kimi-claw-marketing-growth-superprompt.md`.

## 04_Areas/Marketing/Creative Pipeline Secrets Inventory.md

---
type: secrets-inventory
area: marketing
tags:
  - secrets
  - marketing
  - no-secret-values
---
# Creative Pipeline Secrets Inventory

Esta nota registra apenas nomes e finalidade. Nao registrar valores reais.

## Regra

- Valor real fica em Railway env, GitHub Actions Secrets, provider OAuth ou secret manager.
- Vault registra nome, escopo, ambiente e rotacao.
- Nunca colar API key em prompt, Markdown, screenshot, log ou commit.

## Pierrondi.dev video/creative env vars

| Env var | Uso | Onde o valor real deve ficar | Observacao |
|---|---|---|---|
| `ELEVENLABS_API_KEY` | TTS/voice generation | Railway env + local `.env.local` | Necessaria para voz |
| `ELEVENLABS_PAULO_VOICE_ID` | Voz founder | Railway env + local `.env.local` | Nao e segredo forte, mas tratar como config sensivel |
| `JARVIS_ELEVENLABS_VOICE_ID` | Voz Jarvis | Railway env | Opcional |
| `ELEVENLABS_DEFAULT_VOICE_ID` | Fallback voice | Railway env | Opcional |
| `PEXELS_API_KEY` | B-roll fallback | Railway env | Pode ser dispensada com background local |
| `CREATOMATE_API_KEY` | Render premium opcional | Railway env | Opcional quando `RENDER_BACKEND=ffmpeg` |
| `CREATOMATE_TEMPLATE_DEFAULT_ID` | Template premium | Railway env | Config |
| `VIDEO_STORAGE_ROOT` | Storage de videos | Railway env/volume | Nao e segredo |
| `VIDEO_SIGNING_SECRET` | URLs assinadas de video | Railway env | Segredo |
| `YOUTUBE_CLIENT_ID` | YouTube OAuth | Railway env | Config/OAuth |
| `YOUTUBE_CLIENT_SECRET` | YouTube OAuth | Railway env | Segredo |
| `YOUTUBE_REFRESH_TOKEN` | YouTube upload | Railway env | Segredo critico |
| `TIKTOK_CLIENT_KEY` | TikTok API | Railway env | Config/OAuth |
| `TIKTOK_CLIENT_SECRET` | TikTok API | Railway env | Segredo |
| `TIKTOK_REFRESH_TOKEN` | TikTok API | Railway env | Segredo critico |
| `TIKTOK_ACCESS_TOKEN` | TikTok API | Railway env | Segredo curto |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth | Railway env | Config/OAuth |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth | Railway env | Segredo |
| `LINKEDIN_AUTHOR_URN` | Autor LinkedIn | Railway env | Config |
| `META_APP_ID` | Instagram/Meta OAuth | Railway env | Config/OAuth |
| `META_APP_SECRET` | Instagram/Meta OAuth | Railway env | Segredo |
| `INSTAGRAM_REDIRECT_URI` | Instagram OAuth | Railway env | Config |
| `MARKETING_OS_TOKEN_ENCRYPTION_KEY` | Criptografia de tokens conectados | Railway env | Segredo critico |
| `CRON_SECRET` | Cron/API gated calls | Railway env | Segredo |

## Rotacao

- Rotacionar tokens de OAuth quando houver erro de refresh, troca de app ou suspeita de vazamento.
- Rotacionar `VIDEO_SIGNING_SECRET`, `CRON_SECRET` e encryption key com plano de migracao.
- Sempre atualizar inventario sem escrever o valor real.

## Links

- [[99_System/Security And Secrets Policy]]
- [[04_Areas/Coding/Checklists/Secrets And API Keys Register]]
- [[04_Areas/Coding/Checklists/Railway Secrets Inventory]]

## 99_System/Security And Secrets Policy.md

---
type: policy
tags:
  - security
  - secrets
  - second-brain
aliases:
  - Politica de seguranca e secrets do vault
  - Seguranca e secrets do vault
  - Como nao vazar credenciais no vault
---
# Security And Secrets Policy

## Resumo para recuperacao RAG

Esta nota e a politica de seguranca e secrets do vault para nao vazar credenciais. Use como fonte canonica antes de lidar com API keys, tokens, env vars, cookies, private keys, arquivos `.env`, provider secrets ou qualquer segredo operacional. O vault guarda inventario e referencias, nunca valores reais.

## Regra principal

O vault e o lugar para memoria, inventario, decisoes e referencias de credenciais. O vault nao guarda segredo real em Markdown.

Modelo canonico: [[99_System/Credential Vault Operating Model]].

## Fonte unica local: `/Users/paulopierrondi/Projects/.keys.env`

Para todos os files e automacoes locais, a fonte canonica de variaveis de ambiente e `/Users/paulopierrondi/Projects/.keys.env`, carregada via `/Users/paulopierrondi/.local/bin/brain-env-run`. Detalhes em [[99_System/Central Env File Operating Model]].

- `chmod 600` obrigatorio.
- Nunca commitar; nunca colar em chat, Markdown, Linear, screenshot, log ou email.
- Producao continua em provider env vars (Railway/Vercel/GitHub Actions), nunca neste `.env`.
- Override por projeto: `.env` local do projeto vence sobre o central.
- Scripts novos: `brain-env-run -- <comando>` em vez de `source .env` ou `python-dotenv` cru.

## Permitido no vault

- Nome de env var.
- Nome do fornecedor.
- Projeto que usa a chave.
- Ambiente: local, staging, prod.
- Local onde o valor real esta guardado.
- Data de criacao/rotacao.
- Dono/responsavel.
- Escopo/permissao da chave.
- Procedimento de revogacao.

## Proibido no vault

- Valores reais de API keys.
- Tokens de acesso ou refresh tokens.
- Senhas.
- Cookies.
- Private keys.
- Service account JSON.
- Certificados privados.
- Arquivos `.env` completos.
- Screenshots que mostrem credenciais.

## Padrao para projetos

- `/Users/paulopierrondi/Projects/.keys.env` (chmod 600) como fonte unica de variaveis compartilhadas; carregar via `brain-env-run`.
- `./.env` no diretorio do projeto apenas para overrides especificos (precedence wins).
- `.env.example` com nomes e valores falsos no repo.
- Secret manager/provider env vars para producao.
- GitHub Actions Secrets para CI.
- Nunca passar segredo para LLM quando nao for estritamente necessario.

## Regra para coders

- Default para automacoes locais: `brain-env-run -- <comando>` (carrega o `.env` central + override de projeto).
- Nao pedir Paulo para colar API key/token em chat quando houver alternativa.
- Consultar [[04_Areas/Coding/Checklists/Secrets And API Keys Register]] e usar a referencia/local de armazenamento.
- Preferir `op://...` + `op run` quando 1Password CLI estiver disponivel.
- Se o secret manager nao estiver configurado, registrar acao humana e bloquear a parte que depende do segredo.

## Quando uma key vaza

1. Revogar imediatamente no fornecedor.
2. Criar nova key com permissao minima.
3. Atualizar secret manager/provider.
4. Rodar testes/deploy necessario.
5. Registrar incidente na nota do projeto sem repetir a key.
6. Procurar e remover vazamento em logs/commits se aplicavel.

Incidente aberto: [[99_System/Secret Exposure Incident - 2026-05-19]].

## Intake local seguro

Quando 1Password CLI ainda nao estiver disponivel, usar `/Users/paulopierrondi/.local/bin/brain-secret-intake` para gravar valores novos/rotacionados no Apple Keychain. O script nao recebe segredo por argumento; ele deixa o proprio Keychain pedir o valor.

Runbook manual no vault: [[99_System/Manual Credential Intake]].

Para importacao em lote, usar arquivo temporario fora do vault:

```bash
/Users/paulopierrondi/.local/bin/brain-secret-intake import /Users/paulopierrondi/.second-brain-secrets.env --delete
```

O arquivo temporario nao deve entrar em Obsidian, Git, Linear, email ou screenshot.

## Links

- [[99_System/Central Env File Operating Model]]
- [[99_System/Credential Vault Operating Model]]
- [[99_System/Manual Credential Intake]]
- [[99_System/Secret Exposure Incident - 2026-05-19]]
- [[04_Areas/Coding/Checklists/Secrets And API Keys Register]]
- [[04_Areas/Coding/Checklists/Railway Secrets Inventory]]
- [[04_Areas/Coding/Checklists/Security Checklist]]
- [[04_Areas/Coding/Checklists/Project Checklist Hub]]

## Project Note Snapshot

---
type: project
repo_name: "career-ops"
repo_path: "/Users/paulopierrondi/Projects/career-ops"
repo_kind: "repo"
branch: "codex/career-ops-railway-app"
dirty_files: 283
remote: "https://github.com/santifer/career-ops.git"
generated_at: "2026-07-01 00:09:43"
tags:
  - project
  - git
---
# career-ops

## Estado rapido

- Path: `/Users/paulopierrondi/Projects/career-ops`
- Tipo: `node`
- Repo kind: `repo`
- Branch: `codex/career-ops-railway-app`
- Arquivos alterados agora: `283`
- Ultimo commit: `47fd403 2026-06-30 feat: persist career ops operations dashboard`
- Remote: `https://github.com/santifer/career-ops.git`
- Marcadores encontrados: `package.json, README.md, CLAUDE.md, AGENTS.md, GEMINI.md`

## Links do vault

- Indice de projetos: [[02_Projects/Projects Index]]
- Mapa de projetos: [[07_MOCs/Projects MOC]]
- Historico AI deste projeto: [[03_AI-Chats/Projects/career-ops - AI History]]
- Mapa de agentes: [[07_MOCs/AI Agents MOC]]
- Politica dos agentes: [[99_System/AI Agent Vault Policy]]
- Linear/Git tracking: [[04_Areas/Coding/Linear/Linear Git Development Tracking OS]]
- Linear project map: [[04_Areas/Coding/Linear/Linear Project Map]]

## Contexto importado do README

# Career-Ops

[English](README.md) | [Deutsch](README.de.md) | [Español](README.es.md) | [Français](README.fr.md) | [Português (Brasil)](README.pt-BR.md) | [한국어](README.ko-KR.md) | [日本語](README.ja.md) | [简体中文](README.cn.md) | [繁體中文](README.zh-TW.md) | [Українська](README.ua.md) | [Русский](README.ru.md) | [Polski](README.pl.md) | [Dansk](README.da.md) | [العربية](README.ar.md)

<p align="center">
  <a href="https://x.com/santifer"><img src="docs/hero-banner.jpg" alt="Career-Ops Multi-Agent Job Search System" width="800"></a>
</p>

<p align="center">
  <em>I spent months applying to jobs the hard way. So I engineered the system I wish I had.</em><br>
  Companies use AI to filter candidates. <strong>I just gave candidates AI to <em>choose</em> companies.</strong><br>
  <em>Now it's open source.</em>
</p>

<p align="center">
  <a href="https://trendshift.io/repositories/25195" target="_blan
...[truncated]

## Decisoes e estado vivo

- Use esta nota para manter o estado atual do projeto, decisoes abertas, comandos canonicos e riscos.
- As sessoes locais de Codex, Claude Code, Kimi e Gemini foram indexadas no vault quando estavam disponiveis em disco.

## AI History Snapshot

---
type: project-ai-history
project: "career-ops"
status: generated
generated_at: "2026-07-01 00:09:43"
tags:
  - ai-history
  - project-history
  - generated
---
# career-ops - AI History

Projeto: [[02_Projects/career-ops|career-ops]]

- Path: `/Users/paulopierrondi/Projects/career-ops`
- Codex relacionado: `168`
- Claude Code relacionado: `8`
- Kimi relacionado: `0`
- Claude-Mem observations relacionadas: `0`
- Claude-Mem summaries relacionados: `0`

## Codex

| Atualizado | Titulo | Primeiro pedido | Fonte |
| --- | --- | --- | --- |
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]
[REDACTED SECRET LINE]

## Claude Code

| Atualizado | Titulo | Primeiro pedido | Fonte |
| --- | --- | --- | --- |
| 2026-07-01T00:21:00.028Z | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | /Users/paulopierrondi/.claude/projects/-Users-paulopierrondi-Projects-career-ops/b31a800b-a9ab-4068-a6c0-b0494b37141d/subagents/workflows/wf_b0145bb1-a76/agent-a95a62e68a3adcba4.jsonl |
| 2026-07-01T00:20:53.203Z | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | /Users/paulopierrondi/.claude/projects/-Users-paulopierrondi-Projects-career-ops/b31a800b-a9ab-4068-a6c0-b0494b37141d/subagents/workflows/wf_b0145bb1-a76/agent-ab6eb9d109247b762.jsonl |
| 2026-07-01T00:20:17.418Z | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | /Users/paulopierrondi/.claude/projects/-Users-paulopierrondi-Projects-career-ops/b31a800b-a9ab-4068-a6c0-b0494b37141d/subagents/workflows/wf_b0145bb1-a76/agent-a99ca31d5569e1a71.jsonl |
| 2026-07-01T00:19:20.073Z | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | /Users/paulopierrondi/.claude/projects/-Users-paulopierrondi-Projects-career-ops/b31a800b-a9ab-4068-a6c0-b0494b37141d/subagents/workflows/wf_b0145bb1-a76/agent-adff55a82686961ce.jsonl |
| 2026-07-01T00:19:05.496Z | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | /Users/paulopierrondi/.claude/projects/-Users-paulopierrondi-Projects-career-ops/b31a800b-a9ab-4068-a6c0-b0494b37141d/subagents/workflows/wf_b0145bb1-a76/agent-a76106d3031e57f30.jsonl |
| 2026-07-01T00:18:13.821Z | You are a read-only research/design agent. Do NOT write or edit any file. Return ONLY the structured object. WHO: Paulo Pierrondi — Enterprise AI Architect / Technical GTM Operator (ServiceNow, ITOM, CMDB/CSDM, agentic automation), Sao Jose dos Campos Brazil, EU citizen, open to US rel ...[truncated] | You are a read-only research/design agent. Do NOT write or edit any file.
...[truncated]
