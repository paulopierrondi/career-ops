#!/usr/bin/env node
/**
 * freelance-radar.mjs - local AI/freelance opportunity radar.
 *
 * Reads local config + seed leads, ranks opportunities, and writes draft-only
 * reports/proposals. It never sends outreach or calls authenticated services.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { load as yamlLoad } from 'js-yaml';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(ROOT, 'config/freelance-radar.yml');
const LEADS_PATH = path.join(ROOT, 'data/freelance-leads.json');
const REPORTS_DIR = path.join(ROOT, 'reports/freelance');
const PROPOSALS_DIR = path.join(ROOT, 'output/freelance-proposals');
const TEMPLATES_DIR = path.join(ROOT, 'templates/freelance');

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const getArg = (flag, fallback = null) => {
  const idx = args.indexOf(flag);
  if (idx === -1 || args[idx + 1] === undefined) return fallback;
  return args[idx + 1];
};

const today = () => new Date().toISOString().slice(0, 10);
const slugify = (value) => String(value)
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

function readYaml(file) {
  if (!existsSync(file)) throw new Error(`Missing config file: ${file}`);
  return yamlLoad(readFileSync(file, 'utf8'));
}

function readJson(file) {
  if (!existsSync(file)) throw new Error(`Missing data file: ${file}`);
  return JSON.parse(readFileSync(file, 'utf8'));
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

function countMatches(haystack, needles) {
  const text = normalizeList(haystack).join(' ');
  return needles.filter((needle) => text.includes(needle)).length;
}

function moneyScore(lead, source) {
  const budget = String(lead.budget || '').toLowerCase();
  if (/\$40-\$65|\$35-\$60|\$60|us\$|hourly|ongoing|3 to 6 months|20 hrs\/week/.test(budget)) return 5;
  if (/r\$|fixed|setup|1 to 3 months|platform proposal|open project/.test(budget)) return 3.5;
  if (/\$100|low budget/.test(budget)) return 1.5;
  return Number(source?.default_revenue_score || 3);
}

function speedScore(lead) {
  const text = `${lead.title || ''} ${lead.description || ''} ${(lead.tags || []).join(' ')}`.toLowerCase();
  if (/audit|content|spreadsheet|n8n|make|zapier|crm|workflow|no-code/.test(text)) return 4.5;
  if (/python|playwright|api|dashboard|whatsapp|chatbot/.test(text)) return 3.5;
  if (/production-ready|rag|agent workflow|marketplace|backend/.test(text)) return 2.5;
  return 3;
}

function automationScore(lead, positiveKeywords) {
  const text = `${lead.title || ''} ${lead.description || ''} ${(lead.tags || []).join(' ')}`.toLowerCase();
  const matches = positiveKeywords.filter((keyword) => text.includes(keyword)).length;
  return clampScore(1 + matches * 0.55);
}

function riskScore(lead, negativeKeywords) {
  const text = `${lead.title || ''} ${lead.description || ''} ${(lead.tags || []).join(' ')} ${lead.risk_notes || ''}`.toLowerCase();
  let risk = 1;
  risk += negativeKeywords.filter((keyword) => text.includes(keyword)).length * 3.5;
  if (/linkedin|outreach|whatsapp|lead generation/.test(text)) risk += 1;
  if (/production-ready|backend|marketplace|finance|insurance|health|regulated/.test(text)) risk += 0.75;
  if (/bradesco|servicenow customer/.test(text)) risk += 4;
  return clampScore(risk);
}

function scoreOfferFit(lead, offer) {
  const leadText = `${lead.title || ''} ${lead.description || ''} ${(lead.tags || []).join(' ')}`.toLowerCase();
  const offerKeywords = normalizeList(offer.keywords);
  const matches = offerKeywords.filter((keyword) => leadText.includes(keyword)).length;
  return clampScore(1 + matches * 0.9);
}

function chooseOffer(lead, offers) {
  const ranked = offers
    .map((offer) => ({ offer, fit: scoreOfferFit(lead, offer) }))
    .sort((a, b) => b.fit - a.fit);
  return ranked[0];
}

function scoreLead(lead, config) {
  const source = (config.sources || []).find((item) => item.id === lead.source_id);
  const positiveKeywords = normalizeList(config.keywords?.positive);
  const negativeKeywords = normalizeList(config.keywords?.negative);
  const selected = chooseOffer(lead, config.offers || []);
  const weights = config.scoring || {};

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
    source_label: source?.label || lead.source_id || 'Unknown source',
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

function classifyRecommendation(total, risk) {
  if (risk >= 4.5) return 'skip_or_manual_review';
  if (total >= 4) return 'submit_proposal';
  if (total >= 3.25) return 'manual_review';
  return 'monitor';
}

function makeScope(lead, offer) {
  const tags = normalizeList(lead.tags);
  if (offer?.id === 'ai_revenue_ops') {
    return [
      '- lead/intake workflow',
      '- CRM or spreadsheet handoff',
      '- follow-up sequence in draft/review mode',
      '- simple dashboard with next actions',
    ].join('\n');
  }
  if (offer?.id === 'content_repurposing') {
    return [
      '- source transcript/content intake',
      '- reusable content map',
      '- newsletter + posts + short-form scripts',
      '- approval queue before publication',
    ].join('\n');
  }
  if (offer?.id === 'agent_ops') {
    return [
      '- workflow and agent boundary map',
      '- gates for secrets, deploy, push, production, and outbound',
      '- runbook and reporting templates',
      '- validation checklist for each agent output',
    ].join('\n');
  }
  return [
    `- current process map (${tags.slice(0, 4).join(', ') || 'workflow'})`,
    '- top automation candidates ranked by ROI and risk',
    '- first three automations scoped or implemented',
    '- runbook for maintenance and failures',
  ].join('\n');
}

function renderTemplate(template, values) {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => values[key] ?? '');
}

function loadTemplates() {
  if (!existsSync(TEMPLATES_DIR)) return new Map();
  const files = readdirSync(TEMPLATES_DIR).filter((file) => file.endsWith('.md')).sort();
  return new Map(files.map((file) => [file, readFileSync(path.join(TEMPLATES_DIR, file), 'utf8')]));
}

function templateForOffer(offer, templates, config) {
  const preferred = {
    ai_revenue_ops: 'proposal-ai-revenue-ops.md',
    automation_audit: 'proposal-automation-audit.md',
    content_repurposing: 'proposal-content-repurposing.md',
    agent_ops: 'proposal-agent-ops.md',
  }[offer?.id];
  const fallback = config.proposal?.default_template || 'proposal-automation-audit.md';
  return templates.get(preferred) || templates.get(fallback) || '';
}

function renderProposal(lead, config, templates) {
  const offer = lead.recommended_offer;
  const template = templateForOffer(offer, templates, config);
  return renderTemplate(template, {
    title: lead.title,
    platform: lead.platform,
    buyer: lead.buyer,
    offer_name: offer?.name || 'Automation Hygiene Audit',
    price_test: offer?.price_test || 'fixed-scope pilot',
    timeline: offer?.timeline || '5 days',
    scope: makeScope(lead, offer),
  });
}

function buildReport(scored, config, limit) {
  const sourceRows = (config.sources || [])
    .map((source) => `| ${source.label} | ${source.region} | ${source.source_type} | ${source.url} |`)
    .join('\n');
  const leadRows = scored.slice(0, limit)
    .map((lead, index) => `| ${index + 1} | ${lead.platform} | ${lead.title} | ${lead.recommended_offer?.name || 'n/a'} | ${lead.scores.total}/5 | ${lead.scores.risk}/5 | ${lead.recommendation} |`)
    .join('\n');
  const detailBlocks = scored.slice(0, limit).map((lead, index) => {
    const offer = lead.recommended_offer;
    return [
      `### ${index + 1}. ${lead.title}`,
      '',
      `- Platform: ${lead.platform}`,
      `- Source: ${lead.source_label}`,
      `- Buyer: ${lead.buyer || 'Unknown'}`,
      `- URL: ${lead.url}`,
      `- Budget clue: ${lead.budget || 'Unknown'}`,
      `- Recommended offer: ${offer?.name || 'n/a'}`,
      `- Score: ${lead.scores.total}/5 (fit ${lead.scores.offer_fit}, revenue ${lead.scores.revenue}, speed ${lead.scores.speed}, automation ${lead.scores.automation_leverage}, risk ${lead.scores.risk})`,
      `- Action: ${lead.recommendation}`,
      `- Risk note: ${lead.risk_notes || 'None'}`,
    ].join('\n');
  }).join('\n\n');

  return [
    `# Freelance Radar - ${today()}`,
    '',
    '## Executive Summary',
    '',
    `Top ${limit} AI/automation freelance opportunities ranked for Paulo. This report is draft-only: no outreach, publishing, ads, deploy, push, Linear mutation, or secrets access was performed.`,
    '',
    'Recommended first wedge remains **AI Revenue Ops Pack** for low-conflict expert-led small businesses, with **Automation Hygiene Audit** as the safest proposal when scope is broad.',
    '',
    '## Ranked Opportunities',
    '',
    '| Rank | Platform | Opportunity | Offer | Score | Risk | Action |',
    '|---:|---|---|---|---:|---:|---|',
    leadRows,
    '',
    '## Details',
    '',
    detailBlocks,
    '',
    '## Source Watchlist',
    '',
    '| Source | Region | Type | URL |',
    '|---|---|---|---|',
    sourceRows,
    '',
    '## Human Gates',
    '',
    '- Review each proposal manually before sending.',
    '- Do not automate LinkedIn side-business outreach.',
    '- Do not contact ServiceNow customer/partner/account ecosystem leads.',
    '- For any marketing/outbound sequence: dry-run, consent, opt-out, rate limit, and one-to-one send only.',
    '- Keep all secrets, cookies, private messages, and PII out of repo files.',
    '',
    '## Next Actions',
    '',
    '1. Pick 3 top opportunities and manually verify they are still open.',
    '2. Review the generated draft proposal for each.',
    '3. Submit only one-to-one proposals manually.',
    '4. Record outcomes back into `data/freelance-leads.json` or a future tracker file.',
  ].join('\n');
}

function ensureOutputDirs() {
  mkdirSync(REPORTS_DIR, { recursive: true });
  mkdirSync(PROPOSALS_DIR, { recursive: true });
}

function run(config, leads, options = {}) {
  const limit = Number(options.limit || config.default_limit || 8);
  const scored = leads
    .map((lead) => scoreLead(lead, config))
    .sort((a, b) => b.scores.total - a.scores.total);

  const report = buildReport(scored, config, limit);
  const templates = loadTemplates();
  const proposalCandidates = scored
    .filter((lead) => ['submit_proposal', 'manual_review'].includes(lead.recommendation))
    .slice(0, Number(config.proposal?.max_drafts || 6));

  const proposalDrafts = proposalCandidates.map((lead) => ({
    lead,
    filename: `${today()}-${slugify(lead.platform)}-${slugify(lead.title)}.md`,
    body: renderProposal(lead, config, templates),
  }));

  return {
    generated_at: new Date().toISOString(),
    limit,
    report_path: path.join(REPORTS_DIR, `${today()}-freelance-radar.md`),
    proposals_dir: PROPOSALS_DIR,
    scored,
    report,
    proposal_drafts: proposalDrafts,
  };
}

function writeOutputs(result, options = {}) {
  if (options.dryRun) return;
  ensureOutputDirs();
  if (options.writeReport !== false) writeFileSync(result.report_path, `${result.report}\n`);
  if (options.writeProposals !== false) {
    for (const draft of result.proposal_drafts) {
      writeFileSync(path.join(PROPOSALS_DIR, draft.filename), `${draft.body.trim()}\n`);
    }
  }
}

function runSelfTest() {
  const config = {
    default_limit: 2,
    sources: [{ id: 'test', label: 'Test', default_revenue_score: 3 }],
    keywords: { positive: ['automation', 'crm'], negative: ['mass dm'] },
    offers: [
      { id: 'automation_audit', name: 'Automation Hygiene Audit', keywords: ['automation', 'workflow'], price_test: 'R$1500', timeline: '5 days' },
      { id: 'ai_revenue_ops', name: 'AI Revenue Ops Pack', keywords: ['crm', 'lead generation'], price_test: 'R$2500', timeline: '7 days' },
    ],
    scoring: { offer_fit: 0.3, revenue: 0.25, speed: 0.15, automation_leverage: 0.2, risk: 0.1 },
    proposal: { max_drafts: 2, default_template: 'proposal-automation-audit.md' },
  };
  const leads = [
    { id: 'a', source_id: 'test', platform: 'Test', title: 'CRM automation workflow', buyer: 'Biz', budget: 'Hourly ongoing', description: 'Need automation and CRM', tags: ['automation', 'crm'], url: 'https://example.com' },
    { id: 'b', source_id: 'test', platform: 'Test', title: 'Mass DM scraper', buyer: 'Bad', budget: '$100', description: 'mass dm', tags: ['mass dm'], url: 'https://example.com' },
  ];
  const result = run(config, leads, { limit: 2 });
  const failures = [];
  if (result.scored[0].id !== 'a') failures.push('best lead was not ranked first');
  if (result.scored[1].recommendation !== 'skip_or_manual_review') failures.push('high-risk lead was not gated');
  if (!result.report.includes('Freelance Radar')) failures.push('report was not rendered');
  if (failures.length > 0) {
    console.error(`freelance-radar self-test failed: ${failures.join('; ')}`);
    process.exit(1);
  }
  console.log('freelance-radar self-test OK');
}

if (has('--self-test')) {
  runSelfTest();
  process.exit(0);
}

const config = readYaml(CONFIG_PATH);
const leads = readJson(LEADS_PATH);
const limit = Number(getArg('--limit', config.default_limit || 8));
const result = run(config, leads, {
  limit,
  dryRun: has('--dry-run'),
  writeReport: !has('--no-report'),
  writeProposals: !has('--no-proposals'),
});

writeOutputs(result, {
  dryRun: has('--dry-run'),
  writeReport: !has('--no-report'),
  writeProposals: !has('--no-proposals'),
});

if (has('--json')) {
  console.log(JSON.stringify({
    generated_at: result.generated_at,
    report_path: has('--dry-run') ? null : result.report_path,
    proposals_dir: has('--dry-run') ? null : result.proposals_dir,
    top: result.scored.slice(0, limit).map((lead) => ({
      id: lead.id,
      platform: lead.platform,
      title: lead.title,
      offer: lead.recommended_offer?.name,
      score: lead.scores.total,
      risk: lead.scores.risk,
      recommendation: lead.recommendation,
      url: lead.url,
    })),
  }, null, 2));
} else {
  console.log(`Freelance radar ranked ${result.scored.length} leads.`);
  if (has('--dry-run')) {
    console.log('Dry-run only. No files written.');
  } else {
    console.log(`Report: ${result.report_path}`);
    console.log(`Proposal drafts: ${result.proposal_drafts.length} in ${PROPOSALS_DIR}`);
  }
}
