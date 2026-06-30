# Freelance Opportunity Learning Matrix

Updated: 2026-06-29

Purpose: turn freelance marketplace scopes into reusable delivery intelligence for Paulo's agents. This file stores only public or platform-safe scope metadata. Do not add passwords, cookies, tokens, client private messages, payment data, raw PII or confidential client files.

## Operating Rule

Each serious opportunity must answer four questions:

1. What does the market keep asking for?
2. What exact delivery playbook would make Paulo faster than the client expects?
3. What reusable assets should exist before Paulo wins the job?
4. Is Paulo ready now, or what must be built/researched next?

## Speed-First Rule

Default stance after 2026-06-19: be cheaper and faster by selling the smallest useful first slice. Paulo's internal AI/tool advantage should compress research, proposal writing, delivery planning, demo creation and QA, but client-facing language should present only professional outcomes, speed, proof, scope control and price. It must not create spam, unsafe automation or off-platform contact.

For every serious opportunity, extract:

1. fastest safe first result;
2. same-day/24-48h proof if possible;
3. minimum viable paid scope;
4. phase-2 upsell;
5. reusable demo/checklist needed to make the next bid faster.

## Readiness Scoring

| Score | Meaning | Required action |
|---:|---|---|
| 5 | Ready to deliver with existing knowledge, snippets and tools | Use current proposal/delivery pack |
| 4 | Ready with light setup or client-specific docs | Create checklist or starter before kickoff |
| 3 | Winnable, but delivery has a missing adapter, policy, tool or proof | Build a prep asset within 24-48h |
| 2 | Interesting but risky or underspecified | Research first; propose diagnostic only |
| 1 | Do not pursue now | Avoid or park until capability exists |

## Capability Themes Observed

| Theme | Market signal | Core tools / stack | Reusable delivery assets to prepare | Readiness | Gap to close |
|---|---|---|---|---:|---|
| ERP API + Claude/Anthropic | Clients want LLMs connected to ERP data through REST/JSON, with safe auth and controlled actions | Anthropic Claude API, REST/JSON, OAuth/API keys, OpenAPI/Postman, Node.js or Python, sandbox data, logs | ERP-Claude discovery checklist, API auth checklist, JSON schema response template, safe read/write permission matrix, handoff/runbook; see `templates/freelance/checklist-erp-claude.md` and `demos/freelance/erp-claude-json` | 5 | Local no-secret demo created; next gap is swapping mock adapter for client-approved secure provider call after contract |
| Native Claude/Anthropic agent bundle without automation platforms | 2026-06-24 99Freelas #102 asked for four native Claude/Anthropic agents without n8n/Make/Zapier: WhatsApp/Instagram lead agent, video editing, social publishing and Meta Ads reporting | Anthropic Claude API, Node.js, Supabase, WhatsApp provider risk review, official Meta/Instagram Graph API, Meta Marketing API, approval queues, logs, local/client machine deployment | Native Claude agent intake checklist, API permission matrix, WhatsApp provider risk note, video-agent workflow options, Instagram publishing policy checklist, Meta Ads reporting schema, first-agent acceptance test | 3 | Build a no-secret native-Claude agent bundle checklist and fake Node/Supabase/Meta reporting skeleton before selling full four-agent implementation; keep first paid phase limited to one working agent plus blueprint |
| n8n/Evolution API/OpenAI WhatsApp agent | Clients need broken or partial WhatsApp AI agents stabilized quickly | n8n, Evolution API, OpenAI/Anthropic, webhook testing, WhatsApp provider constraints, logs, fallback human routing | n8n debugging checklist, Evolution API health checklist, prompt/fallback template, test conversation script; see `templates/freelance/checklist-n8n-evolution-whatsapp-agent.md` | 5 | Stabilization checklist created; next gap is optional reusable sample n8n workflow |
| n8n VPS/Docker/Evolution infrastructure repair | 2026-06-21 99Freelas apply pass found two narrow, urgent VPS/Docker/n8n/Evolution fixes where minimum-price 1-day bids fit better than broad automation consulting | Docker, Docker Compose, n8n, Evolution API, PostgreSQL dump/restore, VPS/Hostinger, Linux networking, shared bridge networks, internal hostnames, env/ports/persistence, curl/wget tests | VPS/Docker migration checklist, Docker network diagnostic checklist, Evolution API POST validation script, rollback/backup checklist; see `templates/freelance/checklist-n8n-vps-docker-evolution.md` | 5 | Checklist created; next optional gap is a fake Docker Compose lab with n8n + mock Evolution endpoint |
| Productized n8n workflow templates | Workana buyers are asking for plug-and-play n8n JSON workflows for course bonuses and internal enablement, including WhatsApp/Evolution, OpenAI extraction, Google Sheets CRM/finance tabs and a simple install tutorial for non-technical users | n8n, Evolution API or approved WhatsApp provider, OpenAI, Google Sheets, global variables, webhook validation, error branches, install video/script | Productized workflow packaging checklist, global-variable map, credential placeholder convention, invalid-input fallback tests, install tutorial outline, template licensing/ownership notes | 4 | Create a no-secret template packaging checklist and sample fake-data workflow manifest before bidding on course-bonus/template projects |
| WhatsApp document routing to Google Drive | 2026-06-24 public 99Freelas page `Configurar automacao WhatsApp - Google Drive com Evolution API e n8n` asks to install Evolution API and n8n on a VPS, integrate WhatsApp with Google Drive and implement two documented flows | n8n, Evolution API or WhatsApp Cloud API, Google Drive API/OAuth, VPS/Docker, webhook file payloads, folder permissions, logs, retry/idempotency controls | WhatsApp file-routing checklist, Drive folder permission template, file naming convention, duplicate-webhook test plan, provider risk note; see `templates/freelance/checklist-whatsapp-drive-document-routing.md` | 4 | Checklist created; next gap is a fake-data n8n workflow manifest that saves sample WhatsApp files to a mock Drive adapter and validates duplicate delivery |
| Production n8n + WhatsApp Cloud operations | 2026-06-24 public Workana scan surfaced `Lanzamiento de servicios por n8n`, asking for WhatsApp Cloud API, n8n Cloud, payment processor, Google Workspace, qa/prod flows, logs, retries, correlation IDs, alerts, latency/stability tests, idempotency and auditability | n8n Cloud, WhatsApp Cloud API, payment processor APIs, Google Workspace, webhook signatures, queue/retry logic, correlation IDs, alerting, QA/prod separation, runbooks | Production n8n observability checklist, qa/prod release checklist, retry/idempotency pattern, correlation-id logging schema, payment-boundary risk checklist, latency/stability test plan; see `templates/freelance/checklist-production-n8n-operations.md` | 4 | Checklist created; next gap is a fake webhook test harness/demo with payment event replay, duplicate webhook delivery and retry/idempotency validation |
| Microsoft 365 recruiting workflow | 99Freelas buyer asked for a recruitment operating flow inside Microsoft 365 Business Basic, with mandatory POC, external candidate forms, email-based CV intake, candidate tracking, SharePoint storage, RH autonomy and 10-day post-delivery support | Microsoft Forms, Microsoft Lists, SharePoint Online, Outlook, Power Automate, M365 Business Basic tenant permissions, RH status/etapa model | M365 recruiting intake checklist, POC acceptance script, ownership/tenant handoff checklist, permissions map, RH runbook; see `templates/freelance/checklist-microsoft365-recruiting-flow.md` | 4 | Build a fake-tenant no-secret implementation plan and screenshotable demo outline; do not expose full architecture in chat before paid POC |
| Embeddable AI web chat + WhatsApp lead capture | Fresh Workana demand asks for a site widget plus WhatsApp assistant that answers from a Supabase knowledge base and captures qualified lead fields with source URL/UTM metadata | n8n, OpenAI or Anthropic, Supabase, embeddable JavaScript widget, WhatsApp Business API or approved provider, CRM/Sheets handoff, UTM capture | Web-chat widget requirements checklist, Supabase KB schema, lead-capture field map, widget install snippet, WhatsApp fallback path, consent/opt-in language and QA test cases | 4 | Create a no-secret widget+WhatsApp lead-capture architecture checklist and fake-data demo manifest before bidding on web-chat + WhatsApp projects |
| Official WhatsApp Business / Cloud API setup | Many buyers confuse official Meta setup, third-party APIs and unsupported shortcuts | Meta WhatsApp Cloud API, Business Manager, webhooks, templates, opt-in, LGPD, CRM handoff | Compliance-safe intake questions, Meta setup checklist, template approval checklist, no-guarantee language | 4 | Maintain current Meta policy notes and provider comparison |
| Social media agent and DM automation | Demand exists, but direct outreach/DM automation is policy-sensitive | Meta Graph API where permitted, scheduler, approval queue, content calendar, CRM, manual review | Risk checklist, consent/opt-in gate, approval queue design, content workflow, no-unauthorized-DM clause | 3 | Build policy-safe social agent offer that avoids spam and ToS violations |
| AI video/avatar production automation | 2026-06-30 public 99Freelas scan surfaced a fresh request to automate a video-processing workflow: extract audio, upload generated narration to an Adobe AI avatar tool, then upload the resulting avatar video back into the original video flow | Playwright, Python or Node.js, local media processing, FFmpeg where allowed, Adobe account/browser UI, file queue, retry logs, manual checkpoints | UI automation intake checklist, platform-ToS permission check, media-file boundary, local fixture workflow, retry/rollback plan; see `templates/freelance/checklist-ai-video-avatar-playwright-adobe.md` | 3 | New checklist created; next gap is a no-secret local demo using dummy media and a mock upload target before bidding beyond diagnostic |
| AI point-cloud / photogrammetry software | 2026-06-30 99Freelas mail radar surfaced a computer-vision scope to generate point clouds from images using AI/fotogrametria | Python, OpenCV, COLMAP/OpenMVG/Open3D or cloud photogrammetry APIs, local file processing, image metadata, export formats, QA fixtures | Photogrammetry diagnostic checklist, input-quality checklist, tool comparison, sample-image fixture plan, output acceptance criteria; see `templates/freelance/checklist-ai-point-cloud-photogrammetry.md` | 2 | New checklist created; sell only diagnostic/tool-selection first until Paulo has a no-secret fixture/demo and clear accuracy/export acceptance criteria |
| Streamlit / Power BI AI chat | Clients want conversational access to existing BI/report data | Streamlit, pandas, Power BI export/API, semantic layer, OpenAI/Anthropic, auth, CSV/XLSX/SQL connectors | Streamlit BI chat starter, data dictionary template, query guardrails, hallucination test cases; see `templates/freelance/checklist-streamlit-powerbi-chat.md` and `demos/freelance/streamlit-bi-chat` | 5 | Local fake-data demo created; next gap is optional Power BI API connector after client confirms data source |
| Brazilian financial automation | Brazilian buyers need billing, invoice, bank slip, receivables and collection automation that respects local file/API formats and Portuguese business context; 2026-06-22 public Workana search added boleto/CNAB + WhatsApp reminder demand for Sicoob/Sicredi | Python, pandas, openpyxl, Google Sheets API, Focus NF API, BTG Pactual/CNAB, OFX/CSV parsing, Streamlit, n8n/Make, official WhatsApp API, email automation, OpenAI/Anthropic for drafted collection messages | Financial automation starter checklist, sample CSV-to-Excel template, NFS-e/CNAB field-map checklist, Sicoob/Sicredi remessa-retorno checklist, AR dashboard fake-data demo, human-approval WhatsApp/email workflow | 4 | Expand the no-secret finance demo with fake boleto/CNAB files, remessa/retorno validation and WhatsApp reminder approval gates |
| Financial AI workflow / reconciliation systems | Arc.dev Recap Technologies role validates higher-ticket demand for AI-native financial workflow systems that reason across inconsistent bank statements, GL exports, Excel/PDF/CSV files and require auditability, confidence levels and reviewer correction loops rather than a chatbot | React/Next.js, Python or Node APIs, Postgres, Claude/Anthropic, future Azure OpenAI/Vertex, AWS/Azure, secure file ingestion/storage, document extraction, deterministic/fuzzy matching, queues/workers, IAM/RBAC, encryption, audit logs, LLM evaluation | Reconciliation prototype checklist, fake bank/GL fixture pack, canonical transaction schema, matching/confidence rules, review queue UI acceptance tests, audit trail/event log schema and handoff runbook; see `templates/freelance/checklist-financial-ai-workflow-reconciliation.md` | 4 | Build a no-secret fake-data prototype showing bank statement + GL ingest, deterministic/fuzzy matching, exception queue, confidence score and audit trail before any interview/trial |
| AI credit-risk SaaS / score consultation platform | 2026-06-25 public 99Freelas scan surfaced `Plataforma SaaS para automacao de servicos`, asking for a SaaS where a seller consults risk rating/score before selling products or services, with AI agents and Python/GCP signals | Python, Google Cloud Platform, database, API layer, user/auth, audit logs, credit-risk data model, deterministic rules plus AI explanation layer, admin review, LGPD and fairness/compliance review | Credit-risk SaaS discovery checklist, regulated-data permission matrix, fake borrower/company fixture set, scorecard/audit-log schema, explainability note, no-production-credit-decision disclaimer and phase-1 architecture proposal | 3 | Create a no-secret credit-risk SaaS diagnostic pack before bidding aggressively; sell discovery/architecture/fake-data prototype first, not a production credit-decision engine |
| Credit CLT fintech marketplace for retailers | 2026-06-29 99Freelas #133 requested a platform connecting retailers to financial institutions offering Credito CLT as checkout/payment credit, with LGPD consent, document upload, e-signature, commissions, dashboards, audit and webhook/API status updates | React/Next.js, Node.js or .NET, Postgres, API adapter layer, financial-institution sandbox, webhooks, consent records, document storage, e-signature provider, RBAC, audit logs, LGPD | Credit CLT fintech discovery checklist, provider API contract, consent/audit event schema, proposal-status state machine, fake client/retailer fixture set, e-signature provider decision matrix, sandbox-first delivery plan | 3 | Build a no-secret fintech phase-1 starter pack: data model, API adapter skeleton, status/webhook simulator, LGPD consent copy and demo dashboard before selling a full multi-financeira build |
| Power BI data connection | Buyers need small data connection fixes with fast turnaround | Power BI Desktop, Power Query, gateways, SQL/API/CSV connectors, credentials handled by client, refresh tests | Connection troubleshooting checklist, refresh validation steps, source-to-report mapping template | 4 | Keep short diagnostic proposal and evidence checklist ready |
| AI voice / phone support | Buyers want voice agents for reception and FAQ, often without telephony clarity | Twilio Media Streams, SIP/VoIP/PBX validation, OpenAI Realtime or STT/LLM/TTS, ElevenLabs Agents, call logs, fallback | Telephony intake checklist, stack option map, sample call flow, risk/consent checklist, phased PoC offer; see `templates/freelance/checklist-ai-voice-telephony.md` | 5 | PoC checklist created; next optional gap is a working demo with a test number |
| CRM/Odoo/Zoho/Pipedrive customization | Clients want CRM configuration, migration and automation without big consulting overhead | Odoo, Zoho, Pipedrive, Kommo, HubSpot, Make/n8n/Zapier, CSV import/export, webhooks | CRM diagnostic script, field/process map, migration checklist, automation backlog template; see `templates/freelance/checklist-crm-odoo-discovery.md` | 5 | Discovery worksheet created; next optional gap is CRM-specific proposal snippet bank |
| Odoo + WhatsApp + n8n sales/purchase preauthorization | 2026-06-26 public Workana search surfaced low-competition Odoo scopes where WhatsApp intake, AI intent extraction, real Odoo stock/price lookup, sales draft approval, purchase RFQ approval, payment link and warehouse/logistics notification must stay controlled | Odoo Community/Online/Odoo.sh, n8n, WhatsApp Cloud API or approved provider, AI intent extraction, payment links, inventory, sales orders, purchase RFQs, approval rules, audit logs | Odoo preauthorization checklist, intent-to-Odoo field map, approval-state diagram, stock-insufficient purchase flow, payment/warehouse handoff checklist; see `templates/freelance/checklist-odoo-whatsapp-preauthorization.md` | 4 | Checklist created; next gap is a fake Odoo product/order/RFQ fixture pack and a no-secret approval-state demo before bidding aggressively |
| Kommo + n8n + WhatsApp AI qualification | Fresh Workana/99Freelas opportunities ask for WhatsApp or Instagram intake, AI qualification, Kommo stage movement and controlled human handoff for clinics, courses and service funnels | Kommo CRM, Kommo Salesbot, n8n when needed, WhatsApp Cloud API or approved provider, Instagram/Meta channels, OpenAI/Anthropic, webhooks, JSON field extraction, lead alerts | Kommo+n8n WhatsApp qualification checklist, Kommo AI Salesbot clinic/course checklist, field map, prompt-to-JSON guardrail, opt-in/template review checklist; see `templates/freelance/checklist-kommo-n8n-whatsapp-qualification.md` and `templates/freelance/checklist-kommo-ai-salesbot-clinic-courses.md` | 4 | Next gap is a reusable proposal snippet plus a fake Kommo pipeline/contact-base fixture to show safe import, AI qualification and human review |
| Legal demand / correspondent automation with Claude + WhatsApp | Workana public search surfaced legal-operations buyers asking for n8n flows that triage demands, coordinate correspondents and use Claude/Anthropic through WhatsApp while preserving control | n8n, Claude/Anthropic API, WhatsApp Cloud API or approved provider, case-state tables, CRM/Sheets/Airtable, webhook logs, human review queue | Legal automation intake checklist, case-state model, human-approval guardrails, audit log map, opt-in/message-template review; see `templates/freelance/checklist-legal-n8n-claude-whatsapp.md` | 4 | Checklist created; next optional gap is a fake legal-demand demo with case states and approval/audit trail |
| Legal process monitoring AI | 2026-06-29 public 99Freelas scan surfaced demand for daily Brazilian judicial-publication monitoring, party/movement extraction and workflow summaries from Diario Oficial style sources | Python, public court/Diario Oficial sources where permitted, document parsing/OCR when needed, Postgres/Supabase, queue/scheduler, LLM summarization, confidence scoring, human legal review | Legal process monitoring checklist, source-permission matrix, party/process/movement schema, duplicate-publication guard, human-review summary template; see `templates/freelance/checklist-legal-process-monitoring-ai.md` | 3 | Checklist created; next gap is a fake Diario Oficial fixture set and no-secret demo showing ingestion, dedupe, extraction, summary and reviewer approval |
| AI SaaS / MVP with WhatsApp | Founders ask for full platforms but buy safer first MVP phases | Next.js, React, Supabase/Postgres, Vercel/Railway, WhatsApp API, AI provider, auth, admin panel | MVP phase-1 scope menu, architecture skeleton, pricing bands, acceptance checklist | 4 | Create one-page MVP package and reusable backlog template |
| Language-learning AI MVP with WhatsApp | 2026-06-26 public Workana search surfaced a current `Plataforma de Idiomas B1 con IA` project asking for WhatsApp/web intake, AI-generated German B1 exam exercises, Airtable learner context and progress updates | WhatsApp Business Cloud API or approved provider, OpenAI/Anthropic, Airtable, web app or landing intake, exercise-generation prompts, learner progress model, admin review, logs | Language-learning MVP intake checklist, B1 exam exercise schema, Airtable learner/progress base, WhatsApp opt-in and escalation copy, fake learner fixture set, educator review acceptance tests; see `templates/freelance/checklist-language-learning-ai-mvp.md` | 4 | Checklist created; next gap is a fake Airtable/exercise fixture pack before bidding aggressively; keep phase 1 to diagnosis, intake, first exercise flow and progress update |
| Corporate LMS AI evolution | 2026-06-29 public 99Freelas scan surfaced a university-corporate LMS evolution request requiring real LMS maintenance/build experience plus AI applied to education flows | LMS/EAD platform stack to verify, LTI/SCORM/xAPI where applicable, auth/RBAC, course/content model, LLM tutoring/search/summarization, analytics, accessibility, migration QA | Corporate LMS AI evolution checklist, LMS case/proof gate, learning-flow map, AI feature risk matrix, content/user-data boundary and rollout QA; see `templates/freelance/checklist-corporate-lms-ai-evolution.md` | 2 | Checklist created, but readiness is low without concrete LMS case proof; pursue only as diagnostic/architecture review unless Paulo can cite verified LMS experience or partner proof |
| Lovable/Supabase member-area MVP | 99Freelas loss #53 showed that below-average price is not enough when the title signals Lovable/no-code; buyers may choose faster platform-specific proof over heavier custom architecture | Lovable, Supabase, auth, member area, check-in forms, dashboard/admin, Kiwify/webhooks, content tables | Lovable member-area starter, 48h clickable proof, screenshot/video proof pack, no-code-first proposal snippet; see `reports/freelance/2026-06-19-99freelas-lost-lovable-postmortem.md` | 3 | Build a demo/starter and lead with 5-7 day Lovable/Supabase slice at R$900-R$1.800 instead of 18-day custom V1 |
| Speed-first professional delivery | Paulo has internal AI/tool acceleration, so proposals should promise faster first value than competitors without exposing the internal stack or accepting open scope | Internal AI/tool lanes, browser QA, local templates, demos, checklists, fake-data proof packs, QA gates | Speed-first proposal template, small-slice pricing bands, demo-first backlog, client-facing abstraction rule; see `reports/freelance/2026-06-19-speed-first-low-price-policy.md` | 5 | Keep future proposals anchored to first visible result in 24-48h where possible, framed as professional delivery rather than LLM usage |
| Automation hygiene / RevOps audit | Repeated demand for broad automation help before build | Make, n8n, Zapier, GHL, Kommo, Airtable, Google Workspace, CRM, dashboards | Audit checklist, architecture diagram template, prioritized backlog model, handoff/runbook | 5 | Keep using as default low-risk entry offer |
| AI automation handoff and enablement | 2026-06-25 public Workana/Upwork scans showed buyers asking for n8n/AI agents plus documentation, handover video, internal training and post-delivery support, not just build work | n8n, Make, Zapier, Claude/OpenAI/Gemini APIs, webhooks, CRM/spreadsheets, Loom/video walkthroughs, SOPs, support checklist | Handoff video script, admin SOP template, client training agenda, acceptance checklist, maintenance/support boundary and change-request log | 4 | Create a reusable no-secret enablement pack so proposals can promise operational independence without open-ended support |
| Claude Code / MCP automation lead stack | 2026-06-23 Upwork public search surfaced fresh long-term roles asking for Claude Code, MCP, n8n, Make, GHL, APIs, Supabase and business-systems automation, extending generic automation-partner demand into agentic engineering operations | Claude Code, MCP servers, n8n, Make.com, GoHighLevel, Supabase, APIs/webhooks, CRM workflows, document processing, logs, handoff/runbooks | Agentic automation lead intake checklist, MCP permission/scope matrix, client-work triage board, human approval queue, reusable first-week sprint plan, proof-note PDF and demo catalog | 4 | Existing AI automation partner menu covers the commercial wedge; next gap is a no-secret Claude Code/MCP/GHL first-week sprint checklist with permission boundaries and proof snippets |
| Relevance AI / Claude / GHL campaign workflow builder | 2026-06-23 public Upwork search surfaced fresh demand for agent-style workflows that connect Relevance AI or similar, Claude/ChatGPT APIs, CRM, email tools, task/project systems and documented Loom handoffs for campaign operations | Relevance AI or equivalent agent workflow platform, Claude/OpenAI APIs, GoHighLevel or CRM, webhooks, email/task tools, ClickUp, n8n/Make as optional orchestration | Relevance AI campaign-agent intake checklist, CRM/email/task permission matrix, human approval queue, documented handoff/Loom script, production-safe test plan and proposal snippet | 4 | Existing automation and GHL assets cover most delivery, but Paulo needs a platform-agnostic Relevance AI-style workflow checklist and demo script before bidding aggressively |
| Legacy PHP layout/functionality update | Clients need quick changes to existing PHP-rendered sites: visual standardization, jQuery behavior, listing filters, contact buttons, tooltips and Git handoff | PHP, HTML5, CSS3, JavaScript/jQuery, GitHub, staging/homologation, browser QA checklist | Legacy PHP update checklist, before/after QA checklist, Git branch/commit plan, scope-cut proposal template | 4 | Create a reusable checklist/snippet for small PHP/jQuery maintenance jobs and keep pricing in R$250-R$450 microphase band |
| PHP/OpenAI PDF analysis optimization | Fresh 99Freelas demand asks to fix an existing production PHP/MySQL/OpenAI PDF analysis system that fails on larger tender tables, without rebuilding from scratch | PHP, MySQL, OpenAI API, PDF parsing/OCR where applicable, chunking, queues, logging, token/cost controls, regression fixtures | AI document-analysis diagnostic checklist, PDF chunking/token-budget playbook, large-table regression test fixture, PHP OpenAI error-handling checklist | 4 | Build a no-secret sample fixture and diagnostic checklist so future bids can lead with "fix the bottleneck, not rebuild the system" |
| Restaurant menu/reservation V1 | Local businesses ask for simple responsive web presence with digital menu, booking/reservation flow and lightweight admin panel, usually with price-sensitive competition | HTML/CSS/JS, React/Next.js or simple PHP/JS depending existing code, PostgreSQL/Supabase/SQLite, mobile-first QA, admin CRUD, reservation status fields | Restaurant V1 scope checklist, menu data model, reservation form fields, admin acceptance checklist, mobile QA script, follow-up snippet | 4 | Build a tiny reusable starter/demo for menu categories, items, reservation requests and admin table so future restaurant/local-business bids can include proof |
| Restaurant WhatsApp ordering agent | 2026-06-25 public 99Freelas search surfaced restaurant buyers asking for WhatsApp AI bots for service, order management and ready/semi-ready proof before accepting freelancers without reviews | WhatsApp Cloud API or approved provider, n8n, Chatwoot or human inbox, menu/order data, payment/order status boundaries, logs, escalation, mobile QA | Restaurant WhatsApp ordering checklist, menu/order state machine, fake restaurant catalog, conversation test cases, human escalation script, no-guaranteed-Meta-approval language | 3 | Create a no-secret restaurant ordering bot demo pack before pursuing complex restaurant WhatsApp leads; current restaurant V1 starter is not enough for order automation proof |
| E-commerce conversion redesign | Contra visible job feed surfaced a $1,500 / 5-day storefront redesign asking for homepage, product listing, product detail, cart and checkout with conversion focus | Figma, UX audit, CRO heuristics, ecommerce journey mapping, developer handoff, product proof from CantuStudio/FaithSchool/AgenticosCore | E-commerce CRO audit checklist, 5-day Figma handoff proposal, homepage/PDP/cart/checkout review template | 3 | Good fallback when budget is strong, but Paulo needs stronger visible e-commerce/Figma proof before treating it as a core category |
| Shopify US-market go-live/CRO | 99Freelas demand asks for quick Shopify builds when the buyer already has identity, products, media, copy and page structure ready | Shopify, themes, Zendrop, PayPal, Meta Pixel, GA4, basic SEO, mobile QA, checkout tests, paid-traffic CRO heuristics | Shopify launch checklist, product setup map, hero/PDP conversion QA, tracking validation, checkout test script, go-live handoff | 4 | Build a no-secret Shopify launch checklist and fake-store QA artifact so future ecommerce bids can include proof, not only promises |
| E-commerce AI operations automation | 2026-06-25 public Upwork search surfaced e-commerce buyers asking for Claude API + n8n/Python automation across customer service, operations and marketing, with explicit concern about cost-efficient architecture and monthly run cost | Claude/Anthropic API, n8n, Python, Shopify/DTC stack, REST APIs, webhooks, customer-service workflows, marketing ops, logs, cost monitoring | E-commerce automation audit checklist, Python-vs-n8n architecture decision tree, monthly cost model, fake Shopify event fixtures, support/order workflow test cases | 4 | Build a no-secret e-commerce ops automation pack with cost model and fake order/support events so proposals can answer stack/cost questions concretely |
| GTM/GA4/Ads tracking setup | Fresh low-ticket buyers ask for point tracking across WhatsApp, phone, forms and email with Google Tag Manager, GA4, Google Ads and Meta Ads validation | Google Tag Manager, GA4 DebugView, Google Ads conversion tags, Meta Pixel, browser preview/debug tools, event naming conventions | Tracking setup checklist, event naming template, QA evidence screenshots, client access request template | 5 | Package a 24-48h tracking micro-offer and create a one-page event map template for follow-ups |
| Transactional WhatsApp commerce bot | Buyers with documented Figma flows want WhatsApp Business API bots for subscriptions, cart, payment, orders, invoice/rastreio, account changes and cancellation | WhatsApp Business Cloud API, webhooks, n8n, Node.js/TypeScript or Python service layer, Postgres/Supabase/Redis state, external REST APIs, logs, fallback human handoff | Transactional bot state-machine template, Figma-to-flow mapping checklist, API contract checklist, go-live risk checklist, maintenance scope menu | 4 | Build a reusable state-machine skeleton and first-two-flows demo using fake APIs |
| Product recommendation WhatsApp bot with live price sheet | Fresh Workana demand asks for a WhatsApp Cloud + Claude + n8n bot that recommends products from a client-maintained technical guide and Google Sheet price list, then cross-sells and escalates complex/high-volume cases | WhatsApp Cloud API, Meta Business setup, Claude/Anthropic API, n8n on VPS, Google Sheets, product catalog/technical guide, webhook logs, human handoff | Product-catalog Q&A checklist, Google Sheets price schema, recommendation prompt guardrails, cross-sell rules map, escalation criteria, Spanish/PT-BR training handoff | 4 | Create a no-secret product recommendation bot checklist with fake catalog, price sheet, recommendation test cases and Meta opt-in/template notes |
| Retention/cancellation WhatsApp agent | Fresh Workana demand asks for an MVP that classifies cancellation motives, generates retention reports and triggers human recovery actions for recurring-member operations | n8n, WhatsApp Cloud API or approved provider, OpenAI/Anthropic, CRM, cancellation taxonomy, dashboards, opt-in and human handoff | Retention reason taxonomy, save-offer decision tree, WhatsApp conversation test script, CRM field map, weekly retention report template | 4 | Create a reusable checklist/proposal snippet and fake-data flow for cancellation classification before pursuing similar projects aggressively |
| WordPress clinic SEO migration | Health/professional-service clients need migration from SaaS site builders to WordPress for SEO, tracking, blog and lead capture | WordPress, Elementor/block theme, RankMath/Yoast, GA4/GTM/Meta Pixel, sitemap/robots, forms/Tally, WhatsApp CTA, Core Web Vitals basics | Clinic/service-business WordPress page map, SEO metadata checklist, tracking validation checklist, handoff doc | 4 | Create a reusable WordPress clinic/site migration checklist and proposal snippet |
| SaaS screen-recording promo videos | SaaS buyers need short product videos in many aspect ratios with clear non-technical positioning, captions, thumbnails and editability | Screen recording, lightweight motion graphics, Remotion/CapCut/DaVinci/Canva or Adobe-equivalent workflows, SRT captions, product messaging, social/ad cuts | SaaS video storyboard template, 15/30/60s cutdown matrix, caption/SRT checklist, source-file caveat language | 3 | Build a sample CRM/SaaS product video pack with editable equivalent source before pursuing more video jobs aggressively |
| Lovable to Claude Code migration | New 99Freelas demand asks to convert Lovable projects into codebases that can be managed by Claude Code or similar agentic coding tools | Lovable export/source, React/Vite/Next.js depending output, TypeScript, Supabase/env vars, package scripts, README, CLAUDE.md/AGENTS.md, local validation, git handoff | Lovable-to-Claude-Code migration checklist, repo intake template, CLAUDE.md starter, env-var inventory template, local validation script | 5 | Build a reusable migration checklist and one sample handoff pack so future bids can include exact evidence |
| Medical/aesthetic PWA MVP | Fresh 99Freelas demand asks for mobile-first clinic/aesthetic PWA with Next.js, Supabase, Pagar.me, patient records, photos, agenda, PDF, WhatsApp and CMS | Next.js 14, TypeScript, Tailwind, Supabase Auth/Postgres/Storage, Pagar.me, Google OAuth, PWA, PDF generation, WhatsApp handoff | Phase-1 architecture checklist, Supabase schema starter, Pagar.me recurring-payment risk checklist, patient/photo LGPD notes, mobile QA script | 4 | Build a small no-secret PWA starter and schema for patient/photo/agenda flows before pursuing more health/aesthetic apps |
| Clinical neurorehab AI / voice-assisted EHR | Fresh 99Freelas demand asks for FISIO IA CARE: clinic management, neurorehab monitoring, voice-assisted prontuario, therapeutic evolution drafts, insurer reports, dashboards, data observatory, predictive analytics and stock control | Web app, Postgres/Supabase or managed relational DB, speech-to-text, LLM provider, role-based access, audit logs, backup, clinical review workflow, LGPD controls | Clinical AI discovery checklist, voice-to-evolution prototype flow, non-autonomous-AI guardrails, LGPD/access/audit checklist, rehab metrics data model, insurer-report template | 4 for paid phase 1 / 3 for full platform | Create a clinical AI / voice-EHR MVP checklist and fake-data prototype pack before selling a complete healthcare platform build |
| Healthcare WhatsApp check-in and therapist summary automation | Fresh Workana demand asks for n8n + Claude + Evolution API on VPS to receive form summaries, send daily WhatsApp check-ins, answer patients with conversation context and generate weekly therapist reports | n8n self-hosted, Claude/Anthropic API, Evolution API, VPS/Hetzner/DigitalOcean, Airtable or Google Sheets, Tally/Google Forms, cron, webhook logs, approval/fallback workflow | Healthcare check-in flow checklist, patient-message consent language, therapist-report template, VPS/Evolution install checklist, clinical escalation guardrails, fake-data conversation test set | 4 | Create a healthcare WhatsApp check-in pack before bidding aggressively: no diagnosis promises, client-controlled credentials, opt-in, escalation and therapist review required |
| Marketplace payment-flow safety | Marketplace owners want direct freelancer payment links while keeping admin gateways, disputes, reimbursement and upgrade-safe behavior | Existing marketplace codebase, gateway links/PayPal/bank links, admin roles, project state machine, audit logs, update-safe plugin/patch strategy | Payment-state map, dispute/refund checklist, gateway isolation checklist, no-audit-removal clause, handoff template | 4 | Create a reusable state diagram and review checklist so bids can lead with safety instead of just low price |
| Food-service pricing automation | Food businesses want CMV, margin, app fee, delivery/balcao pricing, ingredient inflation impact and technical sheets | Spreadsheet-app, Streamlit/React, pandas, Supabase/SQLite, iFood fee assumptions, recipe/yield model, dashboards | Fake-data CMV model, ficha tecnica template, iFood/app fee simulator, margin impact dashboard | 4 | Build a compact fake-data calculator demo to show food-service buyers proof within the proposal/follow-up |
| Editorial AI agent workflow | Buyers want agents for LinkedIn/article production and future automations, but reputation risk requires human approval | LLM prompts, Airtable/Notion/Sheets, n8n/Make, content calendar, approval queue, style guide, research checklist | Briefing schema, article quality checklist, prompt pack, approval Kanban fields, sample article pipeline | 5 | Keep the workflow positioned as human-reviewed content ops, not auto-publishing or generic content spam |
| Local-media editorial automation pipeline | 2026-06-29 99Freelas #128 asks for a radio/newsroom workflow where a WhatsApp command triggers source review, website article, radio script, Instagram caption/stories/Reels, SEO, branded card and optional WordPress publishing | WhatsApp approved provider or command intake, LLM drafting, source checklist, image/card generation, WordPress API, storage, approval queue, Instagram/Meta publishing policy review | Local-media editorial intake checklist, source/citation review template, multi-format output schema, branded-card generation options, WordPress draft-only handoff, approval/publish boundary; proposal submitted as #128 | 4 | Create a no-secret local-media editorial automation pack before scaling: fake newsroom brief, output schema, human review checklist, WordPress draft mode, and explicit no-auto-publish guardrail |
| Voice AI demo sprint | Upwork demand asks for demo-ready conversational appointment agents with practical platform choice | Vapi, Retell, Twilio, n8n, Airtable/Supabase, calendar APIs, transcript/logging, interruption and latency tests | Vapi-vs-Retell test checklist, appointment call script, webhook schema, transcript/log table, demo runbook | 4 | Build a small demo harness with fake lead/calendar data so future voice bids include concrete proof |
| Ongoing AI automation technical partner | Upwork demand asks for a reliable technical partner for repeated client work across AI automations, websites and lead-generation systems | n8n/Make, APIs/webhooks, Python/Node.js, PostgreSQL, Cloudflare, vector databases/RAG, lightweight web apps, CRM/lead-gen workflows, logs/retries/runbooks | Agency-partner proof note, diagnostic-first pilot template, reusable workflow intake map, logging/retry checklist, handoff note template, client-work triage checklist | 5 | Reuse the proof-note PDF pattern for high-fit Upwork roles; next gap is a one-page "first paid pilot menu" with 3 package options and a small private demo catalog |
| GHL + Stripe + Google Drive client-intake flow | Fresh Upwork alert asks for a senior GoHighLevel automations builder to wire client intake from a written spec, with payment/signature gate, branching operator/sponsor intake, per-client Drive folder provisioning, file manifest and byte-for-byte document verification | GoHighLevel, Stripe webhooks/events, n8n, Node.js crypto/SHA-256, Google Drive API, GHL API, webhook signature verification, dedupe/idempotency, corrupted-file acceptance test, safe test records, handoff/runbook | GHL intake data contract, Stripe event boundary checklist, Drive folder naming/permission template, duplicate-prevention test plan, SHA-256 manifest pattern, corrupted-file test plan, GHL write-back/runbook snippet | 5 for scope fit / 5 after Paulo replenished Connects and proposal was submitted | Submitted on Upwork as proposal `2069333805304643585` for US$850 fixed; 27 Connects spent, 1 remaining, no boost; evidence `reports/freelance/screenshots/2026-06-23-upwork-ghl-stripe-google-drive-proposal-submitted.png`. Next gap: reusable GHL+Stripe+Drive fake-data demo/checklist with SHA-256 file verification |
| 24/7 autonomous sales/admin/RFP agents | Fresh Upwork demand asks for always-on n8n + Claude agents that pull prospects, draft/send outreach, monitor Gmail, trigger WhatsApp alerts and draft proposal outlines from RFP emails | n8n, Claude/Anthropic API, Apollo.io, Gmail API, Google Sheets, WhatsApp via Twilio/WATI or approved provider, cron/schedulers, audit logs, human approval queues | Autonomous-agent governance checklist, outbound compliance/consent gate, Gmail read/draft/send permission matrix, WhatsApp alert template, RFP intake schema, demo-video proof plan | 3 | Create a no-secret governance and approval-queue checklist before pursuing; avoid fully autonomous send/follow-up promises unless client confirms consent, platform rules and human review |
| AI booking marketplace product engineering | Contra visible feed surfaced ongoing Next.js/Stripe/Clerk marketplace + AI developer demand | Next.js, Clerk, Stripe, marketplace state machine, provider/customer/admin roles, AI intake/support/listing enrichment | Booking marketplace state-machine, Stripe/Clerk role checklist, provider/customer/admin flow map, first-week sprint proposal | 4 | Complete Contra wallet/identity manually if Paulo wants to apply, then lead with product-engineering risk rather than generic AI development |
| AI-generated no-code challenge demos | Contra/Bubble challenge asks for AI-generated baseline proof, demo video, written description and live app link; winning requires a packaged submission, not only a good idea | Bubble AI, no-code app structure, dashboard UX, screen recording, screenshots, concise product narrative, live preview/deploy validation | Challenge submission pack, baseline screenshot, 30-90s demo video, written copy, live-link checklist, deploy/payment gate note; see `reports/freelance/2026-06-22-contra-bubble-submission-package.md` | 5 | First challenge pack submitted on Contra with public post, verified Bubble preview, video and proof screenshot. Next gap is monitoring comments/results and reusing the pack for portfolio/proposal proof |

## Opportunity Extraction Schema

Use this schema in reports when a new high-fit opportunity is reviewed:

```yaml
opportunity_learning:
  platform:
  title:
  url:
  buyer_pain:
  requested_scope:
  deliverables:
  tools_and_apis:
  data_sources:
  auth_or_secret_boundary:
  compliance_or_tos_risk:
  fastest_safe_first_phase:
  reusable_assets_needed:
  readiness_score:
  readiness_gap:
  prep_action:
  proposal_angle:
```

## Reviewed Opportunities - 2026-06-27

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Inteligencia artificial para dashboards de auditorias operacionais
  url: https://www.99freelas.com.br/projects?q=intelig%C3%AAncia%20artificial
  score_fit: 4.5
  score_readiness: 5
  lowest_defensible_entry_price: R$750-R$1.200 for an audit-dashboard AI diagnostic and first safe assistant slice
  entry_scope: Map the existing operational-audit dashboards, identify the highest-value AI assistance points, implement or specify one bounded analysis/summarization layer with human review, and deliver an adoption/runbook backlog.
  phase_2_scope: Deeper dashboard copilots, anomaly explanations, audit finding summaries, cross-client benchmarks, role-based permissions, production observability and model evaluation.
  buyer_pain: Buyer already has a production web platform for operational audits and wants AI to improve dashboard analysis and indicator interpretation without breaking an active customer workflow.
  requested_scope: AI for an operational-audit platform with existing dashboards, indicators, audits and performance monitoring.
  fastest_safe_first_phase: In 3-5 days, deliver a diagnostic plus one concrete dashboard AI use case using sample/exported non-sensitive data and clear human-review boundaries.
  tools_and_apis: Existing web platform, BI/dashboard data exports or database/API access after contract, Python/Node.js, OpenAI or Anthropic, evaluation fixtures, audit logs, role-based access notes.
  procedure:
    - intake: Confirm current dashboard stack, data model, user roles, sample data availability, sensitive fields, audit workflow and expected AI outputs.
    - setup: Define non-secret sample dataset, allowed actions, reviewer role, quality metrics and failure/fallback behavior.
    - build: Prototype one AI layer for indicator summary, anomaly explanation or audit finding prioritization.
    - test: Validate against real examples, hallucination controls, data leakage risk, reviewer override and dashboard UX fit.
    - handoff: Deliver findings, prompt/schema notes, acceptance tests, rollout risks and phase-2 backlog.
  reusable_assets:
    proposal_snippet: Todo - 99Freelas operational-audit AI dashboard proposal snippet
    discovery_checklist: Todo - operational-audit dashboard AI intake checklist
    architecture_skeleton: Todo - dashboard AI assistant architecture with human review and audit logs
    implementation_checklist: Todo - dashboard AI summarization/evaluation checklist
    test_plan: Todo - hallucination, data leakage and reviewer-override test plan
    runbook: Todo - AI dashboard handoff and adoption runbook
  risks:
    platform_tos: Keep negotiation inside 99Freelas; do not request off-platform contact in proposal.
    lgpd_or_pii: Existing customer/audit data may contain operationally sensitive information; use redacted samples before contract and secure access after contract.
    credentials: No production credentials, database dumps or API keys in chat, repo, email or screenshots.
    scope_sprawl: Do not sell a full platform AI transformation as the entry price; sell the first measurable AI dashboard slice.
  readiness_gap: Create a reusable operational-audit dashboard AI checklist and proposal snippet for fast same-day response.
  prep_action: Draft a concise operational-audit dashboard AI proposal and checklist using AgenticosCore/dashboard proof where links are allowed.
  proposal_angle: Production-safe AI dashboard improvement for existing audit operations: one useful assistant slice first, with reviewer control, evaluation and rollout discipline.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Marketplace musical - aplicativo e site
  url: https://www.99freelas.com.br/project/marketplace-musical-aplicativo-e-site-763819
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: R$950 for first marketplace MVP/product phase
  entry_scope: Music marketplace discovery plus first executable product slice: MVP flow, mobile-first user journey, clickable prototype, initial architecture for users/plans/services/orders/transactions/admin and phase-2 backlog.
  phase_2_scope: Full app/site implementation, subscriptions, internal transactions, artist profiles, service marketplace, messaging/notifications, payments, moderation, admin analytics and production hardening.
  buyer_pain: Buyer wants to turn a broad music-marketplace idea into an app and site where artists can subscribe and transact services with each other.
  requested_scope: Mobile app and website marketplace with high user interaction, monthly plan and internal transactions between artists for services.
  fastest_safe_first_phase: In 5 days, deliver a concrete MVP map and clickable prototype so the client can validate scope before funding a full marketplace build.
  tools_and_apis: Next.js or React/React Native depending target, Supabase/Postgres, auth, payment/subscription provider, marketplace order state machine, admin panel, music-product UX references from CantuStudio.
  procedure:
    - intake: Confirm target users, artist service categories, subscription model, transaction/payment rules, moderation needs and app-vs-PWA preference.
    - setup: Define entities, roles, marketplace states, payment boundaries and first release journey.
    - build: Create clickable prototype and technical architecture for the first service-offer/booking/transaction flow.
    - test: Review mobile journey, scope gaps, trust/safety points, payment assumptions and admin visibility.
    - handoff: Deliver prototype link/file, architecture note, backlog, phase-2 estimate and risk list.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-27-99freelas-marketplace-musical-aplicativo-site-763819.md
    discovery_checklist: Todo - music marketplace MVP discovery checklist
    architecture_skeleton: Todo - marketplace state-machine skeleton for services, orders, payment and disputes
    implementation_checklist: Todo - subscription marketplace MVP implementation checklist
    test_plan: Todo - marketplace mobile journey and transaction-boundary QA checklist
    runbook: Todo - client handoff/runbook for marketplace MVP phases
  risks:
    platform_tos: Keep negotiation inside 99Freelas; no off-platform contact details in proposal.
    lgpd_or_pii: Artist profiles, messages, transactions and payment data require minimal collection, access controls and clear retention.
    payments: Full internal transactions require explicit payment-provider choice, fee/refund/dispute rules and production credentials only after contract through secure access.
    scope_sprawl: Do not sell a complete app/site marketplace at the entry price; quote phase 1 only.
  prep_action: Create a reusable music/creator marketplace MVP checklist and state-machine skeleton using CantuStudio as public-safe product proof.
```

## Reviewed Opportunities - 2026-06-23

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Landing page com integracao com WhatsApp e IA
  url: https://www.99freelas.com.br/project/landing-page-com-integracao-com-whatsapp-e-ia-763360
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: R$ 750,00
  entry_scope: Phase-1 funnel with responsive Wix landing page, presentation video, delayed CTA, three product routes, Hotmart/similar ebook link, scheduling route and one controlled WhatsApp AI FAQ/qualification flow with human fallback.
  phase_2_scope: Advanced tracking, CRM integration, richer AI knowledge base, campaign pixels/events, payment/booking automation hardening and ongoing optimization.
  buyer_pain: Buyer needs a conversion funnel for a personal/service offer where video persuasion, WhatsApp AI triage, digital product purchase and consultation scheduling must connect cleanly.
  requested_scope: LP with video and CTA button appearing at the end; WhatsApp AI answers questions and offers e-book, 3-consultation package and 10-consultation mentorship; ebook links to Hotmart/similar; consultative offers allow session scheduling; domain is on Wix.
  fastest_safe_first_phase: Ship landing + one controlled WhatsApp route in 3-4 days if content, video, WhatsApp/provider and scheduling/payment choices are ready.
  tools_and_apis: Wix, Hotmart or similar checkout link, WhatsApp Business/Cloud API or approved provider, n8n/Make or lightweight webhook layer if needed, Calendly/Google Calendar/Wix Booking, FAQ/offer routing, mobile QA.
  procedure:
    - intake: Confirm Wix access, domain state, video file/embed, CTA timing, offer copy, Hotmart/checkout URL, scheduling tool and WhatsApp provider/API state.
    - build: Create the landing page with video, delayed CTA and clear offer hierarchy.
    - automate: Configure the first WhatsApp AI flow for FAQ, offer routing, lead qualification and human fallback.
    - route: Connect ebook to checkout and package/mentorship to scheduling path.
    - qa: Test mobile, CTA timing, WhatsApp handoff, edge questions, checkout link and scheduling link.
    - handoff: Deliver link, flow map, prompt/rule notes, QA evidence and phase-2 backlog.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-25-99freelas-landing-page-whatsapp-ia-763360.md
    discovery_checklist: Todo - Wix video CTA + WhatsApp AI funnel intake checklist
    test_plan: Todo - video CTA timing, WhatsApp routing and scheduling QA checklist
  risks:
    platform_tos: Keep all negotiation/contact inside 99Freelas.
    whatsapp_policy: Confirm opt-in, approved WhatsApp provider/API path and avoid unsupported spam/outbound automation.
    ai_reliability: AI must stay inside FAQ/offer rules and use human fallback when uncertain.
    scope_sprawl: Full CRM/tracking/agent optimization should stay in phase 2.
  readiness_gap: Package a no-secret Wix/video CTA + WhatsApp AI funnel checklist and small fake-data demo for future crowded landing+IA bids.
  prep_action: Create reusable intake/QA checklist for service funnel: video landing, delayed CTA, WhatsApp AI, Hotmart link and scheduling path.
  proposal_angle: Win by selling a bounded first funnel that works end-to-end, not a vague landing page or unrestricted chatbot.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Criacao de landing pages na GreatPages
  url: https://www.99freelas.com.br/project/criacao-de-landing-pages-na-greatpages-763375
  score_fit: 2.5
  score_readiness: 2
  lowest_defensible_entry_price: R$ 350,00
  entry_scope: First paid landing-page pilot in GreatPages, using the client's validated model and provided copy/images, with mobile QA and CTA/form/WhatsApp link checks.
  phase_2_scope: Recurring monthly landing production at a per-page price after the pilot validates quality and workflow.
  buyer_pain: Traffic manager needs a reliable production partner to adapt validated landing-page templates for multiple clients every month.
  requested_scope: Replicate existing GreatPages models and personalize text, colors, photos, testimonials and client-specific details.
  fastest_safe_first_phase: One page pilot in 24-48h after receiving the GreatPages model, content and assets.
  tools_and_apis: GreatPages, landing-page copy hierarchy, responsive QA, form/WhatsApp link checks, basic tracking handoff if applicable.
  procedure:
    - intake: Confirm model access, page sections, client assets, copy source, CTA destination, form/WhatsApp path and revision limit.
    - build: Duplicate/rebuild the model in GreatPages and swap visual/content elements for the first client.
    - qa: Check mobile layout, spacing, links, CTA/form/WhatsApp, typos and final preview.
    - handoff: Deliver published/preview link, change notes and reusable checklist for recurring pages.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-25-99freelas-greatpages-landing-pages.md
    discovery_checklist: Todo - GreatPages recurring landing intake checklist
    qa_checklist: Todo - GreatPages mobile/conversion QA checklist
  risks:
    platform_requirement: Public posting says proven GreatPages experience is mandatory; no local/public GreatPages proof was found during this session.
    platform_tos: Keep all negotiation and examples inside 99Freelas; avoid off-platform contact details.
    commodity_pressure: Landing-page-only work is price competitive and below Paulo's strongest AI/automation lane.
  readiness_gap: Build or collect real GreatPages examples before bidding aggressively on recurring GreatPages-only projects.
  prep_action: Create one no-secret GreatPages sample landing or collect existing examples, then add a concise proof pack for future proposals.
  proposal_angle: Honest first paid pilot: prove speed and acabamento in GreatPages instead of claiming nonexistent platform-specific portfolio.
```

```yaml
opportunity_learning:
  platform: Contra
  title: Mentoring Platform Developer
  url: https://contra.com/independent/opportunities
  score_fit: 3.4
  score_readiness: 4
  buyer_pain: Mentoring platform likely needs structured mentor/mentee workflow, AI assistance, content strategy and repeatable human-in-the-loop operations.
  requested_scope: Visible card only; role tags show AI Agent Developer, Mentor and Content Strategist. No full JD exposed because Contra application/detail flow did not open.
  fastest_safe_first_phase: Diagnostic plus first controlled mentoring workflow: journey map, AI assist points, mentor review gates, prompt/handoff rules and runbook.
  tools_and_apis: Depends on client stack; likely web app, database, AI provider, content/workflow tooling and human review queues.
  procedure:
    - intake: Confirm product stage, current stack, mentor/mentee journeys, content library and quality risks.
    - design: Separate AI-assist use cases from human mentor judgment.
    - build: Implement or specify first workflow slice with review, logging and fallback.
    - test: Validate output quality, mentor override, unsafe answer handling and user journey.
    - handoff: Deliver runbook, improvement backlog and measurement cadence.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-23-contra-mentoring-platform-developer.md
    live_report: reports/freelance/2026-06-23-contra-live-apply-attempt.md
    screenshot_evidence:
      - output/contra-opportunities-2026-06-23.png
      - output/contra-opportunities-scroll-2026-06-23.png
      - output/contra-opportunities-bottom-2026-06-23.png
  risks:
    platform_gate: Contra Apply button remained inert even with logged-in profile showing 100 completion; search/filter opened Pro modal.
    platform_tos: Keep all contact and proposal activity inside Contra.
    pii: Mentoring platforms may involve learner personal data; collect minimum data and keep mentor/human review in sensitive workflows.
    credentials: No client credentials before contract and secure access path.
  prep_action: Create a mentoring/coaching AI workflow checklist if more education/mentoring leads appear.
  proposal_angle: AI-assisted mentoring operating system with human-in-the-loop quality control, not autonomous coaching replacement.
```

```yaml
opportunity_learning:
  platform: Contra
  title: AI-Powered Digital Ops Lead (Web + Automation + Strategy)
  url: https://contra.com/featured-jobs/freelance-tech-jobs
  score_fit: 4.0
  score_readiness: 5
  buyer_pain: Buyer likely needs digital operations leadership across web, automation and strategy without turning AI into scattered one-off automations.
  requested_scope: Public Contra featured job shows long-term freelance to potential full-time, remote or UK-based preferred, $40-$65/hr, 20 hrs/wk, ongoing, GMT 0.
  fastest_safe_first_phase: 7-10 day digital operations diagnostic, automation backlog ranked by ROI/risk, one or two controlled automations and runbook.
  tools_and_apis: n8n/Make/Zapier or code workflows, CRM/web stack, analytics, AI provider, internal docs, runbooks and approval queues depending client stack.
  procedure:
    - intake: Map current digital ops, systems, data boundaries, manual pain and decision cadence.
    - prioritize: Rank automations by ROI, risk, reversibility and maintenance burden.
    - implement: Ship first controlled workflow with fallback and evidence.
    - operate: Define owner, runbook, monitoring and improvement cadence.
    - expand: Convert successful first workflow into a monthly ops/automation retainer.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-23-contra-ai-powered-digital-ops-lead-manual-ready.md
    prior_draft: output/freelance-proposals/2026-06-23-contra-ai-powered-digital-ops-lead.md
    live_report: reports/freelance/2026-06-23-contra-live-apply-attempt.md
  risks:
    platform_gate: Public featured page exposes the job text but not a direct apply URL; logged-in Contra job feed Apply remained inert.
    schedule: 20 hrs/wk ongoing requires Paulo availability check before accepting.
    conflict: Avoid ServiceNow customer/partner/account conflicts and confidential enterprise details.
    credentials: No production access before contract and secure access path.
  prep_action: Reuse Automation Hygiene Audit and AI Automation Partner Pilot Menu as the first milestone package.
  proposal_angle: Governed AI-powered digital operations: prioritize, automate safely, document ownership and create repeatable cadence.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: MVP de micro-SaaS para profissionais da saude
  url: https://www.99freelas.com.br/project/mvp-de-micro-saas-para-profissionais-da-saude-762750
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: R$ 2.400,00
  entry_scope: Lean MVP with user signup/login, simple appointments panel, reminder/confirmation workflow, status tracking, WhatsApp Cloud API integration if Meta access is ready, or simulation/adapter if Meta approval is not ready.
  phase_2_scope: External calendar sync, approved Meta templates, multi-user/team roles, billing, richer analytics, production hardening and ongoing support.
  buyer_pain: Health professionals want fewer missed appointments without buying a full clinic management suite before validating demand.
  requested_scope: Cadastro de usuarios, painel simples, WhatsApp/API oficial da Meta or simulation, automacoes basicas de lembretes e confirmacoes.
  fastest_safe_first_phase: Ship a narrow validation flow where a professional registers appointments, sends reminder/confirmation messages, and tracks status in the panel.
  tools_and_apis: Next.js or similar web stack, Supabase/Postgres or equivalent, WhatsApp Cloud API when approved, webhook/adapter layer, basic logs and LGPD-safe data minimization.
  procedure:
    - intake: Confirm Meta/WhatsApp Business readiness, minimum appointment fields, message copy, opt-in language and first professional persona.
    - setup: Create repo/app skeleton, auth, database schema, appointment/status model and WhatsApp adapter interface.
    - build: Implement dashboard, patient/appointment CRUD, reminder trigger, confirmation status and provider adapter or simulation.
    - test: Validate happy path, no-response path, remarcado path, duplicate sends, opt-in copy and browser/mobile flow.
    - handoff: Deliver short runbook, environment inventory without secrets, phase-2 backlog and demo script.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-23-99freelas-micro-saas-saude.md
    discovery_checklist: Todo - healthcare WhatsApp SaaS MVP checklist
    architecture_skeleton: Todo - Next.js/Supabase/WhatsApp adapter skeleton
    implementation_checklist: Todo - health appointment reminder MVP checklist
    test_plan: Todo - reminder/confirmation status test cases
    runbook: Todo - Meta-ready vs simulation deployment runbook
  risks:
    platform_tos: Keep all negotiation and contact inside 99Freelas.
    lgpd_or_pii: Health appointment data can become sensitive; collect minimum data, require consent/opt-in, avoid clinical details in reminders.
    credentials: Client must provide provider access through secure channel only after contract; never ask for tokens in chat.
    off_platform: Do not include email, phone or external contact in proposal.
  prep_action: Create a reusable healthcare WhatsApp reminder MVP checklist and adapter skeleton before accepting similar broader builds.
```

## Daily Prep Backlog

| Priority | Prep asset | Why it matters | Status |
|---:|---|---|---|
| 1 | ERP-Claude starter architecture | Directly supports high-fit #62 and future ERP/LLM projects | Checklist ready and no-secret demo created at `demos/freelance/erp-claude-json` |
| 2 | n8n + Evolution API stabilization checklist | Directly supports #63 and WhatsApp agent repair work | Checklist ready: `templates/freelance/checklist-n8n-evolution-whatsapp-agent.md`; optional sample workflow pending |
| 3 | Streamlit BI chat demo | Supports #65 and BI/Power BI chat opportunities | Checklist ready and fake-data demo created at `demos/freelance/streamlit-bi-chat` |
| 4 | AI voice stack comparison and PoC flow | Converts risky voice leads into safer diagnostic proposals | Checklist ready: `templates/freelance/checklist-ai-voice-telephony.md`; optional working demo pending |
| 5 | CRM/Odoo quick discovery worksheet | Improves response to Odoo/CRM questions and reduces credibility risk | Worksheet ready: `templates/freelance/checklist-crm-odoo-discovery.md`; optional CRM snippet bank pending |
| 6 | Kommo+n8n / Kommo Salesbot qualification proposal snippet | Converts repeated Workana/99Freelas CRM+WhatsApp/Instagram+AI scopes into a safer first-phase offer | Checklists ready at `templates/freelance/checklist-kommo-n8n-whatsapp-qualification.md` and `templates/freelance/checklist-kommo-ai-salesbot-clinic-courses.md`; snippet and fake Kommo fixture Todo |
| 7 | Lovable/Supabase member-area starter | Loss #53 suggests future no-code/member-area proposals need visible Lovable proof and a faster first slice | Todo: create starter/demo and screenshot/video proof pack |
| 8 | Speed-first proof pack menu | Converts internal acceleration into visible buyer value: demos, screenshots, JSON examples, fake dashboards and flow diagrams ready before/after acceptance | DELIVERED 2026-06-19: WhatsApp+CRM demo (theme-driven), BI dashboard demo, portfolio showcase + PDF, Loom script, proof-first proposal template (see Proof Assets Inventory) |
| 9 | Client-facing conversion playbook | Makes every proposal shorter, clearer and more competitive without exposing internal tooling | Ready: `templates/freelance/client-facing-conversion-playbook.md` |
| 10 | Legacy PHP/jQuery update checklist | Supports low-ticket 99Freelas jobs like #67 where speed, Git hygiene and scope control win against crowded competition | Todo |
| 11 | E-commerce CRO/Figma handoff mini-pack | Supports Contra/fallback design jobs when budget is good but AI automation jobs are gated | Todo |
| 12 | Brazilian financial automation mini-demo | Supports Upwork #68 and future BR finance/healthtech automations where local fiscal/banking context is the edge; 2026-06-22 Workana boleto/CNAB + WhatsApp demand makes the banking-remittance slice more urgent | Todo: fake CSV lab production data, contract price table, openpyxl billing report, aging dashboard, Sicoob/Sicredi remessa-retorno fixtures, WhatsApp reminder approval flow and Focus NF/BTG/CNAB sandbox checklist |
| 12a | Credit-risk SaaS diagnostic pack | Supports the 2026-06-25 99Freelas credit-risk/score consultation SaaS signal and future regulated financial AI work | Todo: discovery questions, LGPD/fairness/compliance boundary, fake company/borrower fixtures, scorecard schema, audit-log model, explainability note and phase-1 architecture proposal |
| 13 | Restaurant menu/reservation V1 starter | Supports #69 and other local-business web jobs where the winning edge is low price, fast V1 and mobile polish | Todo: static/mobile demo with menu categories, item CRUD mock, reservation form, admin reservation list and acceptance checklist |
| 13a | Restaurant WhatsApp ordering bot demo | Supports 99Freelas restaurant WhatsApp AI/order-management leads that require ready or semi-ready proof, not just a generic chatbot proposal | Todo: fake menu catalog, order state machine, conversation tests, Chatwoot/human handoff script, Meta/provider risk note and demo screenshot/video |
| 14 | GTM/GA4 tracking micro-pack | Supports #70 and similar quick paid traffic setup jobs where a 24-48h checklist beats generic analytics proposals | Todo: event map template, QA screenshot checklist, access request message and follow-up snippet |
| 15 | Transactional WhatsApp bot state-machine demo | Supports #71 and future commerce/subscription WhatsApp bots with APIs, payments, orders and account updates | Todo: fake API adapter, session state diagram, webhook test plan and go-live checklist |
| 16 | WordPress clinic/service SEO migration pack | Supports #72 and many local professional-service sites needing SEO, blog, lead form and tracking | Todo: page map, metadata spreadsheet, handoff doc and tracking validation steps |
| 17 | SaaS promo video storyboard/cutdown pack | Supports #73 and similar SaaS product videos when technical/product understanding is the differentiator | Todo: storyboard, script variants, aspect-ratio matrix and editable-source caveat language |
| 18 | Retention/cancellation WhatsApp agent pack | Supports new Workana-style retention MVPs where the buyer needs motive classification, CRM recovery workflow and reporting rather than generic chatbot answers | Todo: cancellation taxonomy, save-offer decision tree, CRM fields, fake-data dashboard and proposal snippet |
| 19 | Lovable-to-Claude-Code migration pack | Supports #74 and a likely repeatable niche: taking no-code prototypes into maintainable agent-ready codebases | Todo: migration checklist, repo structure template, CLAUDE.md/AGENTS.md starter, local run validation and handoff report |
| 20 | Medical/aesthetic PWA MVP pack | Supports #75 and similar health/clinic/aesthetic SaaS requests | Todo: phase-1 architecture checklist, Supabase schema starter, Pagar.me recurring-payment risk checklist, patient/photo LGPD notes and mobile QA script |
| 21 | Marketplace payment-flow safety pack | Supports #76 and future marketplace/plugin changes involving direct payment, disputes and reimbursements | Todo: payment-state map, dispute/refund checklist, gateway isolation checklist and safety-first proposal snippet |
| 22 | Food-service pricing calculator starter | Supports #77 and restaurant/food buyers needing CMV, margin, app fees and ficha tecnica | Todo: fake-data CMV spreadsheet/app, iFood fee simulator, ficha tecnica template and pricing-impact dashboard |
| 23 | Editorial AI agent workflow pack | Supports #78 and content-agent buyers asking for LinkedIn/article generation with quality control | Todo: briefing schema, article checklist, human-approval Kanban fields, prompt pack and example output set |
| 24 | Local-media editorial automation pack | Supports #128 and buyers asking for WhatsApp-command newsroom/content repurposing workflows | Todo: fake newsroom brief, multi-format output schema, source/citation checklist, WordPress draft-only handoff and no-auto-publish guardrail |
| 25 | Voice AI demo sprint pack | Supports #79 and voice-agent buyers asking for appointment-setting demos | Todo: Vapi vs Retell test checklist, appointment call script, webhook schema, transcript/log table and demo runbook |
| 25 | AI booking marketplace product-engineering pack | Supports Contra/Recondio-style ongoing roles combining Next.js, Clerk, Stripe, marketplace state and AI assistance | Todo: booking marketplace state-machine, Stripe/Clerk role checklist, provider/customer/admin flow map and first-week sprint proposal |
| 26 | Shopify US-market go-live pack | Supports #80 and future ecommerce buyers who already have assets and need fast implementation, tracking and conversion QA | Todo: Shopify launch checklist, Zendrop/PayPal setup caveats, Meta Pixel/GA4 validation checklist, checkout QA script and 4-day V1 follow-up snippet |
| 26a | E-commerce AI operations automation pack | Supports Upwork e-commerce Claude+n8n/Python automation roles where buyers ask for lean architecture, monthly cost discipline and CS/ops/marketing workflow design | Todo: audit checklist, Python-vs-n8n decision tree, monthly cost model, fake Shopify/support/order event fixtures and proposal answer snippet |
| 27 | Clinical AI / voice-EHR MVP pack | Supports the FISIO IA CARE opportunity and future health/neurorehab buyers where voice, prontuario, LGPD and professional review must be scoped before code | Todo: discovery checklist, voice-to-evolution fake-data prototype, access/audit/LGPD guardrails, insurer-report template and predictive-analysis risk language |
| 28 | PHP/OpenAI PDF analysis optimization pack | Supports 99Freelas-style repair jobs where the buyer has a working PHP/OpenAI PDF/tender system that breaks on larger documents and wants diagnosis, optimization and validation rather than a rebuild | Todo: PDF chunking/token-budget checklist, PHP error/log review template, large-table fake fixture, regression test plan and R$450-R$900 diagnostic proposal snippet |
| 29 | Upwork AI automation partner pilot menu | Supports ongoing agency/technical-partner roles where the buyer wants a reliable operator, not a one-off task taker | Ready: `templates/freelance/ai-automation-partner-pilot-menu.md` with diagnostic/hardening, workflow build, RAG/API/agent proof and AI dashboard/operator cockpit pilots; next optional gap is pairing it with a proof-note PDF and private demo checklist |
| 30 | Productized n8n workflow template pack | Supports Workana-style buyers who want importable JSON workflows, global variables, credential placeholders and a tutorial that lets non-technical students/teams install WhatsApp/OpenAI/Sheets automations | Todo: packaging checklist, fake-data workflow manifest, global-variable naming convention, invalid-input test plan and tutorial script |
| 31 | Embeddable AI web chat + WhatsApp lead-capture pack | Supports Workana-style web-chat widget plus WhatsApp automation requests where the buyer needs Supabase-backed answers, lead capture, source attribution and handoff rather than a generic chatbot | Todo: widget requirements checklist, Supabase KB schema, UTM/source field map, install snippet, WhatsApp fallback path, consent language and fake-data QA cases |
| 32 | n8n VPS/Docker/Evolution repair pack | Supports #83 and #85 style urgent 99Freelas fixes where buyers need exact Docker/VPS diagnosis, not a broad automation build | Checklist ready: `templates/freelance/checklist-n8n-vps-docker-evolution.md`; optional fake Docker Compose lab pending |
| 33 | Legal n8n + Claude + WhatsApp demand automation pack | Supports legal-operations Workana demand where autonomous routing must stay bounded by human review, audit logs and data-minimization | Checklist ready: `templates/freelance/checklist-legal-n8n-claude-whatsapp.md`; optional fake case-state demo pending |
| 34 | Challenge submission proof pack | Supports Contra/Bubble-style challenges where the buyer/judges need baseline proof, demo video, written copy and a live app link in one package | Delivered: Contra public post submitted with `AgentOps Deal Desk`, verified Bubble preview, MP4 demo, screenshot proof, judge card and public judge-notes reply. Package: `reports/freelance/2026-06-22-contra-bubble-submission-package.md`; addendum: `reports/freelance/2026-06-22-contra-bubble-winning-addendum.md` |
| 35 | Autonomous sales/admin/RFP agent governance pack | Supports Upwork-style requests for 24/7 agents that touch outbound prospecting, Gmail and WhatsApp alerts, where the biggest risk is unsafe autonomous sending or unclear permissions | Todo: consent/off-platform checklist, Gmail read/draft/send permission matrix, human-approval queue design, audit-log schema, RFP/proposal-draft intake template and demo-video outline |
| 36 | Healthcare WhatsApp check-in pack | Supports Workana-style therapy/clinic follow-up bots where WhatsApp, Claude and weekly summaries touch patient communication and require stricter consent, escalation and review guardrails | Todo: check-in flow checklist, consent/escalation language, therapist weekly summary template, fake patient-message fixture, VPS/Evolution install validation and no-diagnosis proposal snippet |
| 37 | Microsoft 365 recruiting workflow pack | Supports #59 and future HR/recruiting automation projects where buyers require Microsoft 365 Business Basic, tenant ownership, POC evidence and post-delivery support | Checklist ready: `templates/freelance/checklist-microsoft365-recruiting-flow.md`; optional demo outline/fake tenant screenshots pending |
| 38 | Product recommendation WhatsApp bot pack | Supports distributor/commerce buyers who need WhatsApp Cloud + Claude + n8n + Google Sheets recommendations, live pricing, cross-sell and human escalation | Todo: fake product catalog, Google Sheets price schema, prompt/JSON guardrails, cross-sell rules, escalation test cases, Spanish/PT-BR handoff and Meta Cloud API setup checklist |
| 39 | GHL + Stripe + Drive intake handoff pack | Supports Upwork #0 style GHL client-intake builds where payment status, Drive workspace provisioning, CRM write-back and byte-level file integrity need a reliable first V1 | Todo: GHL intake data contract, Stripe event boundary checklist, Drive folder template/naming plan, duplicate-prevention tests, SHA-256 manifest pattern, corrupted-file test fixture and handoff/runbook snippet |
| 40 | Financial AI reconciliation workflow pack | Supports Arc #87 and similar enterprise AI workflow roles where buyers need messy financial data ingestion, matching, confidence scores, review queues and audit trails | Checklist ready: `templates/freelance/checklist-financial-ai-workflow-reconciliation.md`; next optional gap is fake bank/GL fixture generation plus a small React/Streamlit review UI demo |
| 41 | Claude Code / MCP automation lead sprint pack | Supports fresh Upwork roles asking for Claude Code, MCP, n8n, Make, GHL, Supabase and API automation as an ongoing technical lead rather than a one-off workflow builder | Todo: first-week sprint checklist, MCP permission matrix, GHL/Supabase/API intake worksheet, approval-queue diagram, client-work triage board and proof-note snippet |
| 42 | AI automation enablement and handoff pack | Supports Workana/Upwork buyers who explicitly require documentation, handover video, team training and support after n8n/AI-agent delivery | Todo: handoff video script, admin SOP template, 4-hour training agenda, support boundary language, acceptance checklist and change-request log |
| 42 | Relevance AI campaign workflow pack | Supports fresh Upwork roles asking for Relevance AI-style agents, Claude/ChatGPT API workflows, GHL/CRM, email/task integrations and documented Loom handoff for campaign operations | Todo: platform-agnostic workflow checklist, CRM/email/task permission matrix, approval queue, fake campaign workflow demo script, handoff/Loom outline and proposal snippet |
| 43 | Native Claude/Anthropic agent bundle pack | Supports 99Freelas #102 and similar buyers who want direct Claude agents without n8n/Make/Zapier | Todo: native-Claude agent intake checklist, Node/Supabase starter, Meta/Instagram permission matrix, video workflow option map, Meta Ads reporting schema and no-unsafe-DM proposal snippet |
| 44 | Production n8n operations pack | Supports Workana-style buyers asking for WhatsApp Cloud + n8n + payments + Google Workspace with qa/prod separation, observability, retries, idempotency, audit logs and latency/stability tests | Checklist ready: `templates/freelance/checklist-production-n8n-operations.md`; next gap is fake webhook test harness with payment event replay, duplicate webhook delivery and retry/idempotency validation |
| 45 | WhatsApp + Drive document routing pack | Supports 99Freelas-style Evolution API/n8n projects where WhatsApp files must land in Google Drive with folder permissions, duplicate handling and handoff | Checklist ready: `templates/freelance/checklist-whatsapp-drive-document-routing.md`; next gap is fake-data workflow manifest and mock Drive adapter test plan |

## Proof Assets Inventory (2026-06-19)

Reusable proof to cite/attach in proposals. All verified rendering, fake data only.

| Asset | Path | Use for |
|---|---|---|
| WhatsApp AI + CRM demo (theme-driven) | `demos/freelance/whatsapp-ai-crm-flow/index.html` (`?tema=clinica` \| `?tema=imagem-masculina`) | WhatsApp/n8n/CRM/RevOps leads (#29, #48, #50, #63, #71, #18-retention) |
| BI dashboard + AI chat demo | `demos/freelance/bi-dashboard-ai-chat/index.html` | Power BI/Looker/BI/chat-over-data leads (#39, #65, #66, #48) |
| ERP -> Claude -> JSON demo | `demos/freelance/erp-claude-json/` | ERP+LLM leads (#62) |
| Streamlit BI chat (live run) | `demos/freelance/streamlit-bi-chat/` | live demo in call with client data |
| Portfolio showcase (landing) | `demos/freelance/portfolio-showcase/index.html` | public proof link (Upwork/Contra/LinkedIn); deploy gated |
| Portfolio one-pager PDF | `demos/freelance/portfolio-showcase/paulo-pierrondi-portfolio.pdf` | attach where external links are forbidden (99Freelas proposals) |
| Loom script 60-90s | `templates/freelance/loom-proof-video-script.md` | record proof video per category |
| Proof-first proposal template | `templates/freelance/proposal-proof-first.md` | cold-start/live-lead conversion |
| Proof-first pack top-5 | `output/freelance-proposals/2026-06-19-proof-first-pack-top5.md` | ready-to-send for #62, #65, #29, #48, #66 |
| AgentOps Deal Desk challenge demo | `reports/freelance/contra-bubble-agentops-demo/index.html` plus `outputs/agentops-deal-desk-submission-demo.mp4` | Contra/Bubble challenge submission and future proof that Paulo can create a polished AI opportunity dashboard fast |

Rule: when a proposal touches WhatsApp/CRM/BI/ERP, cite or attach the matching proof asset
instead of promising. Adapt the demo theme to the buyer niche when it raises fit.

## Human Gates

- Do not use real client credentials or production data before a signed contract and secure access path.
- Do not scrape, bypass CAPTCHA/Cloudflare, automate spammy DMs, move conversations off-platform where prohibited, or promise guaranteed Meta/WhatsApp approvals.
- Do not buy credits, boosts, plans, Pro/free trials or paid moderation without Paulo's explicit approval.
- Keep this matrix public-safe and redacted.

## 2026-06-23 99Freelas Apply Pass Learning

The Gmail/Chrome apply pass sent 14 eligible 99Freelas proposals and exposed repeatable demand clusters worth productizing before the next batch.

| Signal | Evidence | Prep action |
|---|---|---|
| Marketplace operations agents | Mercado Livre fulfillment/stock project #89 | Create a marketplace ops agent checklist covering order states, SKU/stock reconciliation, API/scraper boundary, manual review queue and rollback plan |
| Meta WhatsApp Cloud setup | WhatsApp Cloud API project #90 plus repeated WhatsApp demand in prior rows | Split WhatsApp prep into two tracks: official Cloud API setup checklist and unofficial Evolution/n8n repair checklist; never promise Meta approval |
| Supabase SaaS backend slices | Supabase Auth/progress/Stripe/Vercel #88 and health micro-SaaS #93 | Create a Supabase SaaS V1 starter contract with Auth, roles, core table, Stripe sandbox, Vercel deploy checklist and no-secret access instructions |
| Clinic/health lead systems | Therapist landing page #98 and health SaaS #93 | Reuse healthcare guardrails: LGPD, consent, minimum data, no diagnosis, human review, tracking and WhatsApp/form capture |
| Legal AI monitoring | Judicial process monitoring #101 | Keep proposals diagnostic/prototype-first: source-of-truth mapping, audit log, human validation and explicit no-scraping/no-legal-advice boundary |

## 2026-06-24 99Freelas Screenshot Batch Learning

Paulo asked Codex to handle five 99Freelas leads visible in Gmail. Public liveness check found the current project pages and avoided two stale traps: the old production-dashboard project `752297` was closed, while the current matching project is `763109`; old e-book landing projects were concluded, while the current matching project is `763071`.

| Project | URL | Fit | Readiness | Entry price | First safe phase | Prep gap |
|---|---|---:|---:|---:|---|---|
| Dashboard de producao - planejado vs realizado | https://www.99freelas.com.br/project/dashboard-de-producao-planejado-vs-realizado-763109?fs=t | 4 | 5 | R$650 | Power BI/Excel model with planned vs actual, WIP/gargalo KPIs, dashboard and update handoff | Add manufacturing KPI fixture/demo to BI proof pack |
| Automacao de vendas e agendamento via WhatsApp com n8n e IA | https://www.99freelas.com.br/project/desenvolvedor-n8n-ia-automacao-de-vendas-e-agendamento-via-whatsapp-para-763103?fs=t | 5 | 4 | R$1.100 | n8n MVP with WhatsApp agent, tide-table tool, payment adapter boundary, fallback and conversation tests | Create tourism booking/tide-table n8n checklist and fake data demo |
| Criacao de site profissional, moderno e responsivo | https://www.99freelas.com.br/project/criacao-de-site-profissional-moderno-e-responsivo-763101?fs=t | 3 | 5 | R$450 | Responsive institutional V1 with home, services/products, contact CTA, light effects and performance sanity check | Keep as low-ticket filler only; portfolio proof should not over-focus on generic sites |
| Desenvolvimento de dashboard corporativo de gestao de frota | https://www.99freelas.com.br/project/desenvolvimento-de-dashboard-corporativo-de-gestao-de-frota-763077?fs=t | 4 | 4 | R$750 | Fleet data model, consolidated base, Power BI executive/analytical dashboard and refresh handoff | Create fleet KPI schema: locadora, combustivel, multas, manutencao, mobilidade |
| Landing page para venda de e-book | https://www.99freelas.com.br/project/landing-page-para-venda-de-e-book-763071?fs=t | 3 | 5 | R$300 | Lightweight conversion landing page with headline, benefits, CTA, checkout button and mobile QA | Reuse landing template; only pursue when fast/review-building |

Proposal artifact: `output/freelance-proposals/2026-06-24-99freelas-five-screenshot-projects.md`.

## 2026-06-25 99Freelas Invoice Processing Agent Learning

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Agente de processamento de notas fiscais
  url: https://www.99freelas.com.br/project/bid/agente-de-processamento-de-notas-fiscais-763269
  score_fit: 5
  score_readiness: 4
  lowest_defensible_entry_price: R$750-R$950 for phase 1 only
  entry_scope: Gmail/Drive/Sheets invoice intake MVP with OCR extraction, core validations, duplicate checks, status classification and divergence report on sample notes
  phase_2_scope: Itaú CNAB/API/payment-return handling, proof archiving, payment status reconciliation and production hardening after WMM confirms bank product and layout
  buyer_pain: 1,000 monthly medical/hospital service invoices create manual risk across intake, validation, payment scheduling, audit logs and payment proof delivery
  requested_scope:
    - monitor inbound email
    - extract ticket and invoice PDFs
    - save PDFs in Google Drive
    - OCR/AI extraction of fiscal, patient, amount, tax and bank fields
    - validate ticket, legibility, duplicates, CNPJ, due date, math consistency and provider bank data
    - update accounts payable spreadsheet
    - generate divergence report
    - generate Itaú payment file and process bank return/proofs
  fastest_safe_first_phase: build a working auditable slice before promising banking finalization: email intake, Drive storage, spreadsheet control, extraction schema, validation rules and exception report
  tools_and_apis:
    - Gmail/Google Workspace
    - Google Drive
    - Google Sheets
    - OCR/LLM extraction
    - CNPJ validation
    - provider master-data spreadsheet
    - Itaú CNAB 240 or client-specific bank layout pending confirmation
  procedure:
    - intake: confirm mailbox access path, Drive folder, master provider spreadsheet, 20-50 sample PDFs and no-secret access method
    - setup: define folder naming, spreadsheet schema, extraction JSON and audit-log columns
    - build: implement ingestion, PDF save, OCR extraction, validation rules, classification statuses and divergence report
    - test: run sample batch with duplicate, illegible, invalid CNPJ, missing due date and value mismatch cases
    - handoff: deliver spreadsheet, Drive structure, runbook and phase-2 Itaú layout checklist
  reusable_assets:
    proposal_snippet: Todo - invoice processing phase-1 proposal snippet
    discovery_checklist: Todo - medical invoice processing and Itaú layout checklist
    architecture_skeleton: Todo - Gmail Drive Sheets OCR invoice pipeline skeleton
    implementation_checklist: Todo - invoice validation MVP checklist
    test_plan: Todo - invoice extraction and duplicate-validation fixture set
    runbook: Todo - accounts payable audit and Itaú handoff runbook
  risks:
    platform_tos: Keep all negotiation and contact inside 99Freelas until contracted.
    lgpd_or_pii: Medical/patient invoice data is sensitive; use minimum necessary fields, access control, audit logs and sample/fake data before secure contract access.
    credentials: Client must provide Google/Itaú access through secure account/channel only after contract; never ask for credentials in chat or proposal.
    off_platform: Do not include external contact details in proposal.
  prep_action: Create a Brazilian medical invoice-processing pack with extraction schema, validation checklist, provider-master comparison rules and Itaú CNAB/API discovery questions.
```

## 2026-06-25 99Freelas Google Ads Lead Landing Page Learning

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Landing page para captacao de leads no Google
  url: https://www.99freelas.com.br/project/landing-page-para-captacao-de-leads-no-google-763492
  score_fit: 3
  score_readiness: 5
  submitted: true
  submitted_offer: R$50
  platform_final_offer: R$58.82
  duration: 1 day
  buyer_pain: Client needs a fast landing page on Hostinger to capture Google-originated leads from a predefined briefing, with template usage explicitly allowed.
  requested_scope:
    - use existing Hostinger hosting
    - receive domain and technical contact from client
    - develop landing page from predefined briefing
    - focus page on Google lead capture
    - deliver quickly
    - template allowed
  fastest_safe_first_phase: One responsive lead-capture landing page with headline, CTA, benefit blocks, form or lead action from briefing, Hostinger publication and mobile/desktop sanity check.
  tools_and_apis:
    - Hostinger
    - HTML/CSS/JS or builder/template selected after access and briefing
    - optional Google tag/tracking only if client provides safe access and explicit scope
  procedure:
    - confirm briefing, target lead action, copy, brand assets and Hostinger access path
    - pick or adapt a lightweight template
    - build hero, CTA, benefits, credibility and lead form/action
    - publish on Hostinger and verify domain routing with client technical contact
    - run mobile/desktop visual check and one quick refinement round
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-25-99freelas-landing-page-leads-google-763492.md
    discovery_checklist: Todo - Hostinger lead landing intake checklist
    implementation_checklist: Todo - fast landing page QA checklist for forms, CTA, mobile and basic performance
    test_plan: Todo - landing page lead capture smoke test with fake submission where allowed
  risks:
    platform_tos: Keep negotiation and contact inside 99Freelas until contracted.
    credentials: Hostinger/domain access must come through a secure post-contract path; never ask for passwords in proposal/chat.
    scope_creep: Google Ads performance, campaign setup, conversion tracking, CRM integration and copywriting depth are not included in a R$50 one-day scope unless explicitly upsold.
    off_platform: Proposal included no external contact details.
  prep_action: Create a Hostinger quick-landing checklist and reusable one-page lead capture template with form/CTA smoke-test steps.
```

## 2026-06-26 Workana Language-Learning AI MVP Learning

```yaml
opportunity_learning:
  platform: Workana
  title: Plataforma de Idiomas B1 con IA
  url: https://www.workana.com/job/plataforma-de-idiomas-b1-con-ia
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: Paid diagnostic / phase-1 prototype only
  entry_scope: WhatsApp or web intake, Airtable learner record, one German B1 exercise-generation flow, progress update and educator/admin review path using fake data first.
  phase_2_scope: Full course platform, multiple exam sections, analytics, payments, tutor workflow, production WhatsApp templates and long-term curriculum management.
  buyer_pain: Buyer wants a guided language-learning platform that can generate B1 exam-style practice while tracking learner context and progress across WhatsApp/web touchpoints.
  requested_scope:
    - generate German B1 exam exercises with AI
    - support WhatsApp and/or web learner interaction
    - use Airtable for learner/context/progress data
    - update progress and keep user-specific context
    - produce a prototype quickly
  fastest_safe_first_phase: Build a no-secret prototype around one B1 exercise type, one learner profile, progress logging and human/educator review before expanding curriculum coverage.
  tools_and_apis:
    - WhatsApp Business Cloud API or approved provider
    - OpenAI or Anthropic
    - Airtable
    - lightweight web app or form
    - prompt/version log
    - progress/status table
  procedure:
    - intake: Confirm language level, exam section, exercise rubrics, learner fields, WhatsApp/provider status and review owner.
    - setup: Create fake Airtable schema for learners, exercises, attempts, feedback and progress.
    - build: Implement one intake path and one AI exercise-generation flow with stored attempts and progress update.
    - test: Validate output level, hallucination risk, retry behavior, opt-in language and educator override.
    - handoff: Deliver flow map, Airtable schema, prompt notes, QA cases and phase-2 backlog.
  reusable_assets:
    proposal_snippet: Todo - Workana language-learning MVP proposal snippet
    discovery_checklist: templates/freelance/checklist-language-learning-ai-mvp.md
    architecture_skeleton: Todo - WhatsApp/web + Airtable + AI exercise-generation skeleton
    implementation_checklist: templates/freelance/checklist-language-learning-ai-mvp.md
    test_plan: Todo - fake learner attempts, progress updates and educator review test cases
    runbook: Todo - prompt/versioning and curriculum-review handoff
  risks:
    platform_tos: Keep negotiation and contact inside Workana.
    whatsapp_policy: Confirm opt-in, templates and approved provider path before production messaging.
    lgpd_or_pii: Learner data can include educational/personal context; use minimum fields, fake data first and secure access only after contract.
    credentials: No Airtable, WhatsApp or AI provider credentials before contract and secure access.
    quality: AI-generated exercises need educator/human review and must not claim official exam guarantee.
  prep_action: Checklist created at `templates/freelance/checklist-language-learning-ai-mvp.md`; next prep is fake Airtable/exercise fixtures.
```

## 2026-06-26 Workana Odoo + WhatsApp Preauthorization Learning

```yaml
opportunity_learning:
  platform: Workana
  title: Automatizacion Integral de Ventas y Compras via Whatsapp con N8n, Ia y Odoo
  url: https://www.workana.com/job/automatizacion-integral-de-ventas-y-compras-via-whatsapp-con-n8n-ia-y-odoo
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: Paid diagnostic / phase-1 proof only
  entry_scope: WhatsApp intake, AI intent extraction, Odoo stock/price lookup, one draft sales-order approval path and one stock-insufficient RFQ approval path using fake data first.
  phase_2_scope: Payment-link automation, warehouse/logistics handoff, supplier confirmation, portal/PDF delivery, retry/idempotency hardening, production templates and full monitoring.
  buyer_pain: Buyer wants WhatsApp to become an operational sales and purchasing front door without inventing product data or bypassing internal approval controls.
  requested_scope:
    - receive customer messages through WhatsApp Cloud API
    - use n8n and AI to extract intent, product and quantity
    - query real Odoo stock, price, name and SKU
    - create draft sales orders when stock is enough
    - create draft purchase RFQs when stock is insufficient
    - route both flows through internal preauthorization before customer/payment/logistics actions
  fastest_safe_first_phase: Prove the controlled happy path and stock-insufficient path with fake Odoo records, explicit approval states and no autonomous payment or warehouse action.
  tools_and_apis:
    - Odoo API / ORM or approved connector after edition and hosting are confirmed
    - n8n
    - WhatsApp Cloud API or approved provider
    - AI provider for bounded intent extraction
    - payment link provider only after contract and secure access
    - audit log / approval table
  procedure:
    - intake: Confirm Odoo edition, hosting, API availability, product/SKU model, approval rules, payment provider and WhatsApp provider.
    - setup: Define message-to-intent schema, Odoo lookup fields, order/RFQ draft fields and approval-state names.
    - build: Implement one fake-data flow for stock available and one for stock insufficient.
    - test: Validate hallucination guardrails, missing SKU, duplicate WhatsApp message, rejected approval, payment not sent before approval and warehouse not notified before confirmed payment.
    - handoff: Deliver state diagram, n8n flow map, Odoo field map, risk register and phase-2 backlog.
  reusable_assets:
    proposal_snippet: Todo - Workana Odoo WhatsApp preauthorization proposal snippet
    discovery_checklist: templates/freelance/checklist-odoo-whatsapp-preauthorization.md
    architecture_skeleton: Todo - fake Odoo product/order/RFQ fixture pack
    implementation_checklist: templates/freelance/checklist-odoo-whatsapp-preauthorization.md
    test_plan: Todo - duplicate webhook, approval reject and stock-insufficient test cases
    runbook: Todo - Odoo approval and WhatsApp notification handoff
  risks:
    platform_tos: Keep negotiation and contact inside Workana.
    whatsapp_policy: Confirm opt-in, templates and approved provider before production messaging.
    lgpd_or_pii: Customer and order data require minimum fields, secure access and audit logs.
    credentials: No Odoo, WhatsApp, AI or payment credentials before contract and secure access.
    payment_boundary: Do not send payment links, PDFs or warehouse notifications before explicit internal approval and payment-state validation.
  prep_action: Checklist created at `templates/freelance/checklist-odoo-whatsapp-preauthorization.md`; next prep is fake Odoo fixtures and an approval-state demo.
```

## 2026-06-26 99Freelas Manual Apply Batch Learning

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Integracao do Tiny com Claude.ai e planilha
  url: https://www.99freelas.com.br/project/integracao-do-tiny-com-claude-ai-e-planilha-763723
  score_fit: 4
  score_readiness: 5
  lowest_defensible_entry_price: R$750 for first validated integration
  entry_scope: Map Tiny fields, extract or export approved ERP data, normalize into Excel, and prepare the Claude/dashboard update flow.
  phase_2_scope: Scheduled refresh, richer ERP metrics, error monitoring and direct dashboard automation if Claude-side integration permits.
  buyer_pain: Monthly ERP-to-Excel-to-Claude dashboard reporting is manual and stale.
  tools_and_apis: Tiny ERP API or approved export, Excel, Claude.ai workflow boundary, Node.js/Python if needed.
  fastest_safe_first_phase: One repeatable Tiny-to-sheet update with documented Claude handoff and a clear API/manual boundary.
  risks:
    credentials: No Tiny/API credentials before contract and secure access.
    platform_boundary: Claude.ai may require a manual or semi-manual handoff unless an approved API path exists.
  prep_action: Reuse ERP-Claude checklist; add Tiny-specific field-map snippet if the client replies.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Chatbot com IA para escritorio de advocacia (n8n + WhatsApp)
  url: https://www.99freelas.com.br/project/chatbot-com-ia-para-escritorio-de-advocacia-n8n-whatsapp-763690
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: R$950 for one playbook MVP
  entry_scope: One legal-commercial qualification playbook, WhatsApp/n8n flow, structured summary, Google Calendar scheduling, follow-up rules and human fallback.
  phase_2_scope: Multiple legal products, CRM enrichment, analytics, advanced follow-up and production monitoring.
  buyer_pain: Paid traffic leads need fast triage, scheduling and follow-up without losing legal/commercial control.
  tools_and_apis: n8n, WhatsApp official/provider-approved path, AI provider, Google Calendar/Meet, CRM later.
  fastest_safe_first_phase: Qualify and schedule one demand type with no autonomous legal advice.
  risks:
    legal: AI must not provide legal advice; route judgment and sensitive cases to humans.
    whatsapp_policy: Confirm opt-in, templates and approved provider before production messages.
    pii_lgpd: Legal lead data requires minimum fields, secure access and audit trail.
  prep_action: Reuse legal n8n/Claude/WhatsApp checklist; prepare legal lead-summary schema if the client replies.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Criacao de agentes no Claude para automacao comercial do buffet
  url: https://www.99freelas.com.br/project/criacao-de-agentes-no-claude-para-automacao-comercial-do-buffet-763567
  score_fit: 4
  score_readiness: 5
  lowest_defensible_entry_price: R$750 for first sales-agent flow
  entry_scope: FAQ and lead qualification flow, Claude prompt/rules, WhatsApp/provider path, CRM status update, hot-lead alert and runbook.
  phase_2_scope: More event packages, campaign-specific prompts, sales analytics, richer CRM automation and ongoing optimization.
  buyer_pain: Owner handles repetitive WhatsApp/customer conversations manually and needs to protect time for hot leads.
  tools_and_apis: Claude, WhatsApp approved provider, CRM, optional n8n/Make or lightweight backend.
  fastest_safe_first_phase: One controlled commercial assistant with human fallback and CRM registration.
  risks:
    whatsapp_policy: No unsupported outbound/spam automation; require opt-in and approved provider.
    scope_sprawl: Start with one event/buffet flow before broad multi-agent build.
  prep_action: Package a small-service WhatsApp/CRM/Claude sales-agent snippet for restaurants/events.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Automacao de preenchimento de PDFs via Telegram no macOS
  url: https://www.99freelas.com.br/project/automacao-de-preenchimento-de-pdfs-via-telegram-no-macos-763570
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: R$750 for 1-2 template proof
  entry_scope: Telegram bot with authorized user, template selection, data validation, Python + AppleScript/System Events Acrobat filling, saved copy and return file.
  phase_2_scope: More templates, better PDF field detection, queue/history, admin config and broader validation.
  buyer_pain: Manual PDF filling on macOS needs a reliable Telegram-controlled workflow.
  tools_and_apis: Python, Telegram Bot API, AppleScript/System Events, Adobe Acrobat, macOS folders.
  fastest_safe_first_phase: Prove repeatable filling on 1-2 fixed PDFs before scaling.
  risks:
    fragility: Tab/keyboard automation depends on exact Acrobat field order and should have tests/fallback.
    credentials: Telegram bot token and files only after contract and secure access.
  prep_action: Create a macOS PDF automation checklist if the client replies.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Integracao da API WBuy para produto sob medida com calculadora dinamica
  url: https://www.99freelas.com.br/project/integracao-da-api-wbuy-para-produto-sob-medida-com-calculadora-dinamica-763677
  score_fit: 4
  score_readiness: 4
  lowest_defensible_entry_price: R$650 for first checkout-safe integration
  entry_scope: Validate WBuy API capabilities, create PHP/Node backend endpoint, pass calculator values, create/update dynamic product when allowed, return product ID/cart action and persist measures/options.
  phase_2_scope: More option rules, admin config, order reconciliation, analytics and failure monitoring.
  buyer_pain: The visual calculator changes price, but the platform checkout still uses fixed product price.
  tools_and_apis: WBuy API, PHP or Node.js, storefront calculator, cart/checkout, order metadata.
  fastest_safe_first_phase: Confirm API capability and implement the smallest checkout-safe dynamic product path.
  risks:
    platform_limitation: WBuy may not support temporary/dynamic product behavior exactly; need fallback before full build.
    checkout_safety: Do not break standard checkout or price/order consistency.
  prep_action: Prepare an ecommerce dynamic-price API checklist covering cart, order metadata and fallback behavior.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Upgrade de sistema Django API REST, modulo de inspecao e interface movel
  url: https://www.99freelas.com.br/project/upgrade-de-sistema-django-api-rest-modulo-de-inspecao-e-interface-movel-763934
  score_fit: 4
  score_readiness: 4
  submitted: true
  submitted_bid: R$1.200 receive / R$1.411,76 final / 5 days
  lowest_defensible_entry_price: R$1.200 for first technical phase below visible average R$1.516,32
  entry_scope: Review technical PDF, validate Django model/API design, structure the first protected DRF endpoints and define or implement the first mobile/PWA inspection slice with QR code, checklist and mandatory photo evidence.
  phase_2_scope: Full Django inspection module, QR label batch PDFs, consolidated monthly branded PDF with photos, 60/30/15-day email alert job, admin hardening, tests and production rollout.
  buyer_pain: Buyer has a production Django monolith for companies, students and certificates and needs to add a field-inspection compliance module without breaking the existing admin workflow.
  requested_scope: Equipment and inspection models, DRF API, mobile/responsive/PWA field interface, camera access for QR and evidence photos, dynamic extinguisher/hydrant checklists, PDF reports, QR label sheets and scheduled alerts.
  fastest_safe_first_phase: In 5 days, turn the PDF into an implementation backlog and deliver the model/API/mobile first slice or a concrete technical base for the remaining build.
  tools_and_apis: Django, Django Rest Framework, PostgreSQL or MySQL, Django Admin, Tailwind plus Alpine for monolith-friendly PWA, optional React/Vue only if decoupling is justified, camera/QR browser APIs, Celery/cron/management command, PDF generation library.
  procedure:
    - intake: Review PDF, current repo, database engine, auth model, hosting constraints, field technician roles, mobile browser targets and current deployment process.
    - setup: Create safe local/dev setup, migrations plan, permission model, sample equipment/inspection fixtures and acceptance criteria for mandatory photo evidence.
    - build: Implement or validate Equipment/Inspection models, protected DRF endpoints, QR lookup, checklist state and first mobile/PWA submission flow.
    - test: Validate QR scan, offline/weak-signal assumption if relevant, irregularity-without-photo block, access control, file upload, migration rollback and PDF/report data consistency.
    - handoff: Deliver implementation notes, acceptance tests, deployment risks, runbook and phase-2 estimate for reports, labels and alerts.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-27-99freelas-upgrade-django-api-rest-inspecao-mobile-763934.md
    discovery_checklist: Todo - Django/DRF field-inspection intake checklist
    architecture_skeleton: Todo - Django inspection module model/API/PWA architecture skeleton
    implementation_checklist: Todo - mandatory photo evidence and QR checklist implementation plan
    test_plan: Todo - field inspection PWA QR/photo/permission/PDF test plan
    runbook: Todo - Django inspection module deployment and handoff runbook
  risks:
    production_system: Existing monolith is in production; require backup, migration plan and dev/staging path before changes.
    lgpd_or_pii: Companies, students, technicians and inspection photos may contain sensitive operational data; use minimum sample data before contract.
    credentials: No production credentials, database dumps or API keys through chat, repo, email or screenshots.
    mobile_reliability: Camera, QR and photo upload behavior must be tested on real target mobile browsers.
    scope_sprawl: Full system could exceed the entry bid; phase 1 must stay bounded until PDF/repo review.
  prep_action: Create a reusable Django/DRF field-inspection checklist covering models, DRF auth, QR/camera PWA, mandatory evidence, PDF reports, alerts and production migration safeguards.
```

## Reviewed Opportunities - 2026-06-28

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Implementacao de Kommo CRM com bot de IA e integracoes WhatsApp/IG
  url: https://www.99freelas.com.br/projects?q=Kommo%20CRM%20bot%20IA
  score_fit: 4.5
  score_readiness: 4
  lowest_defensible_entry_price: R$850-R$1.400 for a first Kommo foundation plus one AI qualification path
  entry_scope: Configure the Kommo base, safely import/clean the approved contact spreadsheet, connect one primary channel and launch one controlled AI qualification flow with human review.
  phase_2_scope: Additional WhatsApp numbers, Instagram channel, course/clinic funnel segmentation, calendar/payment/course integrations, dashboards, reactivation campaigns and ongoing optimization.
  buyer_pain: Buyer needs a clinic/course sales operation organized in Kommo, with existing contacts and WhatsApp/Instagram intake turned into a qualified, follow-up-ready pipeline.
  requested_scope: Configure users, groups and permissions, import and clean about 1,100 contacts, create custom fields, integrate WhatsApp and Instagram channels and create an AI bot for qualification/follow-up.
  fastest_safe_first_phase: In 3-5 days, deliver one working funnel path from inbound lead to Kommo lead update and human follow-up, using redacted sample contacts before full import.
  tools_and_apis: Kommo CRM, Kommo Salesbot, approved WhatsApp connector or WhatsApp Cloud API, Instagram/Meta channel, optional n8n/webhook layer, LLM API, spreadsheet import and logs.
  data_sources: Client-approved contact spreadsheet, lead-source/channel definitions, clinic/course offer FAQ, stage definitions and sample conversations after contract.
  auth_or_secret_boundary: No Kommo tokens, WhatsApp/Instagram credentials, contact exports, cookies or API keys in chat, repo, report or email; use client-controlled access after contract.
  compliance_or_tos_risk: LGPD contact-base consent, WhatsApp/Instagram messaging rules, health/aesthetic claims, bulk-message risk and off-platform contact restrictions.
  procedure:
    - intake: Confirm Kommo workspace state, funnel priority, contact-base consent, approved channels, stage definitions, fields and human handoff rules.
    - setup: Configure permissions, pipeline, fields, loss reasons and a redacted import test before full contact migration.
    - build: Connect one channel and implement a Salesbot/webhook AI path that extracts qualification fields and alerts a human.
    - test: Validate duplicate import handling, opt-in language, edge questions, low-confidence fallback, CRM field writes and human override.
    - handoff: Deliver admin runbook, field map, test evidence, residual risks and phase-2 backlog.
  reusable_assets:
    proposal_snippet: Todo - 99Freelas Kommo AI Salesbot clinic/courses proposal snippet
    discovery_checklist: templates/freelance/checklist-kommo-ai-salesbot-clinic-courses.md
    architecture_skeleton: Todo - Kommo channel/Salesbot/human-review architecture sketch
    implementation_checklist: templates/freelance/checklist-kommo-n8n-whatsapp-qualification.md
    test_plan: Todo - Kommo import, AI field-write and channel-policy QA cases
    runbook: Todo - Kommo admin handoff and escalation runbook
  risks:
    platform_tos: Keep negotiation inside 99Freelas and do not move contact off-platform.
    lgpd_or_pii: Existing contact base may contain personal and health-adjacent data; use minimal/redacted samples and client-confirmed consent.
    credentials: Client credentials and channel tokens must stay in secure client-controlled paths after contract.
    bulk_messaging: Do not promise mass reactivation or outbound sends without opt-in, templates, rate limits and human approval.
  readiness_gap: Build a fake Kommo pipeline/contact-base fixture and proposal snippet before bidding aggressively.
  prep_action: Created `templates/freelance/checklist-kommo-ai-salesbot-clinic-courses.md`; next prep is a proposal snippet plus fake import/qualification test fixture.
  proposal_angle: Kommo foundation plus one safe AI qualification path first: clean data, controlled CRM writes, WhatsApp/Instagram compliance and human handoff.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Arquiteto de sistemas para unificacao de infraestrutura tecnologica
  url: https://www.99freelas.com.br/project/arquiteto-de-sistemas-para-unificacao-de-infraestrutura-tecnologica-759909
  score_fit: 5
  score_readiness: 5
  lowest_defensible_entry_price: R$900-R$1.500 for a paid AI/automation infrastructure audit and first control-tower slice
  entry_scope: Map the current tool stack, ownership, access boundaries, dashboards, automations, logs and deployment surfaces; deliver an actionable architecture map plus one high-value governance/monitoring fix.
  phase_2_scope: Unified control tower, role/access matrix, production observability, workflow registry, GitHub/Vercel/Supabase hardening, automation runbooks and phased implementation backlog.
  buyer_pain: Buyer has many disconnected AI tools, dashboards and automations across Cursor, GPT, Claude, GitHub, Vercel, Supabase, Chatwoot, Make, Tiny, Kommo and reporting surfaces, and needs a professional architecture layer to regain visibility, control and scalability.
  requested_scope: Diagnose decentralized systems, analyze responsibilities and integrations, identify obsolete or duplicated parts, propose a scalable architecture and organize AI agents, dashboards, flows, logs, access control and future evolution.
  fastest_safe_first_phase: In 3-5 days, deliver the system map, risk/duplication matrix, ownership/access map, priority backlog and one first control-tower artifact such as a workflow registry or monitoring dashboard blueprint.
  tools_and_apis: GitHub, Vercel, Supabase, Chatwoot, Make, Tiny, Kommo, LLM agents, dashboards, logs, access matrix, architecture documentation and optional read-only exports after contract.
  data_sources: Client-approved architecture notes, repo/service inventory, dashboard screenshots/exports, workflow lists, log samples and non-secret configuration metadata.
  auth_or_secret_boundary: No credentials, cookies, API keys, production dumps or provider exports in chat, repo, email or screenshots; use client-controlled read-only access or redacted inventory after contract.
  compliance_or_tos_risk: Shadow-AI governance, access control, customer data exposure, production change risk, platform ToS for automation providers and off-platform contact rules.
  procedure:
    - intake: Confirm tools in scope, current pain points, business-critical flows, owners, access paths, production surfaces and prohibited data.
    - setup: Build a redacted inventory of systems, integrations, secrets boundaries, user roles, dashboards, automations and deployment paths.
    - build: Produce the control-tower map, duplication/risk matrix, recommended target architecture and one first artifact such as workflow registry, access matrix or monitoring blueprint.
    - test: Validate traceability from lead/order/support/reporting event to system of record, owner, log source, failure path and human escalation.
    - handoff: Deliver architecture note, prioritized backlog, operating cadence, risk register, implementation phases and secure-access requirements.
  reusable_assets:
    proposal_snippet: Todo - 99Freelas AI operations control-tower proposal snippet
    discovery_checklist: templates/freelance/checklist-ai-ops-control-tower.md
    architecture_skeleton: Todo - AI/automation toolchain control-tower architecture skeleton
    implementation_checklist: Todo - workflow registry, access matrix and observability implementation plan
    test_plan: Todo - integration traceability and access-boundary test plan
    runbook: Todo - AI operations governance and handoff runbook
  risks:
    platform_tos: Keep negotiation inside 99Freelas; no off-platform contact details.
    lgpd_or_pii: Current dashboards, support tools and CRMs may expose client or operational data; use redacted inventory and minimal samples.
    credentials: Require secure client-controlled access after contract; never receive or store raw secrets.
    production_change: Start with audit, map and control artifact before touching production automations or deployments.
    scope_sprawl: Do not promise full infrastructure unification in the entry price; sell the first control-tower slice and implementation roadmap.
  readiness_gap: Delivery readiness is strong, but Paulo needs a reusable control-tower checklist and proposal snippet to respond faster to AI sprawl/governance opportunities.
  prep_action: Created `templates/freelance/checklist-ai-ops-control-tower.md`; next prep is a short proposal snippet and one-page architecture skeleton.
  proposal_angle: Enterprise-grade AI/automation architecture cleanup: turn scattered agents, dashboards and integrations into a governed operating system with visibility, ownership and safe phased execution.
```

## Reviewed Opportunities - 2026-06-29

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Desenvolvedor Full Stack para Plataforma Web
  url: https://www.99freelas.com.br/project/desenvolvedor-full-stack-para-plataforma-web-764217
  score_fit: 4.5
  score_readiness: 4
  submitted: pending
  lowest_defensible_entry_price: R$1.800-R$3.500 for architecture plus first functional product slice, depending on accepted scope and data/API readiness
  entry_scope: Define the first controlled web-platform flow, design the secure full-stack architecture, implement the core responsive interface, backend/API, auth/roles if needed, AI integration boundary, logs and a handoff plan for longer 12-month evolution.
  phase_2_scope: Expand operational workflows, richer financial decision-support logic, dashboards, role-based access, data-source integrations, evaluation tests, observability, admin tooling and production hardening.
  buyer_pain: Buyer wants an AI-enabled internal decision-support web platform in a banking/financial context, with enough usability, business logic and security discipline to validate with a restricted user group and later expand.
  requested_scope: Full-stack web platform with AI interaction, responsive and secure UX, operational decision support, business-flow validation and future expansion potential.
  fastest_safe_first_phase: In 7-10 days, deliver a concrete first functional flow using approved sample/redacted data, with architecture notes, AI boundaries, acceptance criteria and a phase-2 backlog.
  tools_and_apis: React/Next.js or similar frontend, Node.js/NestJS or Python/FastAPI backend, Postgres/Supabase or managed relational database, approved LLM provider/API, auth/RBAC, logging, deployment target chosen after intake.
  data_sources: Client-approved business rules, financial decision scenarios, non-sensitive sample data, user roles, workflow examples and AI output expectations after contract.
  auth_or_secret_boundary: No banking data, production credentials, API keys, private documents or user exports in 99Freelas chat, repo, email or screenshots; require redacted samples and client-controlled secure access after contract.
  compliance_or_tos_risk: Financial decision-support outputs must avoid autonomous credit/investment decisions unless legally reviewed; LGPD, auditability, explainability, access control and human review boundaries matter from day one.
  reusable_assets:
    proposal_snippet: Todo - 99Freelas full-stack AI banking platform proposal snippet
    discovery_checklist: Todo - AI financial decision-support platform intake checklist
    architecture_skeleton: Todo - secure full-stack AI platform architecture with auth, logs and review boundaries
    implementation_checklist: Todo - first functional flow implementation plan
    test_plan: Todo - usability, AI-output, access-control and data-boundary QA checklist
    runbook: Todo - product handoff and 12-month evolution roadmap
  risks:
    platform_tos: Keep negotiation and proposal inside 99Freelas; do not request off-platform contact.
    lgpd_or_pii: Treat any banking, user, financial or operational sample as sensitive; use redacted examples before secure access.
    credentials: Client secrets must stay in client-controlled paths after contract.
    scope_sprawl: The client mentions a long project, but the bid should anchor the first paid phase to a specific functional flow and architecture base.
  readiness_gap: Create a reusable financial AI web-platform discovery checklist and architecture skeleton so future bids can include sharper proof and pricing bands.
  prep_action: Draft a human proposal that sells senior full-stack/product execution, banking-context discipline and AI integration boundaries without using MVP language.
  proposal_angle: Position Paulo as a senior technical partner for the first functional platform build: practical full-stack execution, secure architecture, AI integration and product evolution discipline.
```

```yaml
opportunity_learning:
  platform: Upwork
  title: ACC120 | Poliwag - Portuguese (Brazil) Audio Transcription Specialist - High Volume
  url: https://www.upwork.com/jobs/~022069839779332450281
  score_fit: 2.5
  score_readiness: 5
  submitted: submitted on 2026-06-29 via invited proposal
  proposal_url: https://www.upwork.com/nx/proposals/2071689562462182189
  evidence_screenshot: reports/freelance/screenshots/2026-06-29-upwork-poliwag-proposal-sent.png
  bid: US$111 fixed price; estimated net after Upwork fee US$99.90
  connects: 0; invited proposal
  entry_scope: Deliver accurate Brazilian Portuguese verbatim transcription for the assigned ACC120/Poliwag audio batch, following client formatting and quality guidelines.
  phase_2_scope: Repeat high-volume batches if the client accepts quality, with a reusable QA checklist and clear turnaround agreement per batch.
  buyer_pain: Enterprise client needs native-level Portuguese (Brazil) transcription capacity for high-volume audio/data annotation work.
  requested_scope: Listen to recorded audio and produce highly accurate verbatim Portuguese transcription with attention to unclear segments and formatting consistency.
  fastest_safe_first_phase: Start with the first client-provided batch, confirm the expected style/guidelines, deliver quickly, then scale volume after feedback.
  tools_and_apis: Upwork, client audio player/files, transcription editor, manual QA checklist; STT/AI tools only if client explicitly permits external processing.
  data_sources: Client-provided audio files, transcription guidelines and examples after contract acceptance.
  auth_or_secret_boundary: Keep all work, files and communication inside Upwork/client-approved channels; no credentials, cookies, private audio, raw transcripts or client files in repo, chat, email or screenshots.
  compliance_or_tos_risk: Audio may contain personal or confidential data; do not upload to third-party AI/STT services without explicit client approval. Keep negotiation and delivery inside Upwork.
  reusable_assets:
    proposal_snippet: Submitted concise Upwork invite response focused on native Brazilian Portuguese, verbatim transcription and QA.
    discovery_checklist: Todo - Portuguese transcription guideline intake checklist
    implementation_checklist: Todo - audio transcription execution checklist
    test_plan: Todo - transcript QA pass for accents, punctuation, speaker consistency, inaudible markers and guideline compliance
    runbook: Todo - high-volume transcription batch handoff/runbook
  risks:
    platform_tos: Keep all communication and delivery inside Upwork.
    lgpd_or_pii: Treat audio/transcripts as confidential and do not store raw content in career-ops.
    credentials: No client credentials expected; if any platform access is required, use client-approved secure access only.
    scope_sprawl: Fixed-price US$111 must stay bounded to the assigned batch and client guidelines.
  readiness_gap: No delivery blocker; create a lightweight transcription QA checklist before the first batch arrives.
  prep_action: Prepare a no-secret Portuguese transcription QA checklist and batch tracker if the client responds.
  proposal_angle: Native Brazilian Portuguese, fluent English, fast start, verbatim accuracy, clear handling of unclear audio and final QA pass before delivery.
```

## Reviewed Opportunities - 2026-06-30

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Automacao com Playwright para audio de videos no Adobe
  url: https://www.99freelas.com.br/project/automacao-com-playwright-para-audio-de-videos-no-adobe-764490
  score_fit: 4.0
  score_readiness: 3
  submitted: pending_human_approval
  live_state: Public scan on 2026-06-30 14:20 BRT showed project published 7 minutes earlier, exclusive for roughly 23h53m, 4 proposals and 5 interested freelancers.
  lowest_defensible_entry_price: R$650-R$950 for diagnostic plus one local dummy-media automation slice; avoid quoting a full Adobe production bot until platform permission and flow details are confirmed.
  entry_scope: Map the current video/audio/avatar workflow, confirm Adobe automation permission and account-safe constraints, build one Playwright-controlled proof against dummy media or a client-approved non-sensitive sample, and deliver logs, failure handling and a manual checkpoint.
  phase_2_scope: Batch processing, queue management, richer media validation, retry/resume, structured error reporting, operator dashboard and supported API/provider alternatives if Adobe UI automation is unsafe.
  buyer_pain: Buyer has a repetitive manual video/avatar production loop and wants to reduce upload/download and audio replacement work.
  requested_scope: Automate audio extraction, narrated-audio upload into an Adobe AI avatar program, generated avatar video retrieval/upload and reinsertion into the original video process.
  fastest_safe_first_phase: In 2-3 days, deliver a controlled local proof for one dummy video/audio path after confirming the exact Adobe surface, file formats, browser steps and allowed automation boundary.
  tools_and_apis: Playwright, Python or Node.js, local file queue, FFmpeg or approved media utility, browser automation logs, screenshot/video evidence with dummy media only.
  data_sources: Client-approved dummy media, step-by-step workflow, browser selectors, file naming rules and expected output checks after contract.
  auth_or_secret_boundary: No Adobe credentials, cookies, tokens, paid account state, client media, private videos or raw files in chat, repo, email or screenshots; client enters credentials locally or through an approved secure path after contract.
  compliance_or_tos_risk: Adobe and marketplace ToS may restrict UI automation; do not bypass CAPTCHA, login, rate limits, anti-bot controls or account protections. If UI automation is prohibited, propose a supported API/manual-handoff alternative.
  reusable_assets:
    discovery_checklist: templates/freelance/checklist-ai-video-avatar-playwright-adobe.md
    architecture_skeleton: Todo - local media queue plus browser-automation adapter with manual checkpoint
    implementation_checklist: Todo - dummy-media Playwright proof plan
    test_plan: Todo - file integrity, timing, retry, failed upload and manual recovery cases
    runbook: Todo - operator handoff for safe batch execution
  readiness_gap: Build a no-secret dummy-media demo and provider permission matrix before selling a full production bot.
  prep_action: Offer a diagnostic/proof slice only, with explicit ToS and credential boundaries.
  proposal_angle: Fast, practical automation for one repeatable video path, but framed around account-safe Playwright use, logging and manual fallback rather than blind botting.
```

```yaml
opportunity_learning:
  platform: 99Freelas
  title: Integrar API da OMIE ao aplicativo Base44
  url: https://www.99freelas.com.br/project/integrar-api-da-omie-ao-aplicativo-base44-764418
  score_fit: 4.5
  score_readiness: 4
  submitted: pending
  deadline: 2026-07-03
  lowest_defensible_entry_price: R$1.200-R$1.800 for phase 1 with API mapping plus one or two working two-way sync flows in the copy app; quote higher if client expects many Omie modules/entities.
  entry_scope: Implement the safest first slice in the client's Base44 copy app: map selected Base44 entities to Omie endpoints, store credentials in Base44 Secrets or client-controlled secure path, create backend/API functions, test app-to-Omie and Omie-to-app sync for the agreed entities, and deliver a migration checklist for the original app.
  phase_2_scope: Expand to more Omie modules, add richer conflict handling, retries, logs, idempotency, scheduled sync/webhooks, admin monitoring and final migration to the production/original Base44 app.
  buyer_pain: Buyer has a Base44 app and needs data filled automatically in Omie and back in the app, but wants to validate safely in a copy app first because the deadline is Friday 2026-07-03.
  requested_scope: Two-way integration between Base44 and Omie API where the Base44 app sends data to Omie and Omie sends data back to Base44.
  fastest_safe_first_phase: Same-day technical intake plus first working end-to-end entity sync within 24-48h if the client provides Base44 Builder access, Omie API credentials, copy app access and exact fields/entities.
  tools_and_apis: Base44 backend functions, Base44 Secrets, Base44 custom integrations if available, Omie JSON/SOAP APIs, Omie webhooks where supported, TypeScript functions, endpoint tests, logs and field mapping.
  data_sources: Client-approved Base44 copy app schema, selected Omie modules such as clientes/fornecedores, pedidos, financeiro, produtos or NFS-e, sample records, non-secret API documentation notes and test records.
  auth_or_secret_boundary: Never receive or store Omie app_key/app_secret, Base44 API keys, cookies or production credentials in chat, repo, email or screenshots; credentials must be entered by the client in Base44 Secrets or another secure client-controlled path.
  compliance_or_tos_risk: Client data may include customers, suppliers, invoices, financial records and tax documents; require least-privilege access, copy-app testing first, redacted samples, clear production migration approval and platform communication inside 99Freelas.
  procedure:
    - intake: Confirm Base44 plan supports backend functions/custom integrations, copy app access, Omie modules, entities, fields, sync direction and Friday acceptance criteria.
    - setup: Define field map, unique keys, conflict rules, credential storage, sandbox/test records and endpoint list.
    - build: Implement Base44 backend functions/custom integration calls to Omie for the selected send and receive flows.
    - test: Validate happy path, missing fields, duplicated record, failed Omie call, Base44 UI update and copy-app logs.
    - handoff: Deliver migration checklist, field map, credentials boundary, test evidence, residual risks and phase-2 backlog before touching the original app.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-30-99freelas-omie-base44-764418.md
    discovery_checklist: Todo - Base44 + Omie API intake checklist
    architecture_skeleton: Todo - Base44 backend functions to Omie API adapter with secret boundary and field map
    implementation_checklist: Todo - Omie entity sync implementation checklist
    test_plan: Todo - copy-app sync QA for app-to-Omie, Omie-to-app, duplicates, failures and migration readiness
    runbook: Todo - production migration/handoff runbook for Base44 original app
  risks:
    platform_tos: Keep proposal and negotiation inside 99Freelas; do not request off-platform contact.
    lgpd_or_pii: Customer, supplier, financial and fiscal data should use redacted test records until secure access is agreed.
    credentials: Omie and Base44 secrets must stay in client-controlled secret storage, not in chat or repo.
    scope_sprawl: The phrase "and vice versa" can expand into full ERP synchronization; first paid phase must name exact entities and fields.
    deadline: Friday 2026-07-03 is feasible only for a bounded MVP in the copy app, not an undefined multi-module production sync.
  readiness_gap: Create a reusable Base44 + Omie API field-map/checklist and a small adapter skeleton after proposal, especially for clientes/fornecedores and financeiro.
  prep_action: Use the proposal snippet and ask for exact Base44 entities, Omie modules, field list, Builder-plan confirmation and copy-app access before committing to final scope.
  proposal_angle: Win by sounding reliable and bounded: start in the copy app, deliver one tested two-way sync slice fast, keep credentials secure, document field mapping and migrate to the original app only after evidence.
```

```yaml
opportunity_learning:
  platform: Workana
  title: Automatizacao de Mensagens no Instagram com Inteligencia Artificial
  url: https://www.workana.com/job/automatizacao-de-mensagens-no-instagram-com-inteligencia-artificial
  score_fit: 4.5
  score_readiness: 4
  submitted: login_gated_on_2026-06-30
  live_state: Analisando propostas; 12 propostas; 17 freelancers interessados; public page redirects to login/cadastro before proposal form
  lowest_defensible_entry_price: R$4.900 for a controlled Instagram AI messaging phase 1, reduced from prior R$7.800/12d draft
  entry_scope: Map message scenarios, validate official Meta/API path, implement first controlled IA flow with business rules, safety limits, logs, fallback and human handoff.
  phase_2_scope: Additional campaigns, richer personalization, CRM/analytics integration, optimization metrics and ongoing support after the first working proof.
  buyer_pain: Buyer wants scalable personalized Instagram DM automation for followers and prospects, but must avoid policy-unsafe botting and low-quality generic chatbot behavior.
  requested_scope: Instagram direct-message automation using AI, API integration, scenario-based flows, personalization, scalability and compliance with Instagram policies.
  fastest_safe_first_phase: In 7 days, deliver one compliant MVP flow after validating Meta/API permissions and agreed conversation scenarios.
  tools_and_apis: Instagram/Meta Business API where allowed, LLM API, approved CRM/spreadsheet if needed, logs, prompt/rule layer, fallback queue and engagement metrics.
  data_sources: Approved campaign scenarios, FAQ, tone examples, Meta Business/API permission status and non-sensitive sample messages after contract.
  auth_or_secret_boundary: No Instagram credentials, Meta tokens, cookies, private messages or customer data in chat, repo, email or screenshots; use client-controlled secure access after contract.
  compliance_or_tos_risk: Instagram/Meta platform policy, anti-spam rules, opt-in/consent, LGPD and account-risk boundaries; do not promise unsupported automation.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-30-workana-paid-apply-pack.md
    discovery_checklist: Todo - Meta/Instagram AI DM automation intake checklist
    implementation_checklist: Todo - safe Instagram AI flow setup and handoff checklist
    test_plan: Todo - DM response quality, policy, fallback and engagement QA cases
  prep_action: Submit the lower-priced Workana proposal only after login/profile gate clears; if paid moderation appears, require explicit purchase authorization.
  proposal_angle: Human, policy-safe Instagram automation: win with a smaller first proof, not a full indefinite build.
```

```yaml
opportunity_learning:
  platform: Workana
  title: Assistente de Automacao e Inteligencia Artificial para Otimizacao de Operacoes Digitais
  url: https://www.workana.com/job/especialista-em-automacao-e-inteligencia-artificial-para-otimizacao-de-operacoes-digitais?ref=projects_1
  score_fit: 3.7
  score_readiness: 4
  submitted: login_gated_on_2026-06-30
  live_state: Analisando propostas; 10 propostas; 16 freelancers interessados; client Leticia M. has several active assistant/operations projects
  lowest_defensible_entry_price: R$2.900 for diagnostic plus one first automation in 5 days
  entry_scope: Map 3-5 repetitive digital operations, choose one priority flow, implement the first automation using the existing stack, and deliver logs, documentation and handoff.
  phase_2_scope: Expand automations across CRM, WhatsApp, spreadsheets, ERP, no-code tools, dashboards and recurring optimization.
  buyer_pain: Buyer likely has scattered operational tasks and wants AI/API/no-code automation to reduce manual work and increase team efficiency.
  requested_scope: Identify repetitive tasks and create automations with AI, integrations, APIs, spreadsheets or no-code platforms across business operations.
  fastest_safe_first_phase: In 5 days, deliver a live first automation or high-confidence blueprint plus one implemented priority flow.
  tools_and_apis: Existing CRM, WhatsApp or support platform, spreadsheets, no-code automation, API scripts, LLM API, logs and lightweight dashboard/status tracking.
  data_sources: Client-approved process examples, current tool list, task samples, owner matrix and non-sensitive records after contract.
  auth_or_secret_boundary: No production credentials, API keys, customer exports or internal files in Workana chat/repo/email; use secure client-controlled access after contract.
  compliance_or_tos_risk: Broad operations scope can include PII, customer communication and account credentials; keep phase 1 bounded and data-minimal.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-30-workana-paid-apply-pack.md
    discovery_checklist: templates/freelance/checklist-production-n8n-operations.md
  prep_action: Convert this pattern into a reusable "ops diagnostic plus first automation" Workana proposal snippet after account gate clears.
  proposal_angle: Start with process pain and first visible automation, not a tool-first AI pitch.
```

```yaml
opportunity_learning:
  platform: Workana
  title: Automacao de Respostas no Whatsapp com Inteligencia Artificial
  url: https://www.workana.com/job/automacao-de-respostas-no-whatsapp-com-inteligencia-artificial-7
  score_fit: 3.7
  score_readiness: 4
  submitted: login_gated_on_2026-06-30
  live_state: Analisando propostas; 16 propostas; 21 freelancers interessados
  lowest_defensible_entry_price: R$3.200 for a first WhatsApp AI response flow in 7 days
  entry_scope: Gather FAQ and conversation scenarios, organize the knowledge base, connect the approved WhatsApp/API/CRM path, configure fallback and human handoff, and test real scenarios.
  phase_2_scope: Additional product/service flows, CRM updates, lead scoring, analytics, template messages, multi-agent routing and ongoing optimization.
  buyer_pain: Buyer wants faster WhatsApp response time, lead qualification and humanized FAQ handling without losing customer experience.
  requested_scope: AI-powered WhatsApp attendance automation with API integration, precise responses and qualified-lead routing.
  fastest_safe_first_phase: In 7 days, deliver one controlled support/lead-qualification path with fallback, logs and documentation.
  tools_and_apis: WhatsApp Business Cloud API or approved provider such as Evolution API/Z-API/Chatwoot/Kommo/HubSpot/RD, LLM API, knowledge base, logs and human queue.
  data_sources: Approved FAQ, product/service list, lead qualification rules, tone examples and non-sensitive sample conversations after contract.
  auth_or_secret_boundary: No WhatsApp credentials, tokens, private messages, contact exports or API keys in chat/repo/email/screenshots; use secure access after contract.
  compliance_or_tos_risk: LGPD, WhatsApp opt-in/templates/rate limits, health/finance claims if applicable, and unsafe bulk outbound messaging.
  reusable_assets:
    proposal_snippet: output/freelance-proposals/2026-06-30-workana-paid-apply-pack.md
    implementation_checklist: templates/freelance/checklist-n8n-evolution-whatsapp-agent.md
    discovery_checklist: templates/freelance/checklist-kommo-n8n-whatsapp-qualification.md
  prep_action: Keep proposal focused on controlled inbound/qualification flow; reject spam or non-consented outbound variants.
  proposal_angle: Humanized WhatsApp IA with knowledge base, opt-in discipline, fallback and handoff, priced as a first working slice.
```
