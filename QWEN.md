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
