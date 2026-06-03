#!/usr/bin/env node

import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { isAuthorized } from './auth.mjs';
import {
  buildDashboardModel,
  parseApplicationsMarkdown,
  parsePipelineMarkdown,
  rankOpportunities,
} from './career-data.mjs';
import { resolveEmailFrom, runDailyMonitor, scanCompanyFilters } from './runner.mjs';
import { createAppServer } from './server.mjs';
import { parseServiceNowJobs } from './parsers/servicenow-jobs.mjs';
import { buildLocationFilter, ensurePipelineFile } from '../scan.mjs';
import smartRecruitersProvider from '../providers/smartrecruiters.mjs';
import { classifyLiveness } from '../liveness-core.mjs';

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function tmpState() {
  const root = mkdtempSync(path.join(tmpdir(), 'career-ops-app-'));
  mkdirSync(path.join(root, 'data'), { recursive: true });
  mkdirSync(path.join(root, 'reports'), { recursive: true });
  mkdirSync(path.join(root, 'config'), { recursive: true });
  mkdirSync(path.join(root, 'modes'), { recursive: true });
  writeFileSync(path.join(root, 'cv.md'), '# Paulo Pierrondi\n', 'utf-8');
  writeFileSync(path.join(root, 'config', 'profile.yml'), 'candidate:\n  full_name: Paulo Pierrondi\n', 'utf-8');
  writeFileSync(path.join(root, 'modes', '_profile.md'), '# Profile\n', 'utf-8');
  writeFileSync(path.join(root, 'portals.yml'), 'tracked_companies: []\n', 'utf-8');
  writeFileSync(path.join(root, 'data', 'applications.md'), [
    '# Applications Tracker',
    '',
    '| # | Date | Company | Role | Score | Status | PDF | Report | Notes |',
    '|---|------|---------|------|-------|--------|-----|--------|-------|',
    '| 001 | 2026-06-02 | Anthropic | Applied AI Architect, Enterprise Tech | 4.4 | Filled - pending submit confirmation | pending | [001](reports/001-anthropic.md) | Form filled; final submit not clicked. |',
    '| 002 | 2026-06-02 | LegacyCo | Java Admin | 2.1 | SKIP | ❌ | [002](reports/002-legacy.md) | Weak fit. |',
    '',
  ].join('\n'), 'utf-8');
  writeFileSync(path.join(root, 'data', 'pipeline.md'), [
    '## Pendientes',
    '- [ ] https://careers.servicenow.com/jobs/123 | ServiceNow | Senior AI Workflow Architect',
    '- [ ] https://jobs.example.com/ai-gtm | Example AI | Enterprise AI GTM Lead',
    '',
    '## Procesadas',
    '- [x] #001 | https://job-boards.greenhouse.io/anthropic/jobs/1 | Anthropic | Applied AI Architect | 4.4/5 | PDF pending',
    '',
  ].join('\n'), 'utf-8');
  writeFileSync(path.join(root, 'data', 'scan-history.tsv'), [
    'url\tfirst_seen\tportal\ttitle\tcompany\tstatus\tlocation',
    'https://careers.servicenow.com/jobs/123\t2026-06-02\tlocal-parser\tSenior AI Workflow Architect\tServiceNow\tadded\tRemote, United States',
    '',
  ].join('\n'), 'utf-8');
  writeFileSync(path.join(root, 'reports', '001-anthropic.md'), [
    '# Anthropic - Applied AI Architect',
    '**Score:** 4.4/5',
    '**URL:** https://job-boards.greenhouse.io/anthropic/jobs/1',
    '## Machine Summary',
    'archetype: Agentic AI Solutions Architect',
    '',
  ].join('\n'), 'utf-8');
  return root;
}

function basic(user, pass) {
  return `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
}

test('parseApplicationsMarkdown extracts tracker rows and human-gated status', () => {
  const root = tmpState();
  try {
    const markdown = readFileSync(path.join(root, 'data', 'applications.md'), 'utf-8');
    const apps = parseApplicationsMarkdown(markdown);
    assert.equal(apps.length, 2);
    assert.equal(apps[0].company, 'Anthropic');
    assert.equal(apps[0].score, 4.4);
    assert.equal(apps[0].needsHumanAction, true);
    assert.equal(apps[1].recommendedAction, 'skip');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('parsePipelineMarkdown extracts pending opportunities with metadata', () => {
  const root = tmpState();
  try {
    const markdown = readFileSync(path.join(root, 'data', 'pipeline.md'), 'utf-8');
    const pending = parsePipelineMarkdown(markdown);
    assert.equal(pending.length, 2);
    assert.equal(pending[0].company, 'ServiceNow');
    assert.equal(pending[0].role, 'Senior AI Workflow Architect');
    assert.equal(pending[0].status, 'pending');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('rankOpportunities prioritizes ServiceNow plus AI fit', () => {
  const ranked = rankOpportunities([
    { company: 'Example AI', role: 'Enterprise AI GTM Lead', url: 'https://example.com' },
    { company: 'ServiceNow', role: 'Senior AI Workflow Architect', url: 'https://servicenow.com' },
    { company: 'LegacyCo', role: 'Java Developer', url: 'https://legacy.example' },
  ]);
  assert.equal(ranked[0].company, 'ServiceNow');
  assert.equal(ranked[0].priority, 'review-now');
  assert.ok(ranked[0].fitScore > ranked[2].fitScore);
});

test('ensurePipelineFile creates a missing pipeline inbox', () => {
  const root = tmpState();
  try {
    const dataDir = path.join(root, 'new-data');
    mkdirSync(dataDir, { recursive: true });
    const filePath = path.join(dataDir, 'pipeline.md');
    ensurePipelineFile(filePath);
    const text = readFileSync(filePath, 'utf-8');
    assert.match(text, /## Pendientes/);
    assert.match(text, /## Procesadas/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('buildLocationFilter does not treat Australia as US because of substring match', () => {
  const filter = buildLocationFilter({
    always_allow: ['US', 'USA', 'United States'],
    allow: ['US', 'USA', 'United States', 'Remote'],
    block: ['Australia'],
  });
  assert.equal(filter('Remote - US'), true);
  assert.equal(filter('Sydney, NSW, Australia'), false);
});

test('isAuthorized rejects missing auth and accepts bearer/basic credentials', () => {
  const env = {
    CAREER_OPS_ADMIN_TOKEN: 'local-test-token',
    CAREER_OPS_BASIC_USER: 'paulo',
  };
  assert.equal(isAuthorized({ headers: {} }, env), false);
  assert.equal(isAuthorized({ headers: { authorization: 'Bearer local-test-token' } }, env), true);
  assert.equal(isAuthorized({ headers: { authorization: basic('paulo', 'local-test-token') } }, env), true);
  assert.equal(isAuthorized({ headers: { authorization: basic('paulo', 'wrong') } }, env), false);
});

test('parseServiceNowJobs extracts job cards from static HTML', () => {
  const html = [
    '<a class="job-card" href="/jobs/123/senior-ai-workflow-architect/">',
    '<h2>Senior AI Workflow Architect</h2>',
    '<span>Remote, United States</span>',
    '</a>',
    '<a href="https://careers.servicenow.com/jobs/456/enterprise-architect/">Enterprise Architect - Now Assist</a>',
  ].join('\n');
  const jobs = parseServiceNowJobs(html, 'https://careers.servicenow.com/jobs/');
  assert.equal(jobs.length, 2);
  assert.equal(jobs[0].company, 'ServiceNow');
  assert.equal(jobs[0].title, 'Senior AI Workflow Architect');
  assert.equal(jobs[0].url, 'https://careers.servicenow.com/jobs/123/senior-ai-workflow-architect/');
});

test('smartrecruiters provider maps ServiceNow postings from public API shape', async () => {
  const jobs = await smartRecruitersProvider.fetch({
    name: 'ServiceNow',
    careers_url: 'https://careers.smartrecruiters.com/ServiceNow',
  }, {
    fetchJson: async (url) => {
      assert.match(url, /api\.smartrecruiters\.com\/v1\/companies\/ServiceNow\/postings/);
      return {
        content: [{
          id: '744000123',
          name: 'Solution Architect, AI Data',
          ref: 'https://api.smartrecruiters.com/v1/companies/ServiceNow/postings/744000123',
          location: { fullLocation: 'Santa Clara, California, United States' },
        }],
      };
    },
  });
  assert.equal(jobs.length, 1);
  assert.equal(jobs[0].company, 'ServiceNow');
  assert.equal(jobs[0].title, 'Solution Architect, AI Data');
  assert.equal(jobs[0].url, 'https://jobs.smartrecruiters.com/ServiceNow/744000123-solution-architect-ai-data');
});

test('classifyLiveness treats SmartRecruiters interested CTA as apply control', () => {
  const result = classifyLiveness({
    finalUrl: 'https://jobs.smartrecruiters.com/ServiceNow/744000129040379-client-director-financial-services',
    bodyText: 'Client Director - Financial Services ServiceNow Job Description Qualifications',
    applyControls: ["I'm interested"],
  });
  assert.equal(result.result, 'active');
  assert.equal(result.code, 'apply_control_visible');
});

test('scanCompanyFilters parses focused daily monitor companies', () => {
  assert.deepEqual(scanCompanyFilters({
    CAREER_OPS_SCAN_COMPANIES: 'ServiceNow, Anthropic, Glean, ',
  }), ['ServiceNow', 'Anthropic', 'Glean']);
  assert.deepEqual(scanCompanyFilters({
    CAREER_OPS_SCAN_COMPANY: 'ServiceNow',
  }), ['ServiceNow']);
});

test('resolveEmailFrom prefers career-ops sender over global app senders', () => {
  assert.equal(resolveEmailFrom({
    CAREER_OPS_EMAIL_FROM: 'Career Ops <onboarding@resend.dev>',
    AUTH_EMAIL_FROM: 'FaithSchool <account@faithschool.app>',
    TRANSACTIONAL_FROM_EMAIL: 'FaithSchool <account@faithschool.app>',
  }), 'Career Ops <onboarding@resend.dev>');
});

test('buildDashboardModel summarizes tracker and opportunities', () => {
  const root = tmpState();
  try {
    const model = buildDashboardModel(root);
    assert.equal(model.metrics.totalApplications, 2);
    assert.equal(model.metrics.humanActions, 1);
    assert.equal(model.opportunities[0].company, 'ServiceNow');
    assert.equal(model.applications[0].reportPath, 'reports/001-anthropic.md');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('createAppServer protects APIs and returns dashboard summary when authenticated', async () => {
  const root = tmpState();
  const server = createAppServer({
    stateDir: root,
    env: {
      CAREER_OPS_ADMIN_TOKEN: 'local-test-token',
      CAREER_OPS_BASIC_USER: 'paulo',
      CAREER_OPS_DAILY_MONITOR: 'disabled',
    },
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const unauthorized = await fetch(`http://127.0.0.1:${port}/api/summary`);
    assert.equal(unauthorized.status, 401);

    const authorized = await fetch(`http://127.0.0.1:${port}/api/summary`, {
      headers: { authorization: basic('paulo', 'local-test-token') },
    });
    assert.equal(authorized.status, 200);
    const json = await authorized.json();
    assert.equal(json.metrics.totalApplications, 2);
    assert.equal(json.opportunities[0].company, 'ServiceNow');
  } finally {
    await new Promise(resolve => server.close(resolve));
    rmSync(root, { recursive: true, force: true });
  }
});

test('runDailyMonitor writes a report and uses injected scan/email hooks', async () => {
  const root = tmpState();
  const sent = [];
  try {
    const result = await runDailyMonitor({
      stateDir: root,
      env: {
        CAREER_OPS_ADMIN_TOKEN: 'local-test-token',
        CAREER_OPS_EMAIL_TO: 'pierrondi@gmail.com',
      },
      scanRunner: async () => ({ exitCode: 0, stdout: 'New offers added: 2', stderr: '' }),
      emailSender: async (message) => {
        sent.push(message);
        return { sent: true };
      },
    });
    assert.equal(result.status, 'success');
    assert.equal(sent.length, 1);
    const report = readFileSync(result.reportPath, 'utf-8');
    assert.match(report, /Daily Opportunity Monitor/);
    assert.match(report, /ServiceNow/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

let failures = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`ok - ${name}`);
  } catch (err) {
    failures++;
    console.error(`not ok - ${name}`);
    console.error(err.stack || err.message);
  }
}

if (failures > 0) {
  console.error(`\n${failures} app test(s) failed`);
  process.exit(1);
}

console.log(`\n${tests.length} app tests passed`);
