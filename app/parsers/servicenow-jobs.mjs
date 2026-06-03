#!/usr/bin/env node

import { pathToFileURL } from 'node:url';

const DEFAULT_URL = 'https://careers.smartrecruiters.com/ServiceNow?search=AI';

function stripTags(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;|&ndash;/g, '-')
    .replace(/&#8212;|&mdash;/g, '-')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTitle(value) {
  return stripTags(value)
    .replace(/\s+-\s+ServiceNow\s*$/i, '')
    .replace(/\s+\|\s+ServiceNow\s*$/i, '')
    .trim();
}

function titleFromAnchor(innerHtml) {
  const heading = String(innerHtml || '').match(/<h[1-4]\b[^>]*>([\s\S]*?)<\/h[1-4]>/i);
  return cleanTitle(heading ? heading[1] : innerHtml);
}

export function parseServiceNowJobs(html, baseUrl = DEFAULT_URL) {
  const jobs = [];
  const seen = new Set();
  const anchorPattern = /<a\b[^>]*href=["']([^"']*(?:careers\.servicenow\.com\/jobs|jobs\.smartrecruiters\.com\/ServiceNow|\/jobs\/)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchorPattern.exec(String(html || ''))) !== null) {
    let url;
    try {
      url = new URL(match[1], baseUrl).href;
    } catch {
      continue;
    }
    const title = titleFromAnchor(match[2]);
    if (!title || title.length < 4 || seen.has(url)) continue;
    seen.add(url);
    jobs.push({
      title,
      url,
      company: 'ServiceNow',
      location: '',
    });
  }
  return jobs;
}

async function fetchSmartRecruitersJobs() {
  const url = 'https://api.smartrecruiters.com/v1/companies/ServiceNow/postings?limit=100&offset=0';
  const res = await fetch(url, { headers: { 'user-agent': 'career-ops/1.8 ServiceNow parser' } });
  if (!res.ok) throw new Error(`SmartRecruiters API returned HTTP ${res.status}`);
  const json = await res.json();
  const jobs = Array.isArray(json?.content) ? json.content : [];
  return jobs.map(job => ({
    title: job.name || '',
    url: `https://jobs.smartrecruiters.com/ServiceNow/${job.id}-${String(job.name || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90)}`,
    company: 'ServiceNow',
    location: job.location?.fullLocation || [job.location?.city, job.location?.country].filter(Boolean).join(', '),
  })).filter(job => job.title && job.url);
}

async function main() {
  const jobs = await fetchSmartRecruitersJobs();
  process.stdout.write(JSON.stringify(jobs, null, 2));
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main().catch(err => {
    console.error(err.message);
    process.exit(1);
  });
}
