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
