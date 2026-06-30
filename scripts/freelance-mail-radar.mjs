#!/usr/bin/env node
/**
 * freelance-mail-radar.mjs
 *
 * Reads local Mail.app notifications or exported message JSON for Workana and
 * 99Freelas, extracts project leads, scores them with freelance-radar config,
 * and writes draft-only reports/proposals for Paulo to review manually.
 *
 * It never submits proposals, spends credits, replies to clients, scrapes logged
 * marketplace pages, or reads secrets. Platform action remains a human gate.
 */

import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load as yamlLoad } from 'js-yaml';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CONFIG_PATH = path.join(ROOT, 'config/freelance-radar.yml');
const STATE_PATH = path.join(ROOT, 'data/freelance-mail-radar-state.json');
const REPORTS_DIR = path.join(ROOT, 'reports/freelance');
const PROPOSALS_DIR = path.join(ROOT, 'output/freelance-proposals');

const SOURCE_DEFS = {
  '99freelas': {
    id: '99freelas',
    platform: '99Freelas',
    sender_contains: ['99freelas.com.br'],
    project_url: /https:\/\/www\.99freelas\.com\.br\/project\/[^\s"'<>]+/g,
    fallback_url: 'https://www.99freelas.com.br/projects',
    title_prefixes: [/^Novo Projeto:\s*/i, /^Novo projeto\s*/i],
    subject_hint: /(novo\s+projeto|projeto\s+interessante|project)/i,
    exclude_subject: null,
    sourceId(text) {
      return /automac|automaç|rpa|processo/i.test(text) ? '99freelas_rpa' : '99freelas_ai';
    },
  },
  workana: {
    id: 'workana',
    platform: 'Workana',
    sender_contains: ['workana'],
    project_url: /https:\/\/www\.workana\.com\/(?:pt\/)?(?:job|jobs|projects?)\/[^\s"'<>]+/g,
    fallback_url: 'https://www.workana.com/pt/jobs',
    title_prefixes: [
      /^Novo projeto:\s*/i,
      /^Novo projeto\s*/i,
      /^Nuevo proyecto:\s*/i,
      /^New project:\s*/i,
      /^Projeto recomendado:\s*/i,
    ],
    subject_hint: /(novo\s+projeto|nuevo\s+proyecto|new\s+project|projeto|project|oportunidade|opportunity)/i,
    exclude_subject: /(freelancer.*interessad[oa].*seu projeto|interessad[oa].*seu projeto|proposta.*seu projeto|mensagem.*seu projeto|seu projeto recebeu|contrat)/i,
    sourceId(text) {
      return /programa|desenvolv|api|python|node|dashboard|software|sistema/i.test(text) ? 'workana_ai_it' : 'workana_ai';
    },
  },
};

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const getArg = (flag, fallback = null) => {
  const eq = args.find((arg) => arg.startsWith(`${flag}=`));
  if (eq) return eq.slice(flag.length + 1);
  const idx = args.indexOf(flag);
  if (idx === -1 || args[idx + 1] === undefined) return fallback;
  return args[idx + 1];
};

const now = () => new Date();
const today = () => now().toISOString().slice(0, 10);
const timestamp = () => now().toISOString().replace(/[:.]/g, '-').slice(0, 19);

function usage() {
  return `
career-ops freelance mail radar

USAGE
  npm run mail:freelance -- [options]
  node scripts/freelance-mail-radar.mjs --source all --since-hours 12

OPTIONS
  --source <all|workana|99freelas>  Source to read. Default: all.
  --since-hours <n>                 Mail.app lookback window. Default: 24.
  --input-file <path|->             Read exported message JSON/text instead of Mail.app. Use - for stdin.
  --include-processed               Draft leads already seen in prior runs.
  --write-empty                     Write a report even when no new actionable lead exists.
  --dry-run                         Do not write reports, drafts, or state.
  --ai-drafts                       Use OpenAI-compatible API for proposal text.
  --url <base>                      OpenAI-compatible base URL. Default: OPENAI_BASE_URL or OpenAI.
  --model <id>                      Model id. Default: OPENAI_MODEL or gpt-4o-mini.
  --json                            Print JSON summary.
  --self-test                       Run built-in parser/scoring tests.
`;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function readYaml(file) {
  if (!existsSync(file)) throw new Error(`Missing config file: ${file}`);
  return yamlLoad(readFileSync(file, 'utf8'));
}

function readState() {
  if (!existsSync(STATE_PATH)) return { processed: {} };
  try {
    const parsed = JSON.parse(readFileSync(STATE_PATH, 'utf8'));
    if (parsed && typeof parsed === 'object' && parsed.processed) return parsed;
  } catch {}
  return { processed: {} };
}

function writeState(state) {
  mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).toLowerCase().trim()).filter(Boolean);
  return [String(value).toLowerCase().trim()].filter(Boolean);
}

function clampScore(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(5, value));
}

function decodeQuotedPrintable(value) {
  const softless = String(value || '').replace(/=\r?\n/g, '');
  const binary = softless.replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => (
    String.fromCharCode(parseInt(hex, 16))
  ));
  return Buffer.from(binary, 'binary').toString('utf8');
}

function decodeHtmlEntities(value) {
  return String(value || '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function redactSensitiveText(value) {
  return String(value || '')
    .replace(/https:\/\/workana\.s3\.amazonaws\.com\/[^\s"'<>]+/gi, '[workana-attachment-url-redacted]')
    .replace(/X-Amz-[A-Za-z0-9-]+=[^\s&"'<>]+/g, 'X-Amz-[redacted]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email-redacted]')
    .replace(/(?:\+?55\s*)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/g, '[phone-redacted]');
}

function compactText(value) {
  return redactSensitiveText(value)
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function scoringText(lead) {
  const base = `${lead.title || ''} ${lead.description || ''} ${(lead.tags || []).join(' ')}`.toLowerCase();
  const aliases = [];
  if (/\bia\b|inteligencia artificial|inteligência artificial|openai|claude/.test(base)) {
    aliases.push('ai automation openai chatbot ai agent');
  }
  if (/agente|assistente virtual|chatbot|bot/.test(base)) {
    aliases.push('ai agent chatbot workflow');
  }
  if (/integrac|integraç|requisic|requisiç|http|api|webhook/.test(base)) {
    aliases.push('api integration webhook workflow');
  }
  if (/automac|automaç|rpa|processo/.test(base)) {
    aliases.push('automation workflow rpa');
  }
  if (/site|landing|pagina|página/.test(base)) {
    aliases.push('website landing page conversao lead generation');
  }
  if (/whatsapp|crm|funil|lead/.test(base)) {
    aliases.push('whatsapp crm lead generation follow-up');
  }
  return `${base} ${aliases.join(' ')}`.trim();
}

function cleanUrl(url) {
  return decodeHtmlEntities(url)
    .replace(/[).,;]+$/g, '')
    .replace(/&amp;/g, '&');
}

function extractProjectUrls(decodedSource, sourceDef) {
  const urls = [];
  const text = decodeHtmlEntities(decodedSource);
  for (const match of text.matchAll(sourceDef.project_url)) {
    const clean = cleanUrl(match[0]);
    if (!urls.includes(clean)) urls.push(clean);
  }
  return urls;
}

function extractBudget(content) {
  const patterns = [
    /Or(?:c|ç)amento:\s*([^\n]+)/i,
    /Presupuesto:\s*([^\n]+)/i,
    /Budget:\s*([^\n]+)/i,
    /Valor:\s*([^\n]+)/i,
    /Pago:\s*([^\n]+)/i,
    /BRL\s*[\d.,]+(?:\s*-\s*BRL\s*[\d.,]+)?/i,
    /R\$\s*[\d.,]+(?:\s*-\s*R\$\s*[\d.,]+)?/i,
  ];
  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) return (match[1] || match[0]).trim();
  }
  return 'Orcamento nao informado';
}

function extractMeta(content) {
  const pipeMatch = content.match(/\n([^\n|]+)\s+\|\s+([^|\n]+)\s+\|\s+(?:Or(?:c|ç)amento|Presupuesto|Budget):\s*([^\n]+)/i);
  return {
    category: pipeMatch?.[1]?.trim() || '',
    level: pipeMatch?.[2]?.trim() || '',
    budget: pipeMatch?.[3]?.trim() || extractBudget(content),
  };
}

function stripBoilerplate(content) {
  return compactText(content)
    .replace(/\s+Leia mais\..*$/is, '')
    .replace(/\s+Ver projeto.*$/is, '')
    .replace(/\s+Ver propuesta.*$/is, '')
    .replace(/\s+Read more.*$/is, '')
    .replace(/\* Este e um email automatico\..*$/is, '')
    .replace(/\* Este é um email automático\..*$/is, '')
    .replace(/Este email foi enviado.*$/is, '')
    .replace(/Você está recebendo.*$/is, '')
    .replace(/You are receiving.*$/is, '');
}

function extractDescription(content, subject) {
  const withoutHeader = content.split(/(?:Or(?:c|ç)amento|Presupuesto|Budget):\s*[^\n]+\n/i)[1] || content;
  const description = stripBoilerplate(withoutHeader);
  if (description && description.toLowerCase() !== String(subject || '').toLowerCase()) {
    return description.slice(0, 1600);
  }
  return stripBoilerplate(content).slice(0, 1600);
}

function titleFromSubject(subject, sourceDef) {
  let title = String(subject || '').trim();
  for (const prefix of sourceDef.title_prefixes) title = title.replace(prefix, '').trim();
  return title;
}

function titleFromContent(content, fallback) {
  const lines = compactText(content)
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length >= 8 && line.length <= 140)
    .filter((line) => !/^visualizar no navegador|^cancelar inscri|^configurações de notificações|^politica de privacidade|^política de privacidade|^termos$|^99freelas|^workana|^enviar proposta|^obs:|^ol[aá]|^boa tarde|^ha um novo|^há um novo|^projeto|^or(?:c|ç)amento|^budget|^categoria/i.test(line));
  return lines[0] || fallback;
}

function extractTags(text, config) {
  const lower = text.toLowerCase();
  const positives = normalizeList(config.keywords?.positive);
  return positives.filter((keyword) => lower.includes(keyword)).slice(0, 12);
}

function moneyScore(lead, source) {
  const budget = String(lead.budget || '').toLowerCase();
  if (/r\$\s*(?:[2-9]\d{2,}|[1-9]\.\d{3,})|brl\s*(?:[2-9]\d{2,}|[1-9]\.\d{3,})|10\.000|aberto|open/.test(budget)) return 3.8;
  if (/r\$|brl|fixed|setup|platform proposal|proposta|por projeto/.test(budget)) return 3.2;
  if (/50|100|baixo|muy bajo/.test(budget)) return 1.5;
  return Number(source?.default_revenue_score || 3);
}

function speedScore(lead) {
  const text = scoringText(lead);
  if (/n8n|make|zapier|crm|dashboard|landing|whatsapp|api|webhook|automacao|automação/.test(text)) return 4.5;
  if (/python|playwright|chatbot|openai|agent|agente|ia/.test(text)) return 3.8;
  if (/marketplace|saas|fintech|credito|regulated|lgpd/.test(text)) return 2.6;
  return 3;
}

function automationScore(lead, positiveKeywords) {
  const text = scoringText(lead);
  return clampScore(1 + positiveKeywords.filter((keyword) => text.includes(keyword)).length * 0.55);
}

function riskScore(lead, negativeKeywords) {
  const text = scoringText(lead);
  let risk = 1;
  risk += negativeKeywords.filter((keyword) => text.includes(keyword)).length * 3.5;
  if (/scraping|captcha|mass dm|disparo em massa|fake|burlar|fora da plataforma/.test(text)) risk += 3;
  if (/saude|saúde|clinica|clínica|finance|credito|crédito|juridic|advocacia|lgpd|whatsapp/.test(text)) risk += 0.8;
  if (/bradesco|servicenow customer/.test(text)) risk += 4;
  return clampScore(risk);
}

function scoreOfferFit(lead, offer) {
  const text = scoringText(lead);
  const matches = normalizeList(offer.keywords).filter((keyword) => text.includes(keyword)).length;
  return clampScore(1 + matches * 0.9);
}

function chooseOffer(lead, offers) {
  return (offers || [])
    .map((offer) => ({ offer, fit: scoreOfferFit(lead, offer) }))
    .sort((a, b) => b.fit - a.fit)[0];
}

function classifyRecommendation(total, risk) {
  if (risk >= 4.5) return 'skip_or_manual_review';
  if (total >= 3.6) return 'hot_draft_for_paulo';
  if (total >= 2.6) return 'draft_for_manual_review';
  return 'monitor';
}

function scoreLead(lead, config) {
  const source = (config.sources || []).find((item) => item.id === lead.source_id);
  const weights = config.scoring || {};
  const selected = chooseOffer(lead, config.offers || []);
  const positiveKeywords = normalizeList(config.keywords?.positive);
  const negativeKeywords = normalizeList(config.keywords?.negative);
  const offerFit = selected?.fit || 0;
  const revenue = moneyScore(lead, source);
  const speed = speedScore(lead);
  const automation = automationScore(lead, positiveKeywords);
  const risk = riskScore(lead, negativeKeywords);
  const total = (
    offerFit * Number(weights.offer_fit || 0.3) +
    revenue * Number(weights.revenue || 0.25) +
    speed * Number(weights.speed || 0.15) +
    automation * Number(weights.automation_leverage || 0.2) -
    risk * Number(weights.risk || 0.1)
  );

  return {
    ...lead,
    source_label: source?.label || lead.platform,
    recommended_offer: selected?.offer || null,
    scores: {
      total: Number(clampScore(total).toFixed(2)),
      offer_fit: Number(offerFit.toFixed(2)),
      revenue: Number(revenue.toFixed(2)),
      speed: Number(speed.toFixed(2)),
      automation_leverage: Number(automation.toFixed(2)),
      risk: Number(risk.toFixed(2)),
    },
    recommendation: classifyRecommendation(total, risk),
  };
}

function chooseEntryPrice(lead) {
  const text = `${lead.title} ${lead.description}`.toLowerCase();
  if (/landing|pagina|página|site/.test(text)) return 'R$350-R$550 liquido';
  if (/dashboard|power bi|bi|planilha/.test(text)) return 'R$550-R$850 liquido';
  if (/whatsapp|n8n|make|zapier|crm|api|webhook/.test(text)) return 'R$650-R$950 liquido';
  if (/agente|chatbot|rag|base de conhecimento|openai|ia/.test(text)) return 'R$750-R$1.100 liquido';
  if (/saas|marketplace|plataforma/.test(text)) return 'R$1.200-R$2.500 liquido';
  return 'R$450-R$750 liquido';
}

function chooseFirstSlice(lead) {
  const text = `${lead.title} ${lead.description}`.toLowerCase();
  if (/landing|pagina|página|site/.test(text)) {
    return 'uma landing responsiva curta, com promessa clara, CTA e acabamento mobile';
  }
  if (/whatsapp/.test(text)) {
    return 'um MVP controlado de WhatsApp com FAQ aprovada, qualificacao, logs e fallback humano';
  }
  if (/crm|kommo|pipedrive|odoo|zoho|hubspot/.test(text)) {
    return 'o primeiro fluxo comercial no CRM, com campos, etapas, automacao critica, teste e handoff';
  }
  if (/dashboard|power bi|bi|planilha/.test(text)) {
    return 'um primeiro painel funcional com modelo de dados, KPIs principais e base de exemplo validada';
  }
  if (/agente|chatbot|rag|base de conhecimento|openai|ia/.test(text)) {
    return 'uma primeira rota de IA testavel, com fonte controlada, limites de resposta e handoff humano';
  }
  if (/api|webhook|integracao|integração|http/.test(text)) {
    return 'a primeira integracao ponta a ponta com payloads mapeados, teste controlado e documentacao';
  }
  return 'uma microfase fechada com diagnostico, primeiro fluxo funcional, teste e handoff';
}

function renderDeterministicProposal(lead) {
  const text = `${lead.title} ${lead.description}`.toLowerCase();
  const isLanding = /landing|pagina|página|site/.test(text);
  const firstSlice = chooseFirstSlice(lead);
  const price = chooseEntryPrice(lead);
  const phase2 = isLanding
    ? 'variacoes de copy, tracking, teste A/B, criativos e automacoes de follow-up'
    : /saas|marketplace|plataforma/i.test(`${lead.title} ${lead.description}`)
    ? 'cadastro, pagamentos, perfis, automacoes avancadas e painel completo'
    : 'automacoes extras, monitoramento, ajustes finos e evolucao de escopo';
  const opening = isLanding
    ? 'Oi. Li o projeto: o ponto principal parece ser publicar uma pagina curta, profissional e orientada a conversao.'
    : `Oi. Li o projeto e o ponto principal parece ser colocar ${lead.title.toLowerCase()} para funcionar sem virar um escopo aberto.`;
  const deliverables = isLanding ? [
    '1. estrutura da oferta e copy principal;',
    '2. landing responsiva com visual profissional;',
    '3. CTA claro para conversao;',
    '4. ajuste fino de mobile e handoff para publicacao.',
  ] : [
    '1. mapa rapido do fluxo e dados necessarios;',
    '2. primeira versao funcional ou prototipo navegavel;',
    '3. teste com dados reais ou exemplos controlados;',
    '4. documentacao curta para voce conseguir operar/evoluir depois.',
  ];
  const question = isLanding
    ? 'Pergunta rapida: voce ja tem identidade visual/textos base ou eu devo montar a primeira versao da copy junto com a pagina?'
    : 'Pergunta rapida: voce ja tem a ferramenta/API definida ou quer que eu recomende o caminho mais simples para essa primeira versao?';
  return [
    opening,
    '',
    `Para ganhar velocidade, eu comecaria por ${firstSlice}.`,
    '',
    'A entrega de entrada fica fechada em:',
    ...deliverables,
    '',
    `Valor de entrada: ${price}.`,
    'Prazo sugerido: 2 a 5 dias, dependendo dos acessos e do escopo confirmado.',
    '',
    `Depois disso, deixamos ${phase2} como fase 2 separada, para voce validar antes de investir mais.`,
    '',
    question,
  ].join('\n');
}

function buildAiPrompt(lead) {
  return [
    'Voce e assistente de propostas para Workana e 99Freelas.',
    '',
    'Escreva uma proposta curta, consultiva e especifica em PT-BR.',
    '',
    'Regras:',
    '- Nao soar generico.',
    '- Nao inventar experiencia.',
    '- Nao pedir contato externo.',
    '- Nao falar em pagamento fora da plataforma.',
    '- Nao prometer prazo/preco sem dados.',
    '- Mostrar entendimento do problema.',
    '- Sugerir uma primeira etapa objetiva.',
    '- Fazer 1 pergunta inteligente no final.',
    '- Nao mencionar IA interna, prompts, agentes ou automacao usada para escrever a proposta.',
    '',
    'Posicionamento de Paulo:',
    'Especialista em automacao, IA aplicada, dashboards, produtividade, n8n, Python, Node.js, integracoes e documentacao clara.',
    '',
    'Projeto:',
    `Plataforma: ${lead.platform}`,
    `Titulo: ${lead.title}`,
    `Orcamento: ${lead.budget || 'nao informado'}`,
    `Descricao: ${lead.description || 'sem descricao extraida'}`,
    '',
    'Resposta:',
  ].join('\n');
}

function resolveAiEndpoint() {
  const modelName = getArg('--model', process.env.OPENAI_MODEL || 'gpt-4o-mini');
  const baseUrl = getArg('--url', process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
  const apiKey = process.env.OPENAI_API_KEY || '';
  let parsed;
  try {
    parsed = new URL(baseUrl);
  } catch {
    throw new Error(`Invalid OpenAI-compatible base URL: ${baseUrl}`);
  }
  const isLoopback = ['localhost', '127.0.0.1', '::1'].includes(parsed.hostname);
  if (!isLoopback && parsed.protocol !== 'https:') {
    throw new Error(`Refusing non-HTTPS remote AI endpoint: ${baseUrl}`);
  }
  if (!isLoopback && !apiKey) {
    throw new Error('Missing OPENAI_API_KEY for --ai-drafts. Run through brain-env-run or set a provider key securely.');
  }
  return { endpoint: `${baseUrl}/chat/completions`, apiKey, modelName };
}

async function renderAiProposal(lead) {
  const { endpoint, apiKey, modelName } = resolveAiEndpoint();
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      model: modelName,
      temperature: 0.35,
      messages: [
        { role: 'system', content: 'You write concise marketplace proposals in Brazilian Portuguese. Return only the proposal text.' },
        { role: 'user', content: buildAiPrompt(lead) },
      ],
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI draft request failed (${response.status}): ${body.slice(0, 240)}`);
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('AI draft response did not include proposal content');
  return content;
}

function messageSourceForSender(sender) {
  const lower = String(sender || '').toLowerCase();
  return Object.values(SOURCE_DEFS).find((sourceDef) => (
    sourceDef.sender_contains.some((needle) => lower.includes(needle.toLowerCase()))
  ));
}

function sourceDefsFromArg() {
  const source = String(getArg('--source', 'all')).toLowerCase();
  if (source === 'all') return Object.values(SOURCE_DEFS);
  if (!SOURCE_DEFS[source]) throw new Error(`Unknown --source "${source}". Use all, workana, or 99freelas.`);
  return [SOURCE_DEFS[source]];
}

function leadFromMessage(message, config) {
  const sourceDef = SOURCE_DEFS[message.source_id] || messageSourceForSender(message.sender);
  if (!sourceDef) return null;
  if (sourceDef.exclude_subject && sourceDef.exclude_subject.test(String(message.subject || ''))) return null;
  const decodedSource = decodeQuotedPrintable(message.source || '');
  const rawContent = compactText(message.content || decodedSource || '');
  if (!sourceDef.subject_hint.test(String(message.subject || '')) && !sourceDef.project_url.test(decodedSource) && !sourceDef.project_url.test(rawContent)) {
    return null;
  }
  sourceDef.project_url.lastIndex = 0;
  const urls = extractProjectUrls(`${decodedSource}\n${rawContent}`, sourceDef);
  const subjectTitle = titleFromSubject(message.subject, sourceDef);
  const title = subjectTitle || titleFromContent(rawContent, subjectTitle) || `${sourceDef.platform} lead`;
  const meta = extractMeta(rawContent);
  const description = extractDescription(rawContent, message.subject);
  const text = `${title} ${description} ${meta.category} ${meta.level}`;
  const projectId = urls[0]?.match(/(\d+)(?:[/?#]|$)/)?.[1] || slugify(urls[0] || `${message.id}-${title}`);
  return {
    id: `${sourceDef.id}-mail-${projectId}-${message.id}`,
    mail_message_id: `${sourceDef.id}:${String(message.id)}`,
    source_id: sourceDef.sourceId(text),
    platform: sourceDef.platform,
    title,
    buyer: `${sourceDef.platform} client`,
    url: urls[0] || sourceDef.fallback_url,
    posted: String(message.dateReceived || '').slice(0, 32),
    budget: meta.budget,
    category: meta.category,
    level: meta.level,
    description,
    tags: extractTags(text, config),
    risk_notes: 'Draft-only marketplace lead. Human approval required before proposal submission, credit spend, boost, or off-platform contact.',
  };
}

function loadMailMessages({ sinceHours, sourceDefs }) {
  const sourceSpec = JSON.stringify(sourceDefs.map((sourceDef) => ({
    id: sourceDef.id,
    sender_contains: sourceDef.sender_contains,
    subject_hint: sourceDef.subject_hint.source,
  })));
  const jxa = `
const Mail = Application('Mail');
const cutoff = Date.now() - (${Number(sinceHours)} * 60 * 60 * 1000);
const sources = ${sourceSpec};
const out = [];
for (const source of sources) {
  for (const senderNeedle of source.sender_contains) {
    const messages = Mail.inbox.messages.whose({sender: {_contains: senderNeedle}})();
    for (const m of messages) {
      const received = m.dateReceived();
      const receivedMs = received && typeof received.getTime === 'function' ? received.getTime() : 0;
      if (receivedMs && receivedMs < cutoff) continue;
      const subject = String(m.subject() || '');
      const hint = new RegExp(source.subject_hint, 'i');
      if (!hint.test(subject)) continue;
      out.push({
        id: String(m.id()),
        source_id: source.id,
        subject,
        sender: String(m.sender() || ''),
        dateReceived: String(received || ''),
        content: String(m.content() || ''),
        source: String(m.source() || '')
      });
    }
  }
}
JSON.stringify(out);
`;
  const stdout = execFileSync('osascript', ['-l', 'JavaScript'], {
    input: jxa,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024,
  });
  return JSON.parse(stdout || '[]');
}

function loadMessagesFromFile(file, sourceDefs) {
  if (file !== '-' && !existsSync(file)) throw new Error(`Input file not found: ${file}`);
  const raw = file === '-' ? readFileSync(0, 'utf8') : readFileSync(file, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    const messages = Array.isArray(parsed) ? parsed : parsed.messages;
    if (!Array.isArray(messages)) throw new Error('JSON must be an array or { "messages": [] }');
    return messages.map((message, index) => ({
      id: message.id || `file-${index + 1}`,
      source_id: message.source_id || message.source || sourceDefs[0]?.id,
      subject: message.subject || message.title || 'Marketplace lead',
      sender: message.sender || '',
      dateReceived: message.dateReceived || message.date || '',
      content: message.content || message.body || message.description || '',
      source: message.source_raw || message.raw || message.url || '',
    }));
  } catch {
    return [{
      id: 'file-1',
      source_id: sourceDefs[0]?.id,
      subject: 'Marketplace lead',
      sender: sourceDefs[0]?.platform || '',
      dateReceived: new Date().toString(),
      content: raw,
      source: raw,
    }];
  }
}

async function renderProposal(lead, options) {
  if (!options.aiDrafts) return renderDeterministicProposal(lead);
  try {
    return await renderAiProposal(lead);
  } catch (err) {
    return [
      renderDeterministicProposal(lead),
      '',
      `<!-- AI draft fallback: ${redactSensitiveText(err.message)} -->`,
    ].join('\n');
  }
}

async function renderReport(newLeads, allCandidates, options) {
  const rows = newLeads.map((lead) => (
    `| ${lead.recommendation} | ${lead.platform} | ${lead.scores.total}/5 | ${lead.scores.risk}/5 | ${lead.title} | ${lead.budget} | ${lead.url} |`
  )).join('\n') || '| n/a | n/a | n/a | n/a | No new lead | n/a | n/a |';

  const detailBlocks = [];
  for (let index = 0; index < newLeads.length; index++) {
    const lead = newLeads[index];
    detailBlocks.push([
      `## ${index + 1}. ${lead.title}`,
      '',
      `- Platform: ${lead.platform}`,
      `- URL: ${lead.url}`,
      `- Date: ${lead.posted || 'unknown'}`,
      `- Budget: ${lead.budget || 'unknown'}`,
      `- Category/level: ${[lead.category, lead.level].filter(Boolean).join(' / ') || 'unknown'}`,
      `- Tags: ${lead.tags.length ? lead.tags.join(', ') : 'none'}`,
      `- Offer: ${lead.recommended_offer?.name || 'n/a'}`,
      `- Score: ${lead.scores.total}/5 (fit ${lead.scores.offer_fit}, revenue ${lead.scores.revenue}, speed ${lead.scores.speed}, automation ${lead.scores.automation_leverage}, risk ${lead.scores.risk})`,
      `- Action: ${lead.recommendation}`,
      '',
      '### Extracted Brief',
      '',
      lead.description || '_No description extracted._',
      '',
      '### Draft Proposal',
      '',
      await renderProposal(lead, options),
    ].join('\n'));
  }

  return [
    `# Freelance Mail Radar - ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
    '',
    `Checked ${options.sourceLabel} messages from ${options.inputFile ? `input file \`${options.inputFile}\`` : `Mail.app in the last ${options.sinceHours} hour(s)`}.`,
    '',
    'No proposal was submitted, no credit/connection was spent, no client reply was sent, no browser page was scraped, and no secrets were read.',
    '',
    `Candidates read: ${allCandidates.length}`,
    `New candidates drafted: ${newLeads.length}`,
    `Draft mode: ${options.aiDrafts ? 'OpenAI-compatible AI draft with deterministic fallback' : 'deterministic local template'}`,
    '',
    '| Action | Platform | Score | Risk | Title | Budget | URL |',
    '|---|---|---:|---:|---|---|---|',
    rows,
    '',
    detailBlocks.join('\n\n'),
    '',
    '## Human Gate',
    '',
    '- Paulo must approve before opening a platform page to submit, spending Workana/99Freelas credits, boosting/promoting, sending follow-up, or moving off-platform.',
    '- Use platform-native communication only.',
    '- Treat high-risk WhatsApp, scraping, CAPTCHA, LGPD, healthcare, finance, legal, or off-platform contact leads as manual-review only.',
  ].join('\n').trim();
}

function ensureOutputDirs() {
  mkdirSync(REPORTS_DIR, { recursive: true });
  mkdirSync(PROPOSALS_DIR, { recursive: true });
}

async function writeLeadOutputs(leads, report, options) {
  if (options.dryRun) return { reportPath: null, draftPaths: [] };
  if (leads.length === 0 && !options.writeEmpty) return { reportPath: null, draftPaths: [] };
  ensureOutputDirs();
  const reportPath = path.join(REPORTS_DIR, `${today()}-freelance-mail-radar-${timestamp().slice(11)}.md`);
  writeFileSync(reportPath, `${report}\n`, 'utf8');
  const draftPaths = [];
  for (const lead of leads) {
    const draftPath = path.join(PROPOSALS_DIR, `${today()}-${slugify(lead.platform)}-mail-${slugify(lead.title)}.md`);
    const body = [
      `# ${lead.platform} Draft - ${lead.title}`,
      '',
      `URL: ${lead.url}`,
      `Score: ${lead.scores.total}/5`,
      `Risk: ${lead.scores.risk}/5`,
      `Action: ${lead.recommendation}`,
      '',
      `Human gate: review and approve before submitting on ${lead.platform}.`,
      '',
      '## Proposal',
      '',
      await renderProposal(lead, options),
      '',
      '## Internal Notes',
      '',
      `- Budget: ${lead.budget || 'unknown'}`,
      `- Recommended offer: ${lead.recommended_offer?.name || 'n/a'}`,
      `- Extracted brief: ${lead.description || 'n/a'}`,
    ].join('\n');
    writeFileSync(draftPath, `${body.trim()}\n`, 'utf8');
    draftPaths.push(draftPath);
  }
  return { reportPath, draftPaths };
}

function runSelfTest() {
  const config = readYaml(CONFIG_PATH);
  const samples = [
    {
      id: 'test-99',
      source_id: '99freelas',
      subject: 'Novo Projeto: Integrar agente de IA a site de imobiliaria',
      sender: '99Freelas <no-reply@99freelas.com.br>',
      dateReceived: 'Mon Jun 29 2026 16:39:34 GMT-0300',
      content: [
        'Ha um novo projeto que pode ser do seu interesse:',
        'Integrar agente de IA a site de imobiliaria',
        'Criacao & Integracao com IA | Intermediario | Orcamento: Aberto',
        'Preciso integrar um agente de IA ao site via requisicoes HTTP.',
        'Leia mais.',
      ].join('\n'),
      source: 'https://www.99freelas.com.br/project/integrar-agente-de-ia-a-site-de-imobiliaria-764290',
    },
    {
      id: 'test-workana',
      source_id: 'workana',
      subject: 'Novo projeto: Dashboard com IA para acompanhamento comercial',
      sender: 'Workana <notifications@workana.com>',
      dateReceived: 'Tue Jun 30 2026 14:52:17 GMT-0300',
      content: [
        'Dashboard com IA para acompanhamento comercial',
        'Programacao e Tecnologia | Medio | Orcamento: BRL 500 - BRL 1300',
        'Preciso de um dashboard simples com CSV, score, resumo executivo e filtros.',
      ].join('\n'),
      source: 'https://www.workana.com/job/dashboard-com-ia-para-acompanhamento-comercial',
    },
  ];
  const leads = samples.map((sample) => scoreLead(leadFromMessage(sample, config), config));
  const failures = [];
  if (!leads[0].url.includes('99freelas.com.br/project/')) failures.push('99Freelas project URL was not extracted');
  if (!leads[1].url.includes('workana.com/job/')) failures.push('Workana project URL was not extracted');
  if (leads.some((lead) => lead.scores.total <= 0)) failures.push('score was not computed');
  if (!renderDeterministicProposal(leads[0]).includes('Valor de entrada')) failures.push('proposal was not rendered');
  if (failures.length) throw new Error(`self-test failed: ${failures.join('; ')}`);
  console.log('freelance-mail-radar self-test OK');
}

async function main() {
  if (has('--help') || has('-h')) {
    console.log(usage());
    return;
  }
  if (has('--self-test')) {
    runSelfTest();
    return;
  }

  const config = readYaml(CONFIG_PATH);
  const sourceDefs = sourceDefsFromArg();
  const sinceHours = Number(getArg('--since-hours', 24));
  const inputFile = getArg('--input-file');
  const includeProcessed = has('--include-processed');
  const options = {
    sourceLabel: sourceDefs.map((sourceDef) => sourceDef.platform).join(', '),
    sinceHours: Number.isFinite(sinceHours) && sinceHours > 0 ? sinceHours : 24,
    inputFile,
    dryRun: has('--dry-run'),
    writeEmpty: has('--write-empty'),
    aiDrafts: has('--ai-drafts'),
  };
  const state = readState();
  const messages = inputFile
    ? loadMessagesFromFile(inputFile, sourceDefs)
    : loadMailMessages({ ...options, sourceDefs });
  const candidates = messages
    .map((message) => leadFromMessage(message, config))
    .filter(Boolean)
    .map((lead) => scoreLead(lead, config))
    .sort((a, b) => b.scores.total - a.scores.total);
  const newLeads = candidates.filter((lead) => (
    includeProcessed || !state.processed[lead.mail_message_id]
  ));
  const actionable = newLeads.filter((lead) => lead.recommendation !== 'monitor');
  const report = await renderReport(actionable, candidates, options);
  const outputs = await writeLeadOutputs(actionable, report, options);

  if (!options.dryRun) {
    const seenAt = new Date().toISOString();
    for (const lead of newLeads) {
      state.processed[lead.mail_message_id] = {
        seen_at: seenAt,
        platform: lead.platform,
        title: lead.title,
        url: lead.url,
        score: lead.scores.total,
        recommendation: lead.recommendation,
      };
    }
    writeState(state);
  }

  const summary = {
    checked_messages: messages.length,
    parsed_candidates: candidates.length,
    new_messages: newLeads.length,
    actionable: actionable.length,
    processed_mail_message_ids: candidates.map((lead) => lead.mail_message_id).filter(Boolean),
    new_mail_message_ids: newLeads.map((lead) => lead.mail_message_id).filter(Boolean),
    actionable_mail_message_ids: actionable.map((lead) => lead.mail_message_id).filter(Boolean),
    report_path: outputs.reportPath,
    draft_paths: outputs.draftPaths,
    top: actionable.slice(0, 5).map((lead) => ({
      platform: lead.platform,
      title: lead.title,
      url: lead.url,
      score: lead.scores.total,
      risk: lead.scores.risk,
      recommendation: lead.recommendation,
    })),
  };

  if (has('--json')) console.log(JSON.stringify(summary, null, 2));
  else {
    console.log(`Freelance Mail radar checked ${summary.checked_messages} message(s); ${summary.actionable} actionable draft(s).`);
    if (summary.report_path) console.log(`Report: ${summary.report_path}`);
    for (const draft of summary.draft_paths) console.log(`Draft: ${draft}`);
    if (options.dryRun) console.log('Dry-run only. No files written.');
  }
}

try {
  await main();
} catch (err) {
  console.error(`freelance-mail-radar failed: ${err.message}`);
  process.exit(1);
}
