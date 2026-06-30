#!/usr/bin/env node
/**
 * 99freelas-mail-radar.mjs
 *
 * Reads local Apple Mail notifications from 99Freelas, extracts project links,
 * scores them with the freelance radar config, and writes draft-only reports.
 * It never submits proposals, spends credits, replies to clients, or reads
 * secrets. Submission remains a human gate.
 */

import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load as yamlLoad } from 'js-yaml';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const CONFIG_PATH = path.join(ROOT, 'config/freelance-radar.yml');
const STATE_PATH = path.join(ROOT, 'data/99freelas-mail-radar-state.json');
const REPORTS_DIR = path.join(ROOT, 'reports/freelance');
const PROPOSALS_DIR = path.join(ROOT, 'output/freelance-proposals');

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const getArg = (flag, fallback = null) => {
  const idx = args.indexOf(flag);
  if (idx === -1 || args[idx + 1] === undefined) return fallback;
  return args[idx + 1];
};

const now = () => new Date();
const today = () => now().toISOString().slice(0, 10);
const timestamp = () => now().toISOString().replace(/[:.]/g, '-').slice(0, 19);

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

function compactText(value) {
  return String(value || '')
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

function extractProjectUrls(decodedSource) {
  const urls = [];
  for (const match of decodeHtmlEntities(decodedSource).matchAll(/https:\/\/www\.99freelas\.com\.br\/project\/[^\s"'<>]+/g)) {
    const clean = match[0].replace(/[).,;]+$/g, '');
    if (!urls.includes(clean)) urls.push(clean);
  }
  return urls;
}

function extractBudget(content) {
  const match = content.match(/Or(?:c|ç)amento:\s*([^\n]+)/i);
  return match ? match[1].trim() : 'Orcamento nao informado';
}

function extractMeta(content) {
  const match = content.match(/\n([^\n|]+)\s+\|\s+([^|\n]+)\s+\|\s+Or(?:c|ç)amento:\s*([^\n]+)/i);
  return {
    category: match?.[1]?.trim() || '',
    level: match?.[2]?.trim() || '',
    budget: match?.[3]?.trim() || extractBudget(content),
  };
}

function extractDescription(content) {
  const afterBudget = content.split(/Or(?:c|ç)amento:\s*[^\n]+\n/i)[1] || content;
  return compactText(
    afterBudget
      .replace(/\s+Leia mais\..*$/is, '')
      .replace(/\* Este e um email automatico\..*$/is, '')
      .replace(/\* Este é um email automático\..*$/is, '')
  ).slice(0, 1200);
}

function extractTags(text, config) {
  const lower = text.toLowerCase();
  const positives = normalizeList(config.keywords?.positive);
  return positives.filter((keyword) => lower.includes(keyword)).slice(0, 12);
}

function moneyScore(lead, source) {
  const budget = String(lead.budget || '').toLowerCase();
  if (/r\$\s*(?:[2-9]\d{2,}|[1-9]\.\d{3,})|10\.000|aberto/.test(budget)) return 3.8;
  if (/r\$|fixed|setup|platform proposal|proposta/.test(budget)) return 3.2;
  if (/50|100|baixo/.test(budget)) return 1.5;
  return Number(source?.default_revenue_score || 3);
}

function speedScore(lead) {
  const text = scoringText(lead);
  if (/n8n|make|zapier|crm|dashboard|landing|whatsapp|api|webhook|automacao/.test(text)) return 4.5;
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
  if (/scraping|captcha|mass dm|disparo em massa|fake|burlar/.test(text)) risk += 3;
  if (/saude|clinica|finance|credito|juridic|advocacia|lgpd|whatsapp/.test(text)) risk += 0.8;
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
  if (total >= 4) return 'hot_draft_for_paulo';
  if (total >= 3.25) return 'draft_for_manual_review';
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
    source_label: source?.label || '99Freelas',
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
  if (/landing|pagina|site/.test(text)) return 'R$350-R$550 liquido';
  if (/dashboard|power bi|bi|planilha/.test(text)) return 'R$550-R$850 liquido';
  if (/whatsapp|n8n|make|zapier|crm|api|webhook/.test(text)) return 'R$650-R$950 liquido';
  if (/agente|chatbot|rag|base de conhecimento|openai|ia/.test(text)) return 'R$750-R$1.100 liquido';
  if (/saas|marketplace|plataforma/.test(text)) return 'R$1.200-R$2.500 liquido';
  return 'R$450-R$750 liquido';
}

function chooseFirstSlice(lead) {
  const text = `${lead.title} ${lead.description}`.toLowerCase();
  if (/landing|pagina|página|site/.test(text)) {
    return 'uma landing responsiva de 2 secoes, com promessa clara, copy para o publico certo, CTA para WhatsApp e acabamento mobile';
  }
  if (/whatsapp/.test(text)) {
    return 'um MVP controlado de WhatsApp com FAQ aprovada, qualificacao, resumo para humano, logs e fallback';
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
  if (/api|webhook|integracao|http/.test(text)) {
    return 'a primeira integracao ponta a ponta com payloads mapeados, teste real/controlado e documentacao';
  }
  return 'uma microfase fechada com diagnostico, primeiro fluxo funcional, teste e handoff';
}

function renderProposal(lead) {
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
    ? `Oi. Li o projeto: voce precisa de uma landing curta, profissional e persuasiva para levar advogados criminalistas ao grupo de WhatsApp.`
    : `Oi. Li o projeto e o ponto principal parece ser colocar ${lead.title.toLowerCase()} para funcionar sem virar um escopo aberto.`;
  const deliverables = isLanding ? [
    '1. estrutura da oferta e copy principal;',
    '2. landing responsiva com visual profissional;',
    '3. CTA para entrada no grupo de WhatsApp;',
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

function leadFromMessage(message, config) {
  const decodedSource = decodeQuotedPrintable(message.source || '');
  const urls = extractProjectUrls(decodedSource);
  const content = compactText(message.content || '');
  const title = String(message.subject || '')
    .replace(/^Novo Projeto:\s*/i, '')
    .trim() || 'Novo projeto 99Freelas';
  const meta = extractMeta(content);
  const description = extractDescription(content);
  const text = `${title} ${description} ${meta.category} ${meta.level}`;
  const projectId = urls[0]?.match(/-(\d+)(?:[/?#]|$)/)?.[1] || String(message.id);
  return {
    id: `99freelas-mail-${projectId}-${message.id}`,
    mail_message_id: String(message.id),
    source_id: text.toLowerCase().includes('automacao') ? '99freelas_rpa' : '99freelas_ai',
    platform: '99Freelas',
    title,
    buyer: '99Freelas client',
    url: urls[0] || 'https://www.99freelas.com.br/projects',
    posted: String(message.dateReceived || '').slice(0, 24),
    budget: meta.budget,
    category: meta.category,
    level: meta.level,
    description,
    tags: extractTags(text, config),
    risk_notes: 'Draft-only Mail.app lead. Human approval required before proposal submission or connection spend.',
  };
}

function loadMailMessages({ sinceHours }) {
  const jxa = `
const Mail = Application('Mail');
const cutoff = Date.now() - (${Number(sinceHours)} * 60 * 60 * 1000);
const messages = Mail.inbox.messages.whose({sender: {_contains: '99freelas.com.br'}})();
const out = [];
for (const m of messages) {
  const received = m.dateReceived();
  const receivedMs = received && typeof received.getTime === 'function' ? received.getTime() : 0;
  if (receivedMs && receivedMs < cutoff) continue;
  const subject = String(m.subject() || '');
  if (!/Novo Projeto/i.test(subject)) continue;
  out.push({
    id: String(m.id()),
    subject,
    sender: String(m.sender() || ''),
    dateReceived: String(received || ''),
    content: String(m.content() || ''),
    source: String(m.source() || '')
  });
}
JSON.stringify(out);
`;
  const stdout = execFileSync('osascript', ['-l', 'JavaScript'], {
    input: jxa,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  return JSON.parse(stdout || '[]');
}

function renderReport(newLeads, allCandidates, options) {
  const rows = newLeads.map((lead) => (
    `| ${lead.recommendation} | ${lead.scores.total}/5 | ${lead.scores.risk}/5 | ${lead.title} | ${lead.budget} | ${lead.url} |`
  )).join('\n') || '| n/a | n/a | n/a | No new lead | n/a | n/a |';

  const details = newLeads.map((lead, index) => [
    `## ${index + 1}. ${lead.title}`,
    '',
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
    renderProposal(lead),
  ].join('\n')).join('\n\n');

  return [
    `# 99Freelas Mail Radar - ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
    '',
    `Checked recent Mail.app messages from 99Freelas in the last ${options.sinceHours} hour(s).`,
    '',
    'No proposal was submitted, no connection was spent, no client reply was sent, and no secrets were read.',
    '',
    `Candidates read: ${allCandidates.length}`,
    `New candidates drafted: ${newLeads.length}`,
    '',
    '| Action | Score | Risk | Title | Budget | URL |',
    '|---|---:|---:|---|---|---|',
    rows,
    '',
    details,
    '',
    '## Human Gate',
    '',
    '- Paulo must approve before opening 99Freelas, spending one connection, submitting, boosting, sending follow-up, or moving off-platform.',
    '- If Gmail connector remains blocked, this Mail.app path is the local fallback.',
  ].join('\n').trim();
}

function ensureOutputDirs() {
  mkdirSync(REPORTS_DIR, { recursive: true });
  mkdirSync(PROPOSALS_DIR, { recursive: true });
}

function writeLeadOutputs(leads, report, options) {
  if (options.dryRun) return { reportPath: null, draftPaths: [] };
  if (leads.length === 0 && !options.writeEmpty) return { reportPath: null, draftPaths: [] };
  ensureOutputDirs();
  const reportPath = path.join(REPORTS_DIR, `${today()}-99freelas-mail-radar-${timestamp().slice(11)}.md`);
  writeFileSync(reportPath, `${report}\n`, 'utf8');
  const draftPaths = [];
  for (const lead of leads) {
    const draftPath = path.join(PROPOSALS_DIR, `${today()}-99freelas-mail-${slugify(lead.title)}.md`);
    const body = [
      `# 99Freelas Draft - ${lead.title}`,
      '',
      `URL: ${lead.url}`,
      `Score: ${lead.scores.total}/5`,
      `Risk: ${lead.scores.risk}/5`,
      `Action: ${lead.recommendation}`,
      '',
      'Human gate: review and approve before submitting on 99Freelas.',
      '',
      '## Proposal',
      '',
      renderProposal(lead),
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
  const sample = {
    id: 'test-1',
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
  };
  const lead = scoreLead(leadFromMessage(sample, config), config);
  const failures = [];
  if (!lead.url.includes('/project/')) failures.push('project URL was not extracted');
  if (!lead.title.includes('agente')) failures.push('title was not extracted');
  if (lead.scores.total <= 0) failures.push('score was not computed');
  if (!renderProposal(lead).includes('Valor de entrada')) failures.push('proposal was not rendered');
  if (failures.length) throw new Error(`self-test failed: ${failures.join('; ')}`);
  console.log('99freelas-mail-radar self-test OK');
}

function main() {
  if (has('--self-test')) {
    runSelfTest();
    return;
  }

  const config = readYaml(CONFIG_PATH);
  const sinceHours = Number(getArg('--since-hours', 36));
  const includeProcessed = has('--include-processed');
  const options = {
    sinceHours: Number.isFinite(sinceHours) && sinceHours > 0 ? sinceHours : 36,
    dryRun: has('--dry-run'),
    writeEmpty: has('--write-empty'),
  };
  const state = readState();
  const messages = loadMailMessages(options);
  const candidates = messages
    .map((message) => scoreLead(leadFromMessage(message, config), config))
    .sort((a, b) => b.scores.total - a.scores.total);
  const newLeads = candidates.filter((lead) => (
    includeProcessed || !state.processed[lead.mail_message_id]
  ));
  const actionable = newLeads.filter((lead) => lead.recommendation !== 'monitor');
  const report = renderReport(actionable, candidates, options);
  const outputs = writeLeadOutputs(actionable, report, options);

  if (!options.dryRun) {
    const seenAt = new Date().toISOString();
    for (const lead of newLeads) {
      state.processed[lead.mail_message_id] = {
        seen_at: seenAt,
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
    new_messages: newLeads.length,
    actionable: actionable.length,
    report_path: outputs.reportPath,
    draft_paths: outputs.draftPaths,
    top: actionable.slice(0, 5).map((lead) => ({
      title: lead.title,
      url: lead.url,
      score: lead.scores.total,
      risk: lead.scores.risk,
      recommendation: lead.recommendation,
    })),
  };

  if (has('--json')) console.log(JSON.stringify(summary, null, 2));
  else {
    console.log(`99Freelas Mail radar checked ${summary.checked_messages} message(s); ${summary.actionable} actionable draft(s).`);
    if (summary.report_path) console.log(`Report: ${summary.report_path}`);
    for (const draft of summary.draft_paths) console.log(`Draft: ${draft}`);
    if (options.dryRun) console.log('Dry-run only. No files written.');
  }
}

try {
  main();
} catch (err) {
  console.error(`99freelas-mail-radar failed: ${err.message}`);
  process.exit(1);
}
