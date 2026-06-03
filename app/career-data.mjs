import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

import { dataPaths } from './config.mjs';

function readText(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf-8') : '';
}

function splitMarkdownRow(line) {
  if (line.includes('\t')) {
    return line
      .replace(/^\|/, '')
      .split('\t')
      .map(part => part.trim().replace(/^\|+|\|+$/g, '').trim());
  }
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map(part => part.trim());
}

function parseScore(value) {
  const match = String(value || '').match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function extractReportPath(value) {
  const match = String(value || '').match(/\]\(([^)]+)\)/);
  return match ? match[1] : '';
}

function needsHumanAction(status, notes) {
  const text = `${status || ''} ${notes || ''}`.toLowerCase();
  return [
    'pending submit',
    'final submit not clicked',
    'evaluated',
    'interview',
    'offer',
    'responded',
  ].some(pattern => text.includes(pattern));
}

function recommendedActionFor(app) {
  const status = String(app.status || '').toLowerCase();
  if (status === 'skip' || status === 'discarded' || status === 'rejected') return 'skip';
  if (app.needsHumanAction) return 'review-now';
  if ((app.score || 0) >= 4) return 'review-now';
  if ((app.score || 0) >= 3) return 'consider';
  return 'skip';
}

export function parseApplicationsMarkdown(markdown) {
  const apps = [];
  for (const raw of String(markdown || '').split('\n')) {
    const line = raw.trim();
    if (!line.startsWith('|') || line.startsWith('|---') || /^\|\s*#\s*\|/.test(line)) continue;
    const fields = splitMarkdownRow(line);
    if (fields.length < 9) continue;
    const app = {
      number: Number.parseInt(fields[0], 10) || apps.length + 1,
      date: fields[1] || '',
      company: fields[2] || '',
      role: fields[3] || '',
      score: parseScore(fields[4]),
      scoreRaw: fields[4] || '',
      status: fields[5] || '',
      pdf: fields[6] || '',
      hasPDF: /✅|yes|true/i.test(fields[6] || ''),
      report: fields[7] || '',
      reportPath: extractReportPath(fields[7]),
      notes: fields[8] || '',
    };
    app.needsHumanAction = needsHumanAction(app.status, app.notes);
    app.recommendedAction = recommendedActionFor(app);
    apps.push(app);
  }
  return apps;
}

function parsePipelineLine(line) {
  const match = line.match(/^-\s*\[( |x|X|!)]\s+(\S+)(?:\s*\|\s*(.*))?$/);
  if (!match) return null;
  const status = match[1] === ' ' ? 'pending' : match[1].toLowerCase() === 'x' ? 'processed' : 'error';
  const rest = (match[3] || '').split('|').map(part => part.trim());
  return {
    status,
    url: match[2],
    company: rest[0] || '',
    role: rest[1] || '',
    raw: line,
  };
}

export function parsePipelineMarkdown(markdown) {
  const pending = [];
  for (const raw of String(markdown || '').split('\n')) {
    const item = parsePipelineLine(raw.trim());
    if (item && item.status === 'pending') pending.push(item);
  }
  return pending;
}

export function parseScanHistoryTsv(tsv) {
  const rows = [];
  for (const line of String(tsv || '').split('\n')) {
    if (!line.trim() || line.startsWith('url\t')) continue;
    const fields = line.split('\t');
    if (fields.length < 6) continue;
    rows.push({
      url: fields[0],
      firstSeen: fields[1],
      portal: fields[2],
      title: fields[3],
      company: fields[4],
      status: fields[5],
      location: fields[6] || '',
    });
  }
  return rows;
}

function fitSignals(item) {
  const text = `${item.company || ''} ${item.role || item.title || ''}`.toLowerCase();
  const signals = [];
  const rules = [
    ['servicenow', 40, 'ServiceNow'],
    ['now assist', 16, 'Now Assist'],
    ['agentic', 14, 'Agentic AI'],
    ['ai', 12, 'AI'],
    ['artificial intelligence', 12, 'AI'],
    ['workflow', 10, 'Workflow'],
    ['platform architect', 10, 'Platform architecture'],
    ['solution architect', 10, 'Solutions architecture'],
    ['solutions architect', 10, 'Solutions architecture'],
    ['enterprise account', 9, 'Enterprise GTM'],
    ['account exec', 8, 'Enterprise GTM'],
    ['gtm', 8, 'GTM'],
    ['fsi', 8, 'FSI'],
    ['financial services', 8, 'FSI'],
    ['forward deployed', 8, 'Forward deployed'],
    ['data and ai', 8, 'Data and AI'],
  ];
  let score = 20;
  for (const [needle, weight, label] of rules) {
    if (text.includes(needle)) {
      score += weight;
      if (!signals.includes(label)) signals.push(label);
    }
  }
  if (/junior|intern|sdr|bdr|business development representative/.test(text)) score -= 30;
  return { score: Math.max(0, Math.min(100, score)), signals };
}

export function rankOpportunities(items) {
  return [...items]
    .map((item) => {
      const { score, signals } = fitSignals(item);
      return {
        ...item,
        fitScore: score,
        signals,
        priority: score >= 70 ? 'review-now' : score >= 45 ? 'consider' : 'watch',
      };
    })
    .sort((a, b) => b.fitScore - a.fitScore || String(a.company).localeCompare(String(b.company)));
}

function loadReports(reportsDir) {
  if (!existsSync(reportsDir)) return [];
  return readdirSync(reportsDir)
    .filter(file => file.endsWith('.md') && !file.startsWith('.'))
    .sort()
    .reverse()
    .slice(0, 20)
    .map(file => ({ file, path: `reports/${file}` }));
}

function metricsFor(applications, opportunities) {
  const statuses = {};
  for (const app of applications) statuses[app.status] = (statuses[app.status] || 0) + 1;
  return {
    totalApplications: applications.length,
    pendingOpportunities: opportunities.length,
    humanActions: applications.filter(app => app.needsHumanAction).length,
    topScore: applications.reduce((best, app) => Math.max(best, app.score || 0), 0),
    statuses,
  };
}

export function buildDashboardModel(stateDir) {
  const paths = dataPaths(stateDir);
  const applications = parseApplicationsMarkdown(readText(paths.applications));
  const pipeline = parsePipelineMarkdown(readText(paths.pipeline));
  const scanHistory = parseScanHistoryTsv(readText(paths.scanHistory));
  const opportunities = rankOpportunities(pipeline);
  return {
    generatedAt: new Date().toISOString(),
    stateDir,
    metrics: metricsFor(applications, opportunities),
    applications,
    opportunities: opportunities.slice(0, 40),
    scanHistory: scanHistory.slice(-50).reverse(),
    reports: loadReports(paths.reportsDir),
  };
}
