<!-- OBSIDIAN_SECOND_BRAIN_START -->
# Obsidian Second Brain - Required Preflight

Primary vault: `/Users/paulopierrondi/Documents/Obsidian Vault`
Repository: `/Users/paulopierrondi/Projects/career-ops`

This repository is part of Paulo's Obsidian second brain. For AI coding agents, this is a required workflow, not optional context.

## User Profile Snapshot

- Paulo is a ServiceNow Technical Account Executive focused on Banco Bradesco / FSI Brazil, working with Rodrigo Rezende, Joao Saes, Impact and CEG/Services.
- Core enterprise themes: Bradesco strategy, CMDB/CSDM, Now Assist/AI Agents, governance, operating model, FSI positioning and 2026 roadmap.
- Top-of-mind projects include `pptx-engine`, autonomous Claude Code agents, `exploratorio`, `investcoach_ai`, Now Assist Bradesco Operating Model and side-project monetization/IP.
- Style: direct, executive, dense, structured, copy-paste ready, no fluff or motivational tone; PT-BR for Brazil-facing content; honest analytical pushback is welcome.
- For Bradesco Now Assist content, always connect operating model -> adoption velocity -> revenue expansion.

## Agent Hub Enforcement

Before local work with terminal, patch, automation, release, ads, App Store, Linear, secrets or production, run:

```bash
/Users/paulopierrondi/agents-hub/scripts/agent-preflight.py --automation manual-codex --surface Codex --risk workspace_write --cwd "$PWD"
```

If the preflight fails or blocks on a human gate, stop and report. The source of truth is registry + scheduler + handoffs + state + health + human gates, not any individual CLI. App Store, ads, deploy/production, Git push/merge, bulk Linear and secrets require Paulo's explicit command. Automations cannot use Claude Sonnet; automated Claude requires an explicit non-Sonnet model or must stay paused.

## Context And LLM Routing Guard

Do not let operational work pass 60% context without checkpoint. If context percentage is unavailable, checkpoint after 30 minutes, 10 relevant tool calls, 3 files changed, phase change or the first complex error.

Canonical commands:

```bash
/Users/paulopierrondi/agents-hub/scripts/chat-context-guard.py checkpoint --title "..." --project "career-ops" --summary "..." --next "..."
/Users/paulopierrondi/agents-hub/scripts/llm-routing-guard.py route --task "..."
```

## Tool Usage Guard

When unsure about the right surface/tool, run:

```bash
/Users/paulopierrondi/agents-hub/scripts/tool-usage-guard.py route --task "..."
```

Use Agent Hub for preflight/handoffs/health/human gates; Obsidian for durable records; Linear connector for live issues/projects; Git/GitHub for code/diff/PR/CI; CodeGraph for structure/symbols/calls/impact before code edits; Browser/Antigravity for browser and visual QA.

## Session Journal Guard

Preflight writes an event automatically. During operational work, write heartbeats every 10 minutes, after meaningful patches, failed tests, phase changes, human gates or context checkpoints:

```bash
/Users/paulopierrondi/agents-hub/scripts/session-journal.py heartbeat --surface "<surface>" --cwd "$PWD" --summary "..." --done "..." --next "..."
/Users/paulopierrondi/agents-hub/scripts/session-journal.py close --surface "<surface>" --cwd "$PWD" --summary "..." --done "..." --next "..."
```

## Prompt Caching

- Read `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md` before high-token, recurring or multi-agent work.
- Structure prompts with a stable cacheable prefix first: Agent Hub rules, Paulo style, project context, gates, checklists and output schema.
- Put dynamic task delta last: current request, date, live status, diffs, logs, search results and screenshots.
- Never include secrets, `.env` values, cookies, private keys, provider variable dumps or `ROTATE_REQUIRED` values in a cacheable prefix.
- Report `prompt_cache.strategy`, `prefix_version`, nonsecret cache key/tag and `cached_tokens` when the provider exposes it; use `cli-prefix-layout` with null token metrics when a CLI hides telemetry.

## Mandatory Start Gate

Before planning, editing, refactoring, reviewing, or debugging:
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/Home.md` when the local vault is accessible.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Profile/Paulo Pierrondi Profile.md` for Paulo's professional/personal context, response style, ServiceNow/Bradesco context and current priorities.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/02_Projects/Projects Index.md` and the matching project note under `/Users/paulopierrondi/Documents/Obsidian Vault/02_Projects`.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/03_AI-Chats/AI Chats Index.md` and any matching project AI history note when relevant.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/AI Agent Vault Policy.md`.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md` before building prompts, handoffs, automations, reports or agent contexts.
- For multi-coder, background coder, automation, Antigravity, or work that continues later, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Agent Coder Integration OS.md` and create/update a handoff card under `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/06_Runtime/handoffs`.
- Run `brain-linear-sync` or read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Linear/Linear Git Sync Report.md` before choosing work.
- For roadmap, bug, status, priority, release, sprint/cycle, automation, product planning or backlog cleanup, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Linear/Linear Git Development Tracking OS.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Linear/Linear Project Map.md`, and the matching Linear project/issue through the Linear connector when available.
- Treat the Linear app connector as the live source of truth for projects, issues, statuses, labels, assignees, comments, cycles and project updates. The sync report is local Git metadata only.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Best Practices/Development Best Practices Hub.md` and relevant platform best-practice notes.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Checklists/Project Checklist Hub.md` and the relevant frontend/backend/platform/AI/security checklists.
- For app, site, UI, visual flow, screenshot, iOS, Android or store work, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Best Practices/App Web Quality Best Practices.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Checklists/App Web Preflight Checklist.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Checklists/Screenshots Visual QA Checklist.md`, and the relevant web/iOS/Android preflight.
- For iOS/App Store Connect/TestFlight/signing/IAP/APNS work, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Checklists/Apple Developer And App Store Connect Inventory.md` and `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Checklists/App Store Connect Upload Runbook.md` before asking for IDs, keys, CI values, provider env vars or running an upload.
- For product, monetization, app ideas, revenue, pricing, growth or side-project prioritization, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Product/Product Revenue MOC.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Product/Nightly Opportunity Engine.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Product/App Ideas Revenue Backlog.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Product/App Refinement Backlog.md`, and `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Product/Nightly Opportunity Report.md`.
- For marketing creative, social video, ElevenLabs, subtitles, LinkedIn, Shorts, TikTok, Instagram/Reels or pierrondi.dev work, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/Marketing MOC.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/Pierrondi.dev Creative Video OS.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/ElevenLabs Voice And Subtitle Workflow.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/Social Video Platform Specs 2026.md`, and `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/Creative QA Checklist.md`.
- For Apple Ads / ASA, App Store paid acquisition, ASO, CPP, paid campaigns or app marketing tuning, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/App Marketing Intelligence OS.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/Apple Ads ASA Tuning Runbook.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/App Marketing Metrics Inventory.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/App Marketing Daily Tuning Report.md`, and `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Marketing/App Marketing Tuning Backlog.md`.
- For Obsidian, second-brain, vault, agent-memory, MOC or automation improvements, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Second Brain/Second Brain Intelligence Loop.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Second Brain Intelligence Report.md`, `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Claude Code Nightly Second Brain Routine.md`, and `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Second Brain/External Source Watchlist.md`.
- For any automation, routine, scheduled job, cron, LaunchAgent, cloud runner or automatic follow-up, read `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Automation Email Policy.md` and send a completion email to `pierrondi@gmail.com`.
- Read `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Security And Secrets Policy.md` before touching auth, APIs, env vars, API keys, tokens, deploy or production config.
- For credentials, read `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Credential Vault Operating Model.md`: the vault stores inventory/references, never real secret values.
- If credentials are in scope for `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Secret Exposure Incident - 2026-05-19.md`, require rotation before use and use Keychain/secret manager/provider env vars, never chat.
- If Paulo uses `/Users/paulopierrondi/.second-brain-secrets.env` for bulk import, treat it as temporary staging outside the vault and delete it through `brain-secret-intake import ... --delete`.
- For local env vars, read `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Central Env File Operating Model.md` and use `brain-env-run -- <command>` instead of raw `source .env` or `python-dotenv` in new scripts.
- For Railway projects, read `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Checklists/Railway Secrets Inventory.md` and use `brain-railway-run -- <command>` instead of asking Paulo to paste secrets.
- Read `.brain/PROJECT_CONTEXT.md` if present. In cloud environments, treat `.brain/PROJECT_CONTEXT.md` and `.brain/CLAUDE_CLOUD_CONTEXT.md` as the available vault snapshot.

## Multi-Agent Compatibility

- `AGENTS.md` is the cross-agent contract for Codex and all local coders.
- `CLAUDE.md`, `GEMINI.md`, `KIMI.md` and `CODEX_RULES.md` must remain operationally equivalent to `AGENTS.md`; do not simplify one file and leave gates out of another.
- Google Antigravity must read both `AGENTS.md` and `GEMINI.md`; if the vault is outside Antigravity Project folders, explicitly add the vault folder or use `.brain/PROJECT_CONTEXT.md` as the safe snapshot.
- Active Background Coders: Kimi for broad scans/reports, Codex for patch/integration, Claude Code for complex/compliance, Gemini CLI for independent MCP/terminal validation, Google Antigravity for agent-first/browser/worktree/artifact orchestration.
- Cursor Background Agent remains dormant unless Paulo explicitly activates it.

## Hard Gates

- Do not store real secrets in Markdown, Linear, chat, logs, screenshots, commits or email.
- Never ask Paulo to paste API keys, tokens, passwords, cookies, OAuth credentials, private keys or production secrets in chat when a provider env var, Keychain, 1Password/op reference, `brain-secret-intake`, `brain-railway-run` or another secret manager path exists.
- Do not bulk-close, archive, delete, relabel, reassign or move Linear issues without an explicit cleanup proposal and approval.
- Do not push, merge, force-push, deploy, submit to App Store/TestFlight, change paid ads, publish social content, run production migrations, rotate secrets or change production config without Paulo's explicit command.

## Mandatory Finish Gate

After meaningful work:
- Update the matching Obsidian project note with decisions, commands, files changed, risks, deploy state, and next steps.
- Update the handoff card with status, evidence, tests, residual risk and next action when one exists.
- Update Linear when issue reality changes; do not bulk-close/archive/relabel without a cleanup proposal.
- Register screenshot/visual QA evidence paths when visual work changed, or record why screenshots were not captured.
- Register creative/video assets, scriptId/renderId, caption files, platform variants and marketing learnings when relevant.
- If the local vault is not accessible, update `.brain/SESSION_NOTES.md` with durable project knowledge that should later be synced back to Obsidian.
- Never write secrets to Markdown. Redact API keys, tokens, passwords, cookies, OAuth credentials, private keys, and production secrets.
- API keys belong in a secret manager or provider env vars. The vault stores only inventory: env var name, provider, scope, storage location, owner and rotation date.
- Automation runs must send a final email to `pierrondi@gmail.com` with status, summary, updated reports, pending decisions and failures; redact secrets before sending.
- If the session reveals a reusable development lesson, append it to `/Users/paulopierrondi/Documents/Obsidian Vault/04_Areas/Coding/Best Practices/Learning Inbox.md` or run `brain-learn`.

## CodeGraph

For structural code questions or edits, prefer CodeGraph before grep: use `codegraph_context` for task context, `codegraph_search` for symbols, `codegraph_trace` for flows, `codegraph_impact` for blast radius and `codegraph_explore` for related source. Use native grep/read for literal text only or when CodeGraph is not initialized.
<!-- OBSIDIAN_SECOND_BRAIN_END -->

<!-- HUB_COUNCIL_TRIGGER_START -->
# Hub de Agentes / Product Council - Required Coder Gate

Este projeto e gerenciado pelo Hub de Agentes de Paulo. Antes de planejar, editar, revisar, debugar, criar release, mexer em UI/UX, marketing, SEO, seguranca ou automacao, acione o Product Council.

## Start gate obrigatorio

```bash
/Users/paulopierrondi/agents-hub/scripts/project-council-touchpoint.py --project-id "career-ops" --phase start
```

Leia tambem:

- `.brain/HUB_COUNCIL_CONTEXT.md`
- `.brain/PROJECT_CONTEXT.md`
- `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/05_Configuracao/config_product_council.md`
- `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md`
- `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/03_Outputs/council_reviews/`

## Finish gate obrigatorio

```bash
/Users/paulopierrondi/agents-hub/scripts/project-council-touchpoint.py --project-id "career-ops" --phase finish --summary "<o que mudou; testes; riscos; proximos passos>"
```

## Regras

- Registry-first: estado vem de `/Users/paulopierrondi/agents-hub/registry/projects_registry.json`.
- Evidence-based: cite arquivo, linha, commit, log, URL ou report.
- No secrets: nunca grave tokens, API keys, cookies, chaves privadas, AuthKeys ou valores `.env` em Markdown.
- Prompt caching: contexto estavel primeiro, task delta por ultimo, secrets fora do prefixo cacheavel, telemetry registrada quando disponivel.
- Human-gated: deploy, push, App Store submit, ads spend, publicacao social, migrations, producao, secrets, cron e LaunchAgents exigem aprovacao explicita do Paulo.
<!-- HUB_COUNCIL_TRIGGER_END -->

<!-- BACKGROUND_CODERS_START -->
## Background Coders Protocol

Este projeto usa o modelo Background Coders embutido nos coders atuais: Codex, Claude Code, Kimi CLI, Qwen Code, Gemini CLI e Google Antigravity.

Cursor Background Agent esta dormente e nao deve ser roteado por padrao.

### Required context

Leia antes de planejar/editar:

- `.brain/BACKGROUND_CODER_CONTEXT.md`
- `.brain/HUB_COUNCIL_CONTEXT.md`
- `.brain/PROJECT_CONTEXT.md`
- `AGENTS.md`
- `GEMINI.md`
- `QWEN.md`
- `CODEX_RULES.md`
- `/Users/paulopierrondi/agents-hub/configs/CODER_RUNTIME_ENFORCEMENT.md`
- `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md`
- `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Automation Email Policy.md`

### Canonical guard commands

Antes de terminal, patch, automacao, Linear, secrets, release, App Store, ads
ou producao, rode `agent-preflight.py` via:

`/Users/paulopierrondi/agents-hub/scripts/agent-preflight.py --automation manual-coder --surface "<surface>" --risk workspace_write --cwd "$PWD" --project-id "career-ops" --source-agent "<agent>" --task "<pedido sem secrets>"`

Use estes guards quando aplicavel, sem registrar secrets:

- `/Users/paulopierrondi/agents-hub/scripts/session-journal.py heartbeat --surface "<surface>" --cwd "$PWD" --summary "<estado>" --done "<feito>" --next "<proximo>"`
- `/Users/paulopierrondi/agents-hub/scripts/chat-context-guard.py checkpoint ...` perto de 50-55% de contexto.
- `/Users/paulopierrondi/agents-hub/scripts/llm-routing-guard.py route --task "<objetivo>"` quando houver duvida de superficie/modelo.
- `/Users/paulopierrondi/agents-hub/scripts/tool-usage-guard.py route --task "<objetivo>"` quando houver duvida de ferramenta.
- `brain-env-run -- <command>` para carregar ambiente central com redacao.
- `brain-railway-run -- <command>` para comandos Railway.
- Automation Email Policy: automacoes precisam enviar email final redigido para `pierrondi@gmail.com`.
- CodeGraph antes de explicar/editar arquitetura, simbolos, impacto ou fluxo quando o indice existir.
- Automacoes nao podem usar Claude Sonnet; Claude automatizado exige modelo nao-Sonnet explicito ou fica pausado.
- Respeitar todo human gate para secrets, deploy, App Store/TestFlight, paid ads, producao, migrations, social publishing, force push, Git push/merge e bulk Linear.

### Prompt caching

Para rotinas recorrentes, contexto grande ou handoff multi-agente:

- coloque contexto estavel primeiro: Hub rules, perfil Paulo, contexto do projeto, gates e output schema;
- coloque delta dinamico por ultimo: pedido atual, data, live state, diffs, logs e web search;
- nunca cachear secrets, `.env`, cookies, private keys, AuthKeys ou `ROTATE_REQUIRED`;
- registrar `prompt_cache.strategy`, `prefix_version`, key/tag nao secreto e `cached_tokens` quando disponivel.

### Autonomous intake

Pedidos amplos do Paulo como "olha tudo", "melhore", "resolva", "evolua diariamente" ou "nao me pergunte o obvio" devem virar acao segura, nao pergunta trivial.

- Resolver projeto/superficie por `cwd`, registry, Linear, Vault, Slack mission, handoffs e AI history.
- Ler fontes vivas antes de confiar em resumo antigo.
- Executar a menor melhoria reversivel dentro do escopo atual e separar human gates como proposta.
- Perguntar Paulo so para push/merge/deploy/App Store/ads/producao/secrets/bulk Linear/destrutivo ou tradeoff irreversivel real.
- `accepted`, `started`, heartbeat e handoff vazio nao sao progresso; progresso exige artefato, validacao, patch, Linear ref, fonte viva citada ou blocker com next action.
- Para `project-id=unknown` ou `report_only`, evitar roster generico; usar coordenador minimo e agentes somente quando houver fit, artefato e stop condition.

### Routing

| Trabalho | Coder padrao | Regra |
| --- | --- | --- |
| Varredura ampla, triagem barata, relatorio, backlog, docs | Kimi CLI | read-only/report-first |
| Prototipo, scaffold, dashboard/tool estatico, draft isolado de codigo e sintese privada/local | Qwen-local / Qwen Code | Qwen-local (`qwen3:14b` via Ollama, `think=false`) para conteudo sensivel/high-volume; Qwen Code via `DASHSCOPE_API_KEY` para draft grande; Codex revisa/integra antes de mudanca relevante |
| Patch seguro, testes, integracao, validacao local | Codex | executor principal |
| Bug dificil, arquitetura, compliance, App Store/release risk | Claude Code | especialista senior |
| Checagem independente, tarefas Google/MCP, utilitario CLI, validacao terminal | Gemini CLI | usar `GEMINI.md` como memoria hierarquica; manter paridade com `AGENTS.md` |
| Orquestracao agent-first, navegador/Chrome, multi-folder/worktree, subagentes, artefatos | Google Antigravity | ler `AGENTS.md` + `GEMINI.md`; vault fora do workspace exige acesso explicito ou snapshot `.brain` |
| PR remoto via Cursor | Cursor Background Agent | dormant; somente se Paulo ativar explicitamente |

### Parallel complex work

Para tarefas complexas, paralelize frentes independentes em vez de trabalhar sequencialmente. Config canonica:

- `/Users/paulopierrondi/agents-hub/configs/coder_concurrency.yaml`
- `/Users/paulopierrondi/agents-hub/configs/PARALLEL_CODERS_OPERATING_MODEL.md`

Caps: global `6` soft / `16` hard; writers `2` soft / `3` hard; `1` writer por repo; premium `2` hard; Kimi Swarm research `8` soft / `16` hard.

Use paralelo para research, auditoria, validacao, visual/browser e arquitetura quando os escopos forem distintos. Nao use dois writers no mesmo repo. Qualquer human gate em uma subtask torna o grupo inteiro gated.

### Budget gate

Antes de iniciar background work, declarar:

- owner: `codex`, `claude`, `kimi`, `gemini` ou `antigravity`;
- registry id: `career-ops`;
- repo/projeto;
- uma tarefa ou uma issue Linear;
- artefato esperado;
- stop condition;
- human gate quando envolver secrets, deploy, App Store/TestFlight, paid ads, producao, migrations, social publishing, force push ou multi-repo.

### Branch policy

- Codex: `codex/<linear-id>-<short-task>`
- Qwen: `qwen/<linear-id>-<short-task>` quando editar repo; artefatos isolados podem ficar no output/task dir
- Claude: `claude/<linear-id>-<short-task>`
- Kimi: preferir relatorio sem branch; se editar, usar escopo explicito
- Gemini: `gemini/<linear-id>-<short-task>` quando editar codigo
- Antigravity: `antigravity/<linear-id>-<short-task>` ou worktree isolada do Project
- Cursor: nao usar sem pedido explicito do Paulo

### Slack agent comms

Todo coder/agente deve registrar evento Slack/outbox quando iniciar, aceitar, trabalhar, falar, criar output, delegar, bloquear, falhar, pedir aprovacao humana ou finalizar trabalho.

Comando canonico:

`brain-env-run -- agent-slack-bridge event --agent-id "<agent_id>" --event-type "<started|accepted|in_progress|said|created_output|handoff_created|blocked|failed|finished|needs_paulo_approval>" --project-id "career-ops" --summary "<resumo redigido>"`

Se Slack real nao estiver configurado, a fila local em `/Users/paulopierrondi/.brain/slack-queue/` cumpre a regra. Slack e visibilidade; handoff/session journal/Obsidian/Linear continuam canonicos.

### Runtime enforcement

Contrato canonico para Codex, Claude Code, Kimi CLI, Kimi Desktop/Kimi Code,
Gemini CLI, Google Antigravity, Qwen Code, automacoes e subagents:

`/Users/paulopierrondi/agents-hub/configs/CODER_RUNTIME_ENFORCEMENT.md`

Antes de terminal, patch, automacao, Linear, secrets, release, App Store, ads
ou producao, rode Agent Hub preflight. Use `workspace_write` para qualquer
coder/subagent que possa escrever arquivos, alterar repo ou rodar comandos com
efeito local. Use `report_only` apenas para pesquisa bounded/read-only.

### Handoff

Todo output deve trazer: o que mudou/encontrou, arquivos tocados/revisados, comandos/testes, risco residual, proxima acao exata e se Obsidian/Linear precisa atualizar.
<!-- BACKGROUND_CODERS_END -->

<!-- PROJECT_LOCAL_COUNCIL_START -->
## Project Local Council - Required Context

This repo has a local council overlay. It does not replace the global Product Council; it makes the global roles specific to this repo.

Before planning, editing, reviewing, testing, release, automation, Linear, secrets, UI or marketing work, read:

- `.brain/PROJECT_COUNCIL.md`
- relevant `.brain/local-agents/*.md`
- `.brain/HUB_COUNCIL_CONTEXT.md`
- `.brain/PROJECT_CONTEXT.md`
- `/Users/paulopierrondi/Documents/Obsidian Vault/99_System/Prompt Caching Workflow Policy.md` when available
- `AGENTS.md` and `GEMINI.md`

Local agents are advisory role contracts, not autonomous permission grants. They inherit all hard gates from Agent Hub, Obsidian, Linear, Automation Email Policy and Security/Secrets policy.

Required local council handoff:

- local agent(s) considered;
- decision or recommendation;
- files/commands/evidence;
- risk and human gate;
- exact next action.
- prompt_cache strategy and cache telemetry when a provider exposes `cached_tokens` or equivalent.

Registry id: `career-ops`.
<!-- PROJECT_LOCAL_COUNCIL_END -->

<!-- PAULO_OPS_SKILL_PACK_START -->
## Paulo Ops Skill Pack

Installed shared skill root: `/Users/paulopierrondi/.agents/skills`.

All coders should use the relevant `paulo-ops-*` skill whenever a task touches
Agent Hub, Vault, Linear, Git/GitHub, CodeGraph, Browser/AGY, automation,
skills/MCP, secrets, release, paid growth, App Store, production, tests,
dashboards, handoffs or multi-coder routing.

Canon:
- Manifest: `/Users/paulopierrondi/agents-hub/configs/paulo_ops_skill_pack.yaml`
- Vault note: `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/05_Configuracao/config_paulo_ops_skills.md`
- Count: `32` operational skills (`30` installer-managed, `2` preserved local).
- Antigravity/AGY is the default validator; Gemini is explicit fallback only.
- Third-party skill/MCP repos are discovery/quarantine only until reviewed.
- Relevance upgrade: use the smallest matching skill set; each skill must match
  a current trigger, live source, artifact and stop condition.

Installed skills:
`paulo-ops-preflight-gate`, `paulo-ops-human-gates`, `paulo-ops-session-journal`, `paulo-ops-slack-outbox`, `paulo-ops-vault-memory`, `paulo-ops-linear-agent-ready`, `paulo-ops-linear-coding-session`, `paulo-ops-antigravity-validation`, `paulo-ops-skills-mcp-radar`, `paulo-ops-supply-chain-quarantine`, `paulo-ops-mcp-permission-review`, `paulo-ops-codegraph-impact`, `paulo-ops-route-learning`, `paulo-ops-automation-email`, `paulo-ops-launchagent-health`, `paulo-ops-agent-baseline`, `paulo-ops-product-revenue`, `paulo-ops-app-store-release-gate`, `paulo-ops-paid-growth-gate`, `paulo-ops-secrets-central-env`, `paulo-ops-browser-visual-qa`, `paulo-ops-webapp-smoke`, `paulo-ops-frontend-quality`, `paulo-ops-github-pr-diff`, `paulo-ops-multi-coder-swarm`, `paulo-ops-learning-retro`, `paulo-ops-repo-intake-router`, `paulo-ops-dirty-worktree-triage`, `paulo-ops-test-gap-map`, `paulo-ops-operations-dashboard`, `paulo-ops-agent-flow-validation`, `paulo-ops-evolve-lab`
<!-- PAULO_OPS_SKILL_PACK_END -->

<!-- EXTERNAL_MARKETING_WEBDESIGN_SKILLS_START -->
## External Marketing/Webdesign Skills Pack

Installed shared skill root: `/Users/paulopierrondi/.agents/skills`.

All coders may use these external `external-*` skills for marketing strategy,
programmatic SEO, CRO, site architecture, product marketing, sales enablement,
web design and frontend/interface work.

Canon:
- Manifest: `/Users/paulopierrondi/agents-hub/configs/external_marketing_webdesign_skill_pack.yaml`
- Vault note: `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/05_Configuracao/config_external_marketing_webdesign_skills.md`
- Source report: `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/03_Outputs/skills_mcp_radar/2026-06-12-marketing-webdesign-skills-absorption.md`
- Count: `12` external skills.
- These skills are guidance only; Agent Hub, project `AGENTS.md`, Paulo hard
  gates, secrets policy, Vault/Linear source-of-truth and runtime enforcement
  override them.

Still human-gated: paid ads, social publishing, outbound/email/SMS, production,
deploy, push/merge, App Store/TestFlight, secrets, MCP enabling and bulk Linear.

Installed skills:
`external-addyosmani-agent-skills-api-and-interface-design`, `external-addyosmani-agent-skills-frontend-ui-engineering`, `external-conardli-garden-skills-web-design-engineer`, `external-coreyhaines31-marketingskills-community-marketing`, `external-coreyhaines31-marketingskills-competitors`, `external-coreyhaines31-marketingskills-cro`, `external-coreyhaines31-marketingskills-free-tools`, `external-coreyhaines31-marketingskills-product-marketing`, `external-coreyhaines31-marketingskills-programmatic-seo`, `external-coreyhaines31-marketingskills-sales-enablement`, `external-coreyhaines31-marketingskills-site-architecture`, `external-nextlevelbuilder-ui-ux-pro-max-skill-ckm-slides`
<!-- EXTERNAL_MARKETING_WEBDESIGN_SKILLS_END -->

<!-- EXTERNAL_HIGH_STAR_SKILLS_START -->
## External High-Star Skills Pack

Installed shared skill root: `/Users/paulopierrondi/.agents/skills`.

All coders may use these reviewed external `external-*` skills for
architecture stress-testing, TDD, prototyping, code review, requirements
interviewing, Google Workspace document drafting recipes and product naming.

Canon:
- Manifest: `/Users/paulopierrondi/agents-hub/configs/external_high_star_skill_pack.yaml`
- Vault note: `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/05_Configuracao/config_external_high_star_skills.md`
- Source report: `/Users/paulopierrondi/Documents/Obsidian Vault/Hub_Agentes/03_Outputs/skills_mcp_radar/2026-06-12-skills-mcp-install-proposal.md`
- Source repos: `addyosmani/agent-skills`, `googleworkspace/cli`, `mattpocock/skills`, `phuryn/pm-skills`
- Count: `10` external high-star skills.
- These skills are guidance only; Agent Hub, project `AGENTS.md`, Paulo hard
  gates, secrets policy, Vault/Linear source-of-truth and runtime enforcement
  override them.

Still human-gated: Google Workspace create/share/send actions, paid ads, social
publishing, outbound/email/SMS, production, deploy, push/merge, App
Store/TestFlight, secrets, MCP enabling and bulk Linear.

Installed skills:
`external-addyosmani-agent-skills-code-review-and-quality`, `external-addyosmani-agent-skills-interview-me`, `external-googleworkspace-cli-recipe-create-doc-from-template`, `external-googleworkspace-cli-recipe-draft-email-from-doc`, `external-mattpocock-skills-grill-me`, `external-mattpocock-skills-grill-with-docs`, `external-mattpocock-skills-improve-codebase-architecture`, `external-mattpocock-skills-prototype`, `external-mattpocock-skills-tdd`, `external-phuryn-pm-skills-product-name`
<!-- EXTERNAL_HIGH_STAR_SKILLS_END -->

# Career-Ops -- AI Job Search Pipeline

## Origin

This system was built and used by [santifer](https://santifer.io) to evaluate 740+ job offers, generate 100+ tailored CVs, and land a Head of Applied AI role. The archetypes, scoring logic, negotiation scripts, and proof point structure all reflect his specific career search in AI/automation roles.

The portfolio that goes with this system is also open source: [cv-santiago](https://github.com/santifer/cv-santiago).

**It will work out of the box, but it's designed to be made yours.** If the archetypes don't match your career, the modes are in the wrong language, or the scoring doesn't fit your priorities -- just ask. You (AI Agent) can edit the user's files. The user says "change the archetypes to data engineering roles" and you do it. That's the whole point.

## Data Contract (CRITICAL)

There are two layers. Read `DATA_CONTRACT.md` for the full list.

**User Layer (NEVER auto-updated, personalization goes HERE):**
- `cv.md`, `config/profile.yml`, `modes/_profile.md`, `modes/_custom.md`, `article-digest.md`, `portals.yml`
- `data/*`, `reports/*`, `output/*`, `interview-prep/*`

**System Layer (auto-updatable, DON'T put user data here):**
- `modes/_shared.md`, `modes/oferta.md`, all other modes
- `CLAUDE.md`, `*.mjs` scripts, `dashboard/*`, `templates/*`, `batch/*`

**THE RULE: When the user asks to customize anything, write to the USER layer, NEVER to a system file — that is what survives `node update-system.mjs`.**
- **Profile / evaluation content** (archetypes, narrative, negotiation scripts, proof points, location policy, comp targets) → `modes/_profile.md` or `config/profile.yml`.
- **Procedural rules** (house rules, custom workflows, output preferences, "always/never do X" automations) → `modes/_custom.md` (create it from `modes/_custom.template.md` if missing).
- **NEVER** edit `modes/_shared.md`, `CLAUDE.md`, or any other system file for user-specific content — those get overwritten on update.

## Source-of-Truth Boundary (CRITICAL)

User-facing content (CV, cover letters, form answers, recruiter outreach, application form responses) is generated **exclusively** from these files plus statements the user makes directly in the current conversation:

- `cv.md`
- `article-digest.md`
- `config/profile.yml`
- `modes/_profile.md`
- `writing-samples/`
- `voice-dna.md` (voice/style only — governs *how* text reads, never introduces factual claims)
- `interview-prep/story-bank.md` and `interview-prep/{company}-{role}.md` (the user's own STAR stories and interview-prep notes — same trust level as `cv.md`; consumed by the `interview` and `apply`/`match-star` modes)

Anything not in this list is **out of scope for content generation**, including:

- Auto-memory at `~/.claude/projects/.../memory/` — see scope clarification below
- Any directory outside the career-ops project — for example, parent-directory repos containing the user's product code, sibling project directories, or other unrelated codebases on the same machine
- Cross-session inferences about the user's work that have not been written into one of the in-scope files
- Knowledge from other Claude Code projects on the same machine

**Rule from the original design (santifer's case study):** *"Keywords get reformulated, never fabricated."* Reorder, reframe, emphasise — but never invent. If a claim isn't backed by an in-scope file, ask the user. If they cannot or do not want to add it, the output goes without it. Silence on a topic is fine; manufactured detail is not.

**Authorship claims are non-negotiable.** Never claim the user authored a project, repo, library, tool, framework, or open-source artefact unless explicitly attributed to them in `cv.md` or `article-digest.md`. Tool-of-trade conflation (the user uses X → the user built X) is the most common fabrication pattern and is explicitly forbidden.

### Auto-memory scope (clarification, not exception)

The auto-memory layer at `~/.claude/projects/.../memory/` is reserved for **behavioural steering only**:

- User preferences (style, tone, formatting, communication cadence)
- Process rules and corrections (don't do X, always do Y)
- Operational state (active relationships, applied roles, observed patterns, outcome learnings)
- External references (where to find things in other systems)

Auto-memory **never** holds content claims about the user's work, technical accomplishments, authorship, or anything that would appear verbatim or near-verbatim in CV/cover output. If a fact belongs in user-facing content, it lives in the user-layer files, not in memory.

### Where rules live

Rules belong in files the harness reads automatically — `CLAUDE.md`, `AGENTS.md`, `modes/*.md`, `MEMORY.md`. Do not create sidecar documentation that requires manual loading. Reinforcement-without-enforcement decays.

## Update Check

On the first message of each session, run the update checker silently:

```bash
node update-system.mjs check
```

Parse the JSON output:
- `{"status": "update-available", "local": "1.0.0", "remote": "1.1.0", "changelog": "..."}` → tell the user:
  > "career-ops update available (v{local} → v{remote}). Your data (CV, profile, tracker, reports) will NOT be touched. Want me to update?"
  If yes → run `node update-system.mjs apply`. If no → run `node update-system.mjs dismiss`.
- `{"status": "up-to-date"}` → say nothing
- `{"status": "dismissed"}` → say nothing
- `{"status": "offline"}` → say nothing
- `{"status": "no-remote-version"}` → say nothing (checker reached GitHub but neither VERSION nor the latest release tag parsed as semver — treat as a silent non-failure, same as offline)

The user can also say "check for updates" or "update career-ops" at any time to force a check.
To rollback: `node update-system.mjs rollback`

## What is career-ops

AI-powered job search automation built on Claude Code: pipeline tracking, offer evaluation, CV generation, portal scanning, batch processing.

### Main Files

| File | Function |
|------|----------|
| `data/applications.md` | Application tracker |
| `data/pipeline.md` | Inbox of pending URLs |
| `data/scan-history.tsv` | Scanner dedup history |
| `portals.yml` | Query and company config |
| `templates/cv-template.html` | HTML template for CVs |
| `templates/cv-template.tex` | LaTeX/Overleaf template for CVs |
| `generate-pdf.mjs` | Playwright: HTML to PDF |
| `generate-latex.mjs` | LaTeX CV validator + pdflatex compiler |
| `article-digest.md` | Compact proof points from portfolio (optional) |
| `interview-prep/story-bank.md` | Accumulated STAR+R stories across evaluations |
| `interview-prep/{company}-{role}.md` | Company-specific interview intel reports |
| `analyze-patterns.mjs` | Pattern analysis script (JSON output) |
| `followup-cadence.mjs` | Follow-up cadence calculator (JSON output) |
| `data/follow-ups.md` | Follow-up history tracker |
| `scan.mjs` | Zero-token portal scanner — hits Greenhouse/Ashby/Lever APIs directly, zero LLM cost |
| `check-liveness.mjs` | Job posting liveness checker |
| `liveness-core.mjs` | Shared liveness logic (expired signals win over generic Apply text) |
| `reports/` | Evaluation reports (format: `{###}-{company-slug}-{YYYY-MM-DD}.md`). Blocks A-F + G (Posting Legitimacy), plus `## Machine Summary` YAML for downstream scripts. Header includes `**Legitimacy:** {tier}`. |

### OpenCode, Antigravity CLI & Grok Build CLI Commands

[OpenCode](https://opencode.ai), Antigravity CLI, and Grok Build CLI natively support the open agent skill standard (`agentskills.io`).

Instead of registering individual `.toml` files for every slash command, all subcommands are routed through the single unified skill defined in `.agents/skills/career-ops/SKILL.md`.

You can invoke the command center or any of its modes directly within your CLI:

* `/career-ops` (Shows the Command Center menu)
* `/career-ops {JD text or URL}` (Runs the auto-evaluation pipeline)
* `/career-ops [subcommand]` (Runs a specific subcommand)

#### Subcommands:
* `pipeline` — Process pending URLs from inbox
* `scan` — Scan job portals for new offers
* `tracker` — Show application status overview
* `pdf` — Generate ATS-optimized CV PDF
* `latex` — Export CV as LaTeX/Overleaf .tex
* `cover` — Generate cover letter
* `interview-prep` — Generate interview preparation guide
* `interview` — Onboarding/on-demand interview
* `contacto` — Generate LinkedIn outreach message
* `deep` — Execute deep company research
* `training` — Evaluate course/cert against North Star
* `project` — Evaluate portfolio project idea
* `batch` — Run parallel batch evaluations
* `patterns` — Analyze rejection patterns
* `followup` — Update and calculate follow-ups
* `update` — Update system files

All `modes/*` files and prompt contexts are shared across Claude Code, OpenCode, Antigravity CLI, and Grok Build CLI. `GEMINI.md` remains only as a legacy no-op guard so Antigravity does not duplicate the full project instructions.

### First Run — Onboarding (IMPORTANT)

**Before doing ANYTHING else, check if the system is set up.** On the first message of each session, run the cold-start check — one deterministic source of truth (this doc and `doctor.mjs` share the same prerequisite list, so they can never drift):

```bash
node doctor.mjs --json
```

Output: `{"onboardingNeeded": <bool>, "missing": [...], "warnings": [...]}`, where `missing` lists whichever of `cv.md`, `config/profile.yml`, `modes/_profile.md`, `portals.yml` are absent. `warnings` is reserved for non-blocking setup signals.

If `modes/_profile.md` is missing, copy from `modes/_profile.template.md` silently. This is the user's customization file — it will never be overwritten by updates.

If `modes/_custom.md` is missing, copy from `modes/_custom.template.md` silently — it holds the user's house rules / custom workflows / automations and is likewise never overwritten by updates.

**If, after that, `onboardingNeeded` is still true (any of `cv.md` / `config/profile.yml` / `portals.yml` is missing), enter onboarding mode.** Do NOT proceed with evaluations, scans, or any other mode until the basics are in place. Guide the user step by step:

#### Step 1: CV (required)
If `cv.md` is missing, ask:
> "I don't have your CV yet. You can either:
> 1. Paste your CV here and I'll convert it to markdown
> 2. Paste your LinkedIn URL and I'll extract the key info
> 3. Tell me about your experience and I'll draft a CV for you
>
> Which do you prefer?"

Create `cv.md` from whatever they provide. Make it clean markdown with standard sections (Summary, Experience, Projects, Education, Skills).

#### Step 2: Profile (required)
If `config/profile.yml` is missing, copy from `config/profile.example.yml` and then ask:
> "I need a few details to personalize the system:
> - Your full name and email
> - Your location and timezone
> - What roles are you targeting? (e.g., 'Senior Backend Engineer', 'AI Product Manager')
> - Your salary target range
>
> I'll set everything up for you."

Fill in `config/profile.yml` with their answers. For archetypes and targeting narrative, store the user-specific mapping in `modes/_profile.md` or `config/profile.yml` rather than editing `modes/_shared.md`.

#### Step 3: Portals (recommended)
If `portals.yml` is missing:
> "I'll set up the job scanner with 45+ pre-configured companies. Want me to customize the search keywords for your target roles?"

Copy `templates/portals.example.yml` → `portals.yml`. If they gave target roles in Step 2, update `title_filter.positive` to match.

#### Step 4: Tracker
If `data/applications.md` doesn't exist, create it:
```markdown
# Applications Tracker

| # | Date | Company | Role | Score | Status | PDF | Report | Notes |
|---|------|---------|------|-------|--------|-----|--------|-------|
```

#### Step 5: Get to know the user (important for quality)

After the basics are set up, proactively ask for more context. The more you know, the better your evaluations will be:

> "The basics are ready. But the system works much better when it knows you well. Can you tell me more about:
> - What makes you unique? What's your 'superpower' that other candidates don't have?
> - What kind of work excites you? What drains you?
> - Any deal-breakers? (e.g., no on-site, no startups under 20 people, no Java shops)
> - Your best professional achievement — the one you'd lead with in an interview
> - Any projects, articles, or case studies you've published?
>
> The more context you give me, the better I filter. Think of it as onboarding a recruiter — the first week I need to learn about you, then I become invaluable."

Store any insights the user shares in `config/profile.yml` (under narrative), `modes/_profile.md`, or in `article-digest.md` if they share proof points. Do not put user-specific archetypes or framing into `modes/_shared.md`.

**After every evaluation, learn.** If the user says "this score is too high, I wouldn't apply here" or "you missed that I have experience in X", update your understanding in `modes/_profile.md`, `config/profile.yml`, or `article-digest.md`. The system should get smarter with every interaction without putting personalization into system-layer files.

#### Step 6: Ready
Once all files exist, confirm:
> "You're all set! You can now:
> - Paste a job URL to evaluate it
> - Run `/career-ops scan` to search portals
> - Run `/career-ops` to see all commands
>
> Everything is customizable — just ask me to change anything.
>
> Tip: Having a personal portfolio dramatically improves your job search. If you don't have one yet, the author's portfolio is also open source: github.com/santifer/cv-santiago — feel free to fork it and make it yours."

Then suggest automation:
> "Want me to scan for new offers automatically? I can set up a recurring scan every few days so you don't miss anything. Just say 'scan every 3 days' and I'll configure it."

If the user accepts, use the `/loop` or `/schedule` skill (if available) to set up a recurring `/career-ops scan`. If those aren't available, suggest adding a cron job or remind them to run `/career-ops scan` periodically.

### Personalization

This system is designed to be customized by YOU (AI Agent). When the user asks you to change archetypes, translate modes, adjust scoring, add companies, or modify negotiation scripts -- do it directly. You read the same files you use, so you know exactly what to edit.

**Common customization requests:**
- "Change the archetypes to [backend/frontend/data/devops] roles" → edit `modes/_profile.md` or `config/profile.yml`
- "Translate the modes to English" → edit all files in `modes/`
- "Add these companies to my portals" → edit `portals.yml`
- "Update my profile" → edit `config/profile.yml`
- "Change the CV template design" → edit `templates/cv-template.html`
- "Adjust the scoring weights" → edit `modes/_profile.md` for user-specific weighting, or edit `modes/_shared.md` and `batch/batch-prompt.md` only when changing the shared system defaults for everyone

### Language Modes

Default modes are in `modes/` (English). Language-specific modes live in `modes/{lang}/` — each has `_shared.md`, the eval/apply/`pipeline.md` modes, and a `README.md` documenting that market's vocabulary:

| Language | Dir | Markets |
|----------|-----|---------|
| German | `modes/de/` | DACH (Germany, Austria, Switzerland) |
| French | `modes/fr/` | France, Belgium, Switzerland, Luxembourg, Quebec |
| Japanese | `modes/ja/` | Japan |

**When to use a `{lang}` mode** — if any holds: the user says "use {lang} modes"; `config/profile.yml` sets `language.modes_dir: modes/{lang}`; or you detect a {lang} JD (then suggest switching). Read from `modes/{lang}/` instead of `modes/`.

**When NOT to:** if the user applies to English-language roles — even at French, German, or Japanese companies — use the default English modes.

### Skill Modes

| If the user... | Mode |
|----------------|------|
| Pastes JD or URL | auto-pipeline (evaluate + report + PDF + tracker) |
| Asks to evaluate offer | `oferta` |
| Asks to compare offers | `ofertas` |
| Wants LinkedIn outreach | `contacto` |
| Asks for company research | `deep` |
| Preps for interview at specific company | `interview-prep` |
| Wants interactive profile/CV onboarding | `interview` |
| Wants to generate CV/PDF | `pdf` |
| Evaluates a course/cert | `training` |
| Evaluates portfolio project | `project` |
| Asks about application status | `tracker` |
| Fills out application form | `apply` |
| Searches for new offers | `scan` |
| Processes pending URLs | `pipeline` |
| Batch processes offers | `batch` |
| Asks about rejection patterns or wants to improve targeting | `patterns` |
| Asks about follow-ups or application cadence | `followup` |

### CV Source of Truth

- `cv.md` in project root is the canonical CV
- `article-digest.md` has detailed proof points (optional)
- **NEVER hardcode metrics** -- read them from these files at evaluation time

---

## Ethical Use -- CRITICAL

**This system is designed for quality, not quantity.** The goal is to help the user find and apply to roles where there is a genuine match -- not to spam companies with mass applications.

- **NEVER submit an application without the user reviewing it first.** Fill forms, draft answers, generate PDFs -- but always STOP before clicking Submit/Send/Apply. The user makes the final call.
- **Strongly discourage low-fit applications.** If a score is below 4.0/5, explicitly recommend against applying. The user's time and the recruiter's time are both valuable. Only proceed if the user has a specific reason to override the score.
- **Quality over speed.** A well-targeted application to 5 companies beats a generic blast to 50. Guide the user toward fewer, better applications.
- **Respect recruiters' time.** Every application a human reads costs someone's attention. Only send what's worth reading.

---

## Offer Verification -- MANDATORY

Verify a posting is still live before applying — using the cheapest check that works (a false "expired" is worse than a slow check: it makes the user miss a real job):

1. **ATS-hosted postings (Greenhouse, Lever, ...) — API first, zero tokens:** run `node check-liveness.mjs <url>`. It hits the posting's public ATS JSON API directly (no browser, no tokens) and reports `active`/`expired`, falling back to a browser only when the API is inconclusive. A definitive `expired` from the API is authoritative.
2. **Non-ATS pages, or when the API is inconclusive — Playwright:** `browser_navigate` to the URL + `browser_snapshot`. Only footer/navbar without JD = closed; title + description + Apply = active.

**NEVER decide liveness from a bare WebSearch/WebFetch snippet** — use `check-liveness.mjs` (which does the API rung) or Playwright.

**Exception for batch workers (`claude -p`):** Playwright is unavailable in headless pipe mode. The API rung above still works for ATS postings; for non-ATS pages use WebFetch as a fallback and mark the report header `**Verification:** unconfirmed (batch mode)`.

---

## CI/CD and Quality

- **GitHub Actions** run on every PR: `test-all.mjs` (63+ checks), auto-labeler (risk-based: 🔴 core-architecture, ⚠️ agent-behavior, 📄 docs), welcome bot for first-time contributors
- **Branch protection** on `main`: status checks must pass before merge. No direct pushes to main (except admin bypass).
- **Dependabot** monitors npm, Go modules, and GitHub Actions for security updates
- **Contributing process**: issue first → discussion → PR with linked issue → CI passes → maintainer review → merge

## Community and Governance

- **Code of Conduct**: Contributor Covenant 2.1 with enforcement actions (see `CODE_OF_CONDUCT.md`)
- **Governance**: BDFL model with contributor ladder — Participant → Contributor → Triager → Reviewer → Maintainer (see `GOVERNANCE.md`)
- **Security**: private vulnerability reporting via email (see `SECURITY.md`)
- **Support**: help questions go to Discord/Discussions, not issues (see `SUPPORT.md`)
- **Discord**: https://discord.gg/8pRpHETxa4

## Stack and Conventions

- Node.js (mjs modules), Playwright (PDF + scraping), YAML (config), HTML/CSS (template), Markdown (data), Canva MCP (optional visual CV)
- Scripts in `.mjs`, configuration in YAML
- Output in `output/` (gitignored), Reports in `reports/`
- JDs in `jds/` (referenced as `local:jds/{file}` in pipeline.md)
- Batch in `batch/` (gitignored except scripts and prompt)
- Report numbering: sequential 3-digit zero-padded, max existing + 1
- **RULE: After each batch of evaluations, run `node merge-tracker.mjs`** to merge tracker additions and avoid duplications.
- **RULE: NEVER create new entries in applications.md if company+role already exists.** Update the existing entry.

### TSV Format for Tracker Additions

Write one TSV file per evaluation to `batch/tracker-additions/{num}-{company-slug}.tsv`. Single line, 9 tab-separated columns:

```
{num}\t{date}\t{company}\t{role}\t{status}\t{score}/5\t{pdf_emoji}\t[{num}](reports/{num}-{slug}-{date}.md)\t{note}
```

**Column order (IMPORTANT -- status BEFORE score):**
1. `num` -- sequential number (integer)
2. `date` -- YYYY-MM-DD
3. `company` -- short company name
4. `role` -- job title
5. `status` -- canonical status (e.g., `Evaluated`)
6. `score` -- format `X.X/5` (e.g., `4.2/5`)
7. `pdf` -- `✅` or `❌`
8. `report` -- markdown link, always written **root-relative**: `[num](reports/...)`
9. `notes` -- one-line summary

**Note:** In applications.md, score comes BEFORE status. The merge script handles this column swap automatically.

**Report link normalization:** The TSV always carries a **root-relative** `[num](reports/...)` link. `merge-tracker.mjs` rewrites it so the link is relative to the tracker file's own directory before writing it into the tracker — `../reports/...` when the tracker is at `data/applications.md`, or `reports/...` at the root layout. This keeps links clickable from the tracker (markdown links resolve relative to the file that contains them). Normalization is idempotent. To fix links in an existing tracker, run `node merge-tracker.mjs --migrate` (see #760).

### Pipeline Integrity

1. **NEVER edit applications.md to ADD new entries** -- Write TSV in `batch/tracker-additions/` and `merge-tracker.mjs` handles the merge.
2. **YES you can edit applications.md to UPDATE status/notes of existing entries.**
3. All reports MUST include `**URL:**` in the header (between Score and PDF). Include `**Legitimacy:** {tier}` (see Block G in `modes/oferta.md`).
4. All statuses MUST be canonical (see `templates/states.yml`).
5. Health check: `node verify-pipeline.mjs`
6. Normalize statuses: `node normalize-statuses.mjs`
7. Dedup: `node dedup-tracker.mjs`

### Canonical States (applications.md)

**Source of truth (full descriptions + aliases):** `templates/states.yml`. The 8 canonical states (use exactly one): `Evaluated` · `Applied` · `Responded` · `Interview` · `Offer` · `Rejected` · `Discarded` · `SKIP`.

**RULES:** no markdown bold (`**`), no dates (those go in the date column), no extra text (use the notes column) in the status field.
@AGENTS.md
<!-- Add anything Claude Code specific that other agents don't need -->
