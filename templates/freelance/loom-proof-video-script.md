# Loom de Prova - Roteiro 60-90s (perfil 0-review)

> Por que existe: em perfil frio (0 reviews), um video de 60-90s mostrando produto
> real rodando vale mais que mil palavras de bio. E o multiplicador de confianca que
> substitui a avaliacao que voce ainda nao tem.
>
> Onde usar:
> - Upwork: campo de video do perfil + anexo em proposta.
> - 99Freelas: anexo em proposta e portfolio (nao colar link em campo de texto).
> - Workana/Contra: portfolio.
> - Resposta a "voce ja entregou algo funcionando?"
>
> Regras: PT-BR, sem dado confidencial de cliente, sem secrets/tokens na tela,
> max 90s (ideal 60-75s), audio claro, sem musica. Gravar em Loom ou YouTube nao
> listado. Um video generico serve; um por categoria (WhatsApp agent, dashboard,
> landing) converte mais.

## Roteiro padrao (demo = dashboard/agent rodando com dados de exemplo)

**0-8s - Hook (ancora no resultado do comprador)**
> "Se voce quer [WhatsApp respondendo sozinho / dashboard de vendas / automacao de
> follow-up] funcionando ainda esta semana, deixa eu te mostrar algo real em 30 segundos."

**8-50s - Prova (screen-share, artefato rodando)**
> "Isso aqui nao e mockup, e um [agente de WhatsApp / dashboard / fluxo n8n] rodando.
> Repara: [mostra a entrada do lead -> qualificacao -> resposta -> passagem para humano].
> Ele usa base de conhecimento, logs, e fallback para pessoa quando nao tem certeza."

Mostre 1 artefato apenas. Nao tente mostrar tudo. O objetivo e "este cara entrega
coisa que funciona", nao "olha tudo que eu sei".

**50-75s - Metodo + risco zero**
> "Como eu trabalho: a gente fecha uma fase 1 pequena, eu te entrego o primeiro
> resultado rodando em 24-48h, e voce so avanca pra fase 2 se gostar. Escopo fechado,
> testes, documentacao e handoff pra sua equipe."

**75-90s - CTA**
> "Me conta no chat qual processo seu quer automatizar que eu te mostro como ficaria
> a primeira entrega."

## Qual demo gravar (escolha 1)

| Categoria-alvo | Demo mais forte | Onde pegar |
|---|---|---|
| WhatsApp agent / n8n / CRM | Fluxo n8n + WhatsApp com IA qualificando lead (dados fake) | `demos/freelance/` ou mock novo |
| BI / dashboard | Dashboard Streamlit/Power BI com dados de exemplo + chat | `demos/freelance/streamlit-bi-chat` |
| RAG / base de conhecimento | Chat respondendo sobre PDF/FAQ com fontes | novo, dados publicos |
| Produto completo (wow) | CantuStudio ou FaithSchool rodando | produtos em producao |

> Recomendado pra gravar PRIMEIRO: o **WhatsApp agent / n8n** — e a categoria com mais
> demanda no seu radar (maioria das 69 propostas). Segundo: **dashboard BI**.

## Como gravar em 15 min

1. Abrir o demo escolhido com dados de exemplo (NUNCA dado real de cliente).
2. Loom -> new recording -> screen + camera (ou so screen).
3. Seguir o roteiro acima, improvisando os detalhes do artefato.
4. Cortar para <= 90s. Titulo: "Como entrego [categoria] funcionando em 24-48h".
5. Salvar link. Nao publicar como publico se tiver qualquer dado sensivel.

## Anti-padroes (evitar)

- Nao falar "eu sou arquiteto / 15 anos / enterprise" no hook — perde o comprador BR
  de ticket baixo nos primeiros 5s.
- Nao mostrar codigo — comprador nao e dev.
- Nao prometer resultado garantido de Meta/WhatsApp (gate de plataforma).
- Nao passar de 90s — queda de atencao.
- Nao expor internal LLM stack (qual modelo, quantos agents) — o cliente compra
  resultado, nao infraestrutura.

## Quando anexar

- Sempre que o cliente responder / perguntar sobre experiencia.
- Em toda proposta top-fit (1 video generico serve pra varias).
- No perfil assim que a plataforma permitir video.
