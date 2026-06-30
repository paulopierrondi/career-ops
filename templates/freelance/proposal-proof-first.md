# Proposta Prova-First (cold-start / conversa viva)

> Use esta quando: (a) perfil 0-review, (b) cliente respondeu e esta quente, ou
> (c) proposta top-fit onde prova vence competicao. Ela substitui o template
> generico quando o objetivo e CONVERTER, nao so informar.
>
> Diferenca vs `proposal-winning-short.md`: adiciona 3 trust moves explicitos para
> perfil frio — (1) referencia de prova publica, (2) risk-reversal ("so paga fase 2
> se gostar"), (3) oferta de artefato visivel anexado. Corta credencial-first.

## Template

Oi, {{client_first_name}},

Li seu projeto **{{title}}**. O ponto critico nao e "{{generic_solution}}" — e
**{{diagnosis}}**. E eu te mostro a solucao antes de voce comprometer o budget.

**Prova rapida:** tenho produtos meus rodando em producao com IA, automacao e
integracoes (posso te mandar um video curto mostrando um exemplo do que entrego).
Para o seu caso, eu comecaria entregando **{{first_visible_result}}** funcionando em
**{{first_visible_result_time}}** — voce valida o resultado real antes de pagar a fase 2.

Entrega em {{delivery_count}} passos:
1. {{deliverable_1}}
2. {{deliverable_2}}
3. {{deliverable_3}}

Mantenho o escopo fechado em **{{scope_boundary}}** para nao virar projeto aberto: logs,
testes, documentacao e handoff inclusos. Sem credenciais ou dados sensiveis antes de
contrato e acesso seguro.

Proposta de entrada: **{{net_price}} liquido**, **{{timeline}}**.
Fase 2 (so se voce gostar da primeira): {{phase_2_or_retainer}}.

Antes de comecar, so preciso confirmar: {{question_1}} e {{question_2}}?

Resumo: cortar escopo, nao qualidade — primeira entrega menor, mas com prova,
teste e proximo passo claro.

## Por que cada linha existe (guia do agente)

| Linha | Funcao |
|---|---|
| "ponto critico nao e X — e Y" | Mostra que leu o projeto e entende a dor real (nao e template). |
| "te mostro a solucao antes de comprometer o budget" | Risk-reversal — resolve a objeccao #1 de perfil 0-review. |
| "tenho produtos meus rodando em producao" | Prova publica sem vazar link (99Freelas proibe link em proposta?). |
| "posso te mandar um video curto" | Gancho pro Loom (ver `loom-proof-video-script.md`). |
| "valida antes de pagar a fase 2" | Reduz risco a zero — principal alavanca de conversao fria. |
| "escopo fechado em X" | Sinaliza controle, profissionalismo; evita escopo aberto. |
| "sem credenciais antes de contrato" | Sinaliza seguranca/governanca — diferencial real do Paulo. |
| 2 perguntas no fim | Gera resposta (call-to-conversation), nao so call-to-buy. |

## Regras de uso

- 1 proposta = 1 diagnostico especifico lido do briefing. NUNCA reusar diagnostico
  generico — comprador percebe e perde.
- Price: use a faixa da politica (`config/freelance-radar.yml` pricing_policy), mas o
  argumento de venda aqui e PROVA + RISCO ZERO, nao preco baixo. Preco baixo sozinho
  nao converte perfil 0-review (ver perdas #17, #23, #53).
- Anexar o Loom quando o cliente responder/perguntar sobre experiencia.
- PT-BR com acento para mercado BR; EN para Upwork/global.
- Nao expor internal LLM stack — cliente compra resultado, nao infraestrutura.

## Proof Asset Selection

Pick one proof asset that matches the buyer's pain. Do not attach every asset.

| Buyer pain | Best proof | How to cite it |
|---|---|---|
| AI dashboard, pipeline, CRM cockpit, internal tool, RevOps, proposal/pricing workflow | AgentOps Deal Desk | "Tenho um proof recente: um dashboard de IA submetido no Contra que prioriza oportunidades por score, budget, risco e proximo passo." |
| B2B revenue ops, CRM, lead qualification, follow-up, commercial process | AgenticosCore | "Tenho produto proprio de RevOps com diagnostico, CRM, playbooks, follow-up, gates humanos e cockpit de KPIs." |
| SaaS/app MVP, education workflow, reports, subscriptions, mobile-first UX | FaithSchool | "Tenho SaaS web/iOS proprio com dados, relatorios, notificacoes, billing e assistente de IA." |
| AI product, export files, backend, validation logic, app delivery | CantuStudio | "Tenho app de IA publicado para harmonizacao SATB, com backend, validacao e exportacao MusicXML/MIDI/PDF." |
| WhatsApp/CRM/BI/ERP proof | Existing demo pack | Use the matching fake-data demo from `data/freelance-opportunity-learning.md` proof inventory. |

Rule: proof should make the first paid slice feel lower-risk. If the proof does not reduce perceived risk for that exact buyer, omit it.

## Quando NAO usar

- Job de ticket alto em Upwork/global onde senioridade e vantagem — la use
  `upwork-proposals.md` (credential e provada por historico/portfolio, nao por review).
- Job fora do fit (SCORE < 3) — nao proponha.
