// @ts-check
/**
 * geo-seo-audit.mjs — zero-LLM, low-token GEO+SEO readiness auditor.
 *
 * career-ops growth engine. Scores how retrievable / cite-able a target is by
 * generative answer engines (ChatGPT Search, Perplexity, Google AI Overviews,
 * Claude) AND by classic search — because in this engine **SEO is never scored
 * without GEO**. GEO is the 63-point majority; SEO is the 37-point remainder.
 *
 * METHOD (from Paulo's GEO playbook): curl the SERVED production artifacts, not
 * the repo. Reference standard = AgentCore (agenticoscore.ai), the 100-pt anchor.
 * The metric that matters downstream is CITATION RATE, not ranking — this script
 * scores the *technical + structural* preconditions for being cited.
 *
 * Deterministic and side-effect-free except for the 3 report files it writes:
 *   reports/growth/geo-seo-audit-{host}-{date}.md   (human)
 *   reports/growth/geo-seo-audit-{host}-{date}.json (machine == .brain/geo-seo/{host}.json)
 *   .brain/geo-seo-audit-latest.json                (stable path for n8n/dashboards)
 *
 * CONSERVATIVE + SAFE: https-only, refuses localhost/private hosts and embedded
 * credentials (this runs unattended under n8n against configured public targets).
 * A missing artifact scores 0 for that signal; it never crashes the run.
 *
 * Usage:
 *   node geo-seo-audit.mjs https://agenticoscore.ai
 *   node geo-seo-audit.mjs agenticoscore.ai --json
 *   node geo-seo-audit.mjs --all            # audit every target in config/growth-targets.yml
 *   node geo-seo-audit.mjs --self-test      # pure-function assertions, no network
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TIMEOUT_MS = 12_000;
const FRESH_DAYS = 90;

/** AI crawlers/answer-engine bots that a GEO-ready robots.txt names explicitly. */
const AI_BOTS = new Set(
  [
    'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot',
    'Claude-User', 'PerplexityBot', 'Perplexity-User', 'Google-Extended',
    'Applebot-Extended', 'CCBot', 'Bytespider', 'Amazonbot',
    'Meta-ExternalAgent', 'cohere-ai', 'anthropic-ai',
  ].map((b) => b.toLowerCase()),
);

/** Search/user-fetch bots that must NOT be blocked (a false block hides the site from answer engines). */
const SEARCH_BOTS = [
  'oai-searchbot', 'chatgpt-user', 'perplexitybot', 'perplexity-user',
  'claude-searchbot', 'claude-user',
];

/** Organization-family @types — any of these + WebSite (or Person + WebSite) is a valid primary entity graph. */
const ORG_LIKE = new Set([
  'Organization', 'EducationalOrganization', 'LocalBusiness', 'Corporation',
  'NGO', 'GovernmentOrganization', 'NewsMediaOrganization', 'OnlineBusiness',
  'ProfessionalService', 'Consortium', 'MedicalOrganization', 'Airline', 'SoftwareApplication',
]);
/** @param {string} t */
const isOrgLike = (t) => ORG_LIKE.has(t) || /Organization$/.test(t);

/** JSON-LD @types that count toward a "rich" graph (from the AgentCore reference). */
const RICH_TYPES = new Set([
  'Organization', 'WebSite', 'SoftwareApplication', 'FAQPage', 'Service',
  'OfferCatalog', 'Person', 'VideoObject', 'ContactPoint', 'BreadcrumbList',
  'Article', 'BlogPosting', 'HowTo', 'AggregateRating', 'Offer', 'ImageObject',
  'PriceSpecification', 'Audience',
]);

// ---------------------------------------------------------------------------
// Fetch layer
// ---------------------------------------------------------------------------

/**
 * Normalize a bare host or URL into a safe https origin, or throw.
 * @param {string} raw
 * @returns {URL}
 */
export function toSafeOrigin(raw) {
  const s = String(raw || '').trim();
  const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
  if (u.protocol !== 'https:') throw new Error(`refusing non-https target: ${u.protocol}`);
  if (u.username || u.password) throw new Error('refusing target with embedded credentials');
  const h = u.hostname.toLowerCase();
  const blocked =
    h === 'localhost' || h.endsWith('.local') || h.endsWith('.internal') ||
    /^(127\.|10\.|169\.254\.|192\.168\.|::1$|fe80:)/.test(h) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(h);
  if (blocked) throw new Error(`refusing private/loopback host: ${h}`);
  return new URL(`https://${u.hostname}${u.pathname === '/' ? '' : u.pathname}`);
}

/**
 * GET a URL following redirects, with a timeout. Never throws — returns a result
 * object with `ok:false` on any failure so a single 404 can't abort the audit.
 * @param {string} url
 * @returns {Promise<{ok:boolean,status:number,contentType:string,body:string,finalUrl:string,scheme:string,redirects:number,error?:string}>}
 */
export async function fetchArtifact(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  const base = { ok: false, status: 0, contentType: '', body: '', finalUrl: url, scheme: '', redirects: 0 };
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'user-agent': 'career-ops-geo-seo-audit/1.0 (+https://github.com/santifer/career-ops)' },
    });
    const body = await res.text();
    const finalUrl = res.url || url;
    return {
      ok: res.ok,
      status: res.status,
      contentType: res.headers.get('content-type') || '',
      body,
      finalUrl,
      scheme: new URL(finalUrl).protocol.replace(':', ''),
      redirects: finalUrl !== url ? 1 : 0,
    };
  } catch (err) {
    return { ...base, error: err instanceof Error ? err.message : String(err) };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch every artifact this audit needs. Resolves the CANONICAL host first: many
 * sites serve their GEO/SEO artifacts only on `www` (or only on the apex) and
 * redirect the homepage there — so we fetch the homepage, follow its redirect, and
 * fetch every other artifact on the host the site actually lands on. Auditing the
 * wrong host (e.g. the apex when files live on www) is a false-negative.
 * @param {URL} origin
 * @returns {Promise<{raw:Record<string,any>,canonicalHost:string,requestedHost:string}>}
 */
export async function gatherTarget(origin) {
  const home = await fetchArtifact(`https://${origin.hostname}/`);
  let canonicalHost = origin.hostname;
  try { if (home.finalUrl) canonicalHost = new URL(home.finalUrl).hostname; } catch { /* keep requested host */ }
  const base = `https://${canonicalHost}`;
  const paths = ['/llms.txt', '/llms-full.txt', '/geo.md', '/answers.json', '/robots.txt', '/sitemap.xml'];
  const entries = await Promise.all(paths.map(async (p) => [p, await fetchArtifact(base + p)]));
  const raw = Object.fromEntries(entries);
  raw['/'] = home;
  // FAQPage sometimes lives on /faq — fetch it only if the homepage lacks JSON-LD FAQPage.
  if (!/faqpage/i.test(home.body || '')) raw['/faq'] = await fetchArtifact(`${base}/faq`);
  return { raw, canonicalHost, requestedHost: origin.hostname };
}

// ---------------------------------------------------------------------------
// Pure parsers (unit-tested)
// ---------------------------------------------------------------------------

/**
 * Parse robots.txt into groups of {agents, rules}. Consecutive User-agent lines
 * share the rule block that follows them (standard robots grouping).
 * @param {string} text
 * @returns {{agents:string[],rules:{type:string,path:string}[]}[]}
 */
export function parseRobots(text) {
  const groups = [];
  let cur = null;
  let sawRule = false;
  for (const line of String(text || '').split(/\r?\n/)) {
    const clean = line.replace(/#.*$/, '').trim();
    if (!clean) continue;
    const m = clean.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === 'user-agent') {
      if (!cur || sawRule) { cur = { agents: [], rules: [] }; groups.push(cur); sawRule = false; }
      cur.agents.push(value.toLowerCase());
    } else if ((field === 'allow' || field === 'disallow') && cur) {
      cur.rules.push({ type: field, path: value });
      sawRule = true;
    }
  }
  return groups;
}

/**
 * Count DISTINCT explicit AI-bot User-agent stanzas (ignoring `*`).
 * @param {{agents:string[]}[]} groups
 * @returns {{count:number,matched:string[]}}
 */
export function countAiBotStanzas(groups) {
  const matched = new Set();
  for (const g of groups) for (const a of g.agents) if (AI_BOTS.has(a)) matched.add(a);
  return { count: matched.size, matched: [...matched] };
}

/**
 * Are answer-engine search/user bots allowed (not blanket-disallowed)?
 * @param {{agents:string[],rules:{type:string,path:string}[]}[]} groups
 * @returns {boolean}
 */
export function robotsSearchAllowed(groups) {
  const blocked = (agent) => {
    const g = groups.find((x) => x.agents.includes(agent));
    if (!g) return false;
    const disallowAll = g.rules.some((r) => r.type === 'disallow' && r.path === '/');
    const allowAll = g.rules.some((r) => r.type === 'allow' && r.path === '/');
    return disallowAll && !allowAll;
  };
  if (SEARCH_BOTS.some(blocked)) return false;
  return !blocked('*');
}

/**
 * Extract the set of JSON-LD @type strings present in HTML (walks @graph).
 * @param {string} html
 * @returns {string[]}
 */
export function extractJsonLdTypes(html) {
  const types = new Set();
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    try {
      collectTypes(JSON.parse(m[1].trim()), types);
    } catch { /* malformed block — skip, don't crash the audit */ }
  }
  return [...types];
}

/**
 * @param {any} node
 * @param {Set<string>} out
 */
function collectTypes(node, out) {
  if (Array.isArray(node)) { for (const n of node) collectTypes(n, out); return; }
  if (!node || typeof node !== 'object') return;
  const t = node['@type'];
  if (typeof t === 'string') out.add(t);
  else if (Array.isArray(t)) for (const x of t) if (typeof x === 'string') out.add(x);
  if (Array.isArray(node['@graph'])) collectTypes(node['@graph'], out);
}

/**
 * Parse the SEO surface tags from homepage HTML.
 * @param {string} html
 */
export function parseSeoTags(html) {
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
  const meta = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)?.[1]?.trim() || '';
  const canonical = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1] || '';
  const og = ['og:title', 'og:description', 'og:image', 'og:url'].filter((p) =>
    new RegExp(`<meta[^>]*property=["']${p}["']`, 'i').test(html));
  const twitter = /<meta[^>]*name=["']twitter:card["']/i.test(html);
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  return { title, meta, canonical, og, twitter, h1 };
}

/**
 * Word count of the first paragraph inside the first <main>/<article>.
 * @param {string} html
 * @returns {number}
 */
export function firstParagraphWords(html) {
  const scope = html.match(/<(main|article)[^>]*>([\s\S]*?)<\/\1>/i)?.[2] || html;
  const p = scope.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
  const text = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

/**
 * llms.txt is well-formed: H1 + blockquote + >=1 annotated link.
 * @param {string} body
 */
export function llmsStructured(body) {
  const lines = String(body || '').split(/\r?\n/);
  const h1 = lines.some((l) => /^#\s+\S/.test(l));
  const quote = lines.some((l) => /^>\s+\S/.test(l));
  const link = lines.some((l) => /^-\s+\[.+\]\(https?:\/\/.+\):\s+\S/.test(l));
  return { h1, quote, link, ok: h1 && quote && link };
}

/**
 * Newest <lastmod> in a sitemap and its age in days.
 * @param {string} xml
 * @param {Date} now
 */
export function sitemapFreshness(xml, now) {
  const dates = [...String(xml || '').matchAll(/<lastmod>\s*([0-9T:+\-.Z]+)\s*<\/lastmod>/gi)]
    .map((m) => new Date(m[1])).filter((d) => !Number.isNaN(d.getTime()));
  if (!dates.length) return { newest: null, days: null };
  const newest = new Date(Math.max(...dates.map((d) => d.getTime())));
  const days = Math.floor((now.getTime() - newest.getTime()) / 86_400_000);
  return { newest: newest.toISOString().slice(0, 10), days };
}

// ---------------------------------------------------------------------------
// Derive a parsed view from raw fetches
// ---------------------------------------------------------------------------

/**
 * @param {Record<string,any>} raw
 * @param {Date} now
 */
export function deriveScorecard(raw, now) {
  const home = raw['/'];
  const html = home.body || '';
  const robotsText = raw['/robots.txt'].body || '';
  const robotGroups = parseRobots(robotsText);
  const aiStanzas = countAiBotStanzas(robotGroups);
  const jsonldHtml = /faqpage/i.test(html) || !raw['/faq'] ? html : html + (raw['/faq'].body || '');
  const types = extractJsonLdTypes(jsonldHtml);
  const distinct = types.filter((t) => RICH_TYPES.has(t));
  const sitemapXml = raw['/sitemap.xml'];
  const locCount = (sitemapXml.body.match(/<loc>/gi) || []).length;
  const fresh = sitemapFreshness(sitemapXml.body, now);
  const answers = parseAnswersJson(raw['/answers.json']);
  const seo = parseSeoTags(html);
  const firstWords = firstParagraphWords(html);
  return {
    http: { finalStatus: home.status, finalUrl: home.finalUrl, scheme: home.scheme, redirects: home.redirects },
    llms: { present: raw['/llms.txt'].status === 200, status: raw['/llms.txt'].status, contentType: raw['/llms.txt'].contentType, ...llmsStructured(raw['/llms.txt'].body) },
    llmsFull: { present: raw['/llms-full.txt'].status === 200, biggerThanLlms: (raw['/llms-full.txt'].body.length || 0) > (raw['/llms.txt'].body.length || 0) },
    geoMd: { present: raw['/geo.md'].status === 200 && (raw['/geo.md'].body || '').length > 200 },
    answersJson: answers,
    robots: {
      present: raw['/robots.txt'].status === 200 && robotsText.trim().length > 0,
      groups: robotGroups,
      aiStanzas,
      searchAllowed: robotsSearchAllowed(robotGroups),
      hasSitemapDirective: /^sitemap:\s+https?:\/\/\S+/im.test(robotsText),
    },
    jsonld: buildJsonldView(jsonldHtml, types, distinct.length),
    sitemap: { present: sitemapXml.status === 200 && (/<loc>/i.test(sitemapXml.body) || /<sitemapindex/i.test(sitemapXml.body)), locCount, newestLastmod: fresh.newest, freshDays: fresh.days },
    answerFirst: { firstParagraphWords: firstWords, pass: (firstWords >= 40 && firstWords <= 75) || (answers.present && answers.firstAnswerWords >= 40 && answers.firstAnswerWords <= 75) },
    seo,
  };
}

/**
 * Build the JSON-LD view: presence, rich-type count, and whether a primary entity
 * graph exists — WebSite + (an Organization-family type OR Person). Person counts so
 * personal-brand sites (the brand-first default) qualify like company sites do.
 * @param {string} html
 * @param {string[]} types
 * @param {number} distinctMatches
 */
export function buildJsonldView(html, types, distinctMatches) {
  const hasWebsite = types.includes('WebSite');
  const hasOrgLike = types.some(isOrgLike);
  const hasPerson = types.includes('Person');
  const hasEntity = hasOrgLike || hasPerson;
  return {
    present: /<script[^>]*type=["']application\/ld\+json["']/i.test(html),
    types, distinctMatches,
    hasPrimaryEntity: hasWebsite && hasEntity,
    hasOneOfEntityWebsite: hasWebsite || hasEntity,
    hasFaqPage: types.includes('FAQPage'),
  };
}

/**
 * @param {{status:number,body:string}} res
 */
export function parseAnswersJson(res) {
  if (res.status !== 200) return { present: false, valid: false, firstAnswerWords: 0 };
  try {
    const j = JSON.parse(res.body);
    const CONTAINERS = ['answers', 'answerDocs', 'qa', 'qaPairs', 'faqs', 'questions', 'items'];
    const arr = Array.isArray(j) ? j : CONTAINERS.map((k) => j[k]).find(Array.isArray) || [];
    const it = arr[0] || {};
    const first = it.answer || it.a || it.text || it.body || it.response || '';
    const words = String(first).trim() ? String(first).trim().split(/\s+/).length : 0;
    return { present: arr.length > 0, valid: true, firstAnswerWords: words };
  } catch {
    return { present: false, valid: false, firstAnswerWords: 0 };
  }
}

// ---------------------------------------------------------------------------
// Signal table (table-driven keeps each scorer tiny)
// ---------------------------------------------------------------------------

/** @typedef {{status:'pass'|'partial'|'fail',points:number,evidence:string}} SignalResult */

const PASS = (pts, evidence) => ({ status: 'pass', points: pts, evidence });
const PART = (pts, evidence) => ({ status: 'partial', points: pts, evidence });
const FAIL = (evidence) => ({ status: 'fail', points: 0, evidence });

/** @type {{id:string,layer:'geo'|'seo',weight:number,ref:string,fn:(s:any)=>SignalResult}[]} */
export const SIGNALS = [
  // ---- GEO layer (63) ----
  { id: 'llms_txt', layer: 'geo', weight: 12, ref: '02 sec.2', fn: (s) => !s.llms.present ? FAIL(`HTTP ${s.llms.status}`) : s.llms.ok ? PASS(12, `200 ${s.llms.contentType}; H1+quote+links`) : PART(6, `200 but missing ${[!s.llms.h1 && 'H1', !s.llms.quote && 'blockquote', !s.llms.link && 'annotated link'].filter(Boolean).join('/')}`) },
  { id: 'llms_full_txt', layer: 'geo', weight: 4, ref: '02 sec.2', fn: (s) => s.llmsFull.present && s.llmsFull.biggerThanLlms ? PASS(4, 'served, larger than llms.txt') : s.llmsFull.present ? PART(2, 'served but not larger than llms.txt') : FAIL('404') },
  { id: 'geo_md', layer: 'geo', weight: 3, ref: '02 sec.2 (AgentCore ext)', fn: (s) => s.geoMd.present ? PASS(3, 'served, >200 bytes') : FAIL('404 / empty') },
  { id: 'answers_json', layer: 'geo', weight: 4, ref: '02 sec.2 (AgentCore ext)', fn: (s) => s.answersJson.present ? PASS(4, `valid JSON, ${s.answersJson.firstAnswerWords}w first answer`) : FAIL('404 / invalid / empty') },
  { id: 'robots_present', layer: 'geo', weight: 3, ref: '02 sec.3', fn: (s) => s.robots.present ? PASS(3, 'robots.txt served') : FAIL('404 / empty') },
  { id: 'robots_ai_bot_stanzas', layer: 'geo', weight: 10, ref: '02 sec.9.3', fn: (s) => s.robots.aiStanzas.count === 0 ? FAIL('uses only `*` (0 explicit AI stanzas)') : { status: s.robots.aiStanzas.count >= 5 ? 'pass' : 'partial', points: Math.min(10, s.robots.aiStanzas.count * 2), evidence: `${s.robots.aiStanzas.count} stanzas: ${s.robots.aiStanzas.matched.join(', ')}` } },
  { id: 'robots_ai_search_allowed', layer: 'geo', weight: 4, ref: '02 sec.9.3', fn: (s) => !s.robots.present ? FAIL('no robots.txt') : s.robots.searchAllowed ? PASS(4, 'answer-engine bots not blocked') : FAIL('a search/user bot is Disallow: / — hides site from answer engines') },
  { id: 'jsonld_present', layer: 'geo', weight: 4, ref: '02 sec.4', fn: (s) => s.jsonld.present ? PASS(4, `${s.jsonld.types.length} @type total`) : FAIL('no ld+json block') },
  { id: 'jsonld_richness', layer: 'geo', weight: 7, ref: '02 sec.4', fn: (s) => s.jsonld.distinctMatches >= 6 ? PASS(7, `${s.jsonld.distinctMatches} rich types`) : s.jsonld.distinctMatches > 0 ? PART(Math.round((s.jsonld.distinctMatches / 6) * 7), `${s.jsonld.distinctMatches} rich types`) : FAIL('0 rich types') },
  { id: 'jsonld_core_entity', layer: 'geo', weight: 4, ref: '02 sec.4', fn: (s) => s.jsonld.hasPrimaryEntity ? PASS(4, 'WebSite + Organization/Person entity') : s.jsonld.hasOneOfEntityWebsite ? PART(2, 'only one of WebSite / (Organization|Person)') : FAIL('no WebSite + entity graph') },
  { id: 'jsonld_faqpage', layer: 'geo', weight: 4, ref: '03 (FAQ)', fn: (s) => s.jsonld.hasFaqPage ? PASS(4, 'FAQPage present') : FAIL('no FAQPage') },
  { id: 'answer_first_block', layer: 'geo', weight: 4, ref: '03 (answer-first 40-75w)', fn: (s) => s.answerFirst.pass ? PASS(4, `${s.answerFirst.firstParagraphWords}w first paragraph`) : FAIL(`first paragraph ${s.answerFirst.firstParagraphWords}w (want 40-75)`) },
  // ---- SEO layer (37) ----
  { id: 'http_https_200', layer: 'seo', weight: 3, ref: 'SEO', fn: (s) => s.http.finalStatus === 200 && s.http.scheme === 'https' ? PASS(3, `200 https, ${s.http.redirects} hop(s)`) : FAIL(`${s.http.finalStatus} ${s.http.scheme}`) },
  { id: 'title_tag', layer: 'seo', weight: 4, ref: 'SEO', fn: (s) => s.seo.title && s.seo.title.length >= 15 && s.seo.title.length <= 65 ? PASS(4, `${s.seo.title.length} chars`) : s.seo.title ? PART(2, `${s.seo.title.length} chars (want 15-65)`) : FAIL('no <title>') },
  { id: 'meta_description', layer: 'seo', weight: 4, ref: 'SEO', fn: (s) => s.seo.meta && s.seo.meta.length >= 50 && s.seo.meta.length <= 160 ? PASS(4, `${s.seo.meta.length} chars`) : s.seo.meta ? PART(2, `${s.seo.meta.length} chars (want 50-160)`) : FAIL('no meta description') },
  { id: 'canonical', layer: 'seo', weight: 4, ref: 'SEO', fn: (s) => /^https:\/\//i.test(s.seo.canonical) ? PASS(4, s.seo.canonical) : FAIL('no absolute https canonical') },
  { id: 'open_graph', layer: 'seo', weight: 5, ref: 'SEO', fn: (s) => s.seo.og.length === 4 ? PASS(5, 'og:title/description/image/url') : s.seo.og.length > 0 ? PART(Math.round((s.seo.og.length / 4) * 5), s.seo.og.join(',')) : FAIL('no Open Graph') },
  { id: 'twitter_card', layer: 'seo', weight: 2, ref: 'SEO', fn: (s) => s.seo.twitter ? PASS(2, 'twitter:card') : FAIL('no twitter:card') },
  { id: 'h1_single', layer: 'seo', weight: 4, ref: 'SEO', fn: (s) => s.seo.h1 === 1 ? PASS(4, 'exactly 1 <h1>') : FAIL(`${s.seo.h1} <h1> (want 1)`) },
  { id: 'sitemap_xml', layer: 'seo', weight: 6, ref: 'SEO', fn: (s) => s.sitemap.present ? PASS(6, `${s.sitemap.locCount} <loc>`) : FAIL('no sitemap.xml') },
  { id: 'robots_sitemap_directive', layer: 'seo', weight: 2, ref: 'SEO', fn: (s) => s.robots.hasSitemapDirective ? PASS(2, 'Sitemap: directive') : FAIL('no Sitemap: directive') },
  { id: 'sitemap_lastmod_freshness', layer: 'seo', weight: 3, ref: 'SEO', fn: (s) => s.sitemap.freshDays == null ? FAIL('no <lastmod>') : s.sitemap.freshDays <= FRESH_DAYS ? PASS(3, `newest ${s.sitemap.newestLastmod} (${s.sitemap.freshDays}d)`) : FAIL(`stale: newest ${s.sitemap.newestLastmod} (${s.sitemap.freshDays}d > ${FRESH_DAYS})`) },
];

const TIER_ORDER = ['MISSING', 'PARTIAL', 'GOOD', 'MATURE', 'BEST'];

/**
 * Tier = score band, then monotonic gate CAPS ("you can't claim tier T without X").
 * A gate can only lower the tier, never below the score band's own floor logic — so an
 * 83-point site missing one gate lands at GOOD, never at PARTIAL.
 * @param {number} pct
 * @param {any} sc
 * @returns {'BEST'|'MATURE'|'GOOD'|'PARTIAL'|'MISSING'}
 */
export function tierFor(pct, sc) {
  if (!sc.llms.present && !sc.jsonld.present) return 'MISSING'; // no GEO substrate at all
  const cap = (t, c) => (TIER_ORDER.indexOf(t) <= TIER_ORDER.indexOf(c) ? t : c);
  let tier = pct >= 90 ? 'BEST' : pct >= 75 ? 'MATURE' : pct >= 55 ? 'GOOD' : pct >= 35 ? 'PARTIAL' : 'MISSING';
  if (!(sc.llms.ok && sc.robots.aiStanzas.count >= 5 && sc.jsonld.distinctMatches >= 6)) tier = cap(tier, 'MATURE');
  if (!(sc.llms.present && sc.jsonld.hasPrimaryEntity && sc.robots.present)) tier = cap(tier, 'GOOD');
  if (!(sc.llms.present || sc.jsonld.distinctMatches >= 3)) tier = cap(tier, 'PARTIAL');
  return tier;
}

/**
 * Score a derived scorecard into the full audit record.
 * @param {string} host
 * @param {any} sc
 * @param {Date} now
 */
export function scoreTarget(host, sc, now) {
  const signals = SIGNALS.map((def) => {
    const r = def.fn(sc);
    return { id: def.id, layer: def.layer, weight: def.weight, ref: def.ref, ...r };
  });
  const sum = (layer) => signals.filter((s) => s.layer === layer).reduce((a, s) => a + s.points, 0);
  const geoEarned = sum('geo');
  const seoEarned = sum('seo');
  const earned = geoEarned + seoEarned;
  const tier = tierFor(earned, sc);
  const gaps = signals.filter((s) => s.status !== 'pass').map((s) => ({ signal: s.id, detail: s.evidence, playbookRef: s.ref }));
  return {
    type: 'geo_seo_audit', schemaVersion: 1, target: `https://${host}/`, host,
    checkedAt: now.toISOString(), referenceStandard: 'agenticoscore.ai',
    tier, score: { earned, max: 100, pct: earned, geoEarned, geoMax: 63, seoEarned, seoMax: 37 },
    http: sc.http,
    scorecard: {
      llms_txt: { present: sc.llms.present, structured: sc.llms.ok, httpStatus: sc.llms.status },
      llms_full_txt: sc.llmsFull, geo_md: sc.geoMd, answers_json: sc.answersJson,
      robots: { present: sc.robots.present, hasSitemapDirective: sc.robots.hasSitemapDirective },
      aiBotStanzas: { count: sc.robots.aiStanzas.count, matched: sc.robots.aiStanzas.matched, searchBotsAllowed: sc.robots.searchAllowed },
      jsonld: { present: sc.jsonld.present, types: sc.jsonld.types, distinctMatches: sc.jsonld.distinctMatches, hasPrimaryEntity: sc.jsonld.hasPrimaryEntity, hasFaqPage: sc.jsonld.hasFaqPage },
      sitemap: sc.sitemap, answerFirst: sc.answerFirst,
    },
    seo: sc.seo,
    signals, gaps,
  };
}

// ---------------------------------------------------------------------------
// Rendering + IO
// ---------------------------------------------------------------------------

const CHK = (r) => (r.status === 'pass' ? '✅' : r.status === 'partial' ? '🟡' : '❌');

/**
 * @param {any} rec
 */
export function buildMarkdown(rec) {
  const date = rec.checkedAt.slice(0, 10);
  const llms = rec.scorecard.llms_txt;
  const badges = [llms.present && (llms.structured ? '✅' : '🟡'), rec.scorecard.llms_full_txt.present && '+full', rec.scorecard.geo_md.present && '+geo.md', rec.scorecard.answers_json.present && '+answers.json'].filter(Boolean).join(' ') || '❌';
  const jsonldCell = rec.scorecard.jsonld.types.length ? rec.scorecard.jsonld.types.join(', ') : 'NONE';
  const stanzaCell = rec.scorecard.aiBotStanzas.count ? `✅ ${rec.scorecard.aiBotStanzas.count} stanzas` : '❌ uses `*`';
  const rows = rec.signals.map((s, i) => `| ${i + 1} | ${s.id} | ${CHK(s)} ${s.status} | ${s.points} | ${s.weight} | ${s.evidence} |`).join('\n');
  const gapRows = rec.gaps.map((g) => `- [ ] **${g.signal}**: ${g.detail} → playbook ${g.playbookRef}`).join('\n') || '- none — reference-grade.';
  return `---
type: geo_seo_audit
target: ${rec.target}
host: ${rec.host}
date: ${date}
checkedAt: ${rec.checkedAt}
reference_standard: agenticoscore.ai
tier: ${rec.tier}
score_pct: ${rec.score.pct}
---

# GEO+SEO Audit — ${rec.host} (${date})

Served-artifact verification (curl in production, not the repo). **SEO is never scored without GEO.**
Reference standard: **AgentCore (agenticoscore.ai)**. Metric that matters downstream: **citation rate**, not ranking.

**Tier: ${rec.tier}**  |  **Score: ${rec.score.earned}/100**  |  GEO ${rec.score.geoEarned}/63 · SEO ${rec.score.seoEarned}/37  |  final ${rec.http.finalStatus} ${rec.http.scheme} (${rec.http.redirects} hop)

## Scorecard (mirrors GEO Portfolio Audit 2026-06-29)

| Site | llms.txt | sitemap | robots | AI-bot stanzas | JSON-LD | Status |
|---|---|---|---|---|---|---|
| ${rec.host} | ${badges} | ${rec.scorecard.sitemap.present ? '✅' : '❌'} | ${rec.scorecard.robots.present ? '✅' : '❌'} | ${stanzaCell} | ${jsonldCell} | **${rec.tier}** |

## Signal detail

| # | Signal | Result | Pts | Weight | Evidence |
|---|--------|--------|-----|--------|----------|
${rows}
| | **TOTAL** | | **${rec.score.earned}** | **100** | GEO ${rec.score.geoEarned}/63 · SEO ${rec.score.seoEarned}/37 |

## Gaps (ranked)

${gapRows}

## Verification commands (copy-paste)

\`\`\`bash
curl -sSL -I https://${rec.host}/llms.txt
curl -sSL https://${rec.host}/robots.txt | grep -Ei 'gptbot|claudebot|perplexitybot|oai-searchbot|google-extended|ccbot'
curl -sSL https://${rec.host}/ | grep -o 'application/ld+json'
\`\`\`

> answer_first_block is a heuristic (first-paragraph word count / answers.json). Blocking AI search/user bots is scored as a FAILURE.
`;
}

/**
 * @param {any} rec
 * @param {string} outDir
 */
export function writeReports(rec, outDir) {
  const date = rec.checkedAt.slice(0, 10);
  const slug = rec.host.replace(/\./g, '-');
  const growth = join(__dirname, outDir);
  const brain = join(__dirname, '.brain', 'geo-seo');
  mkdirSync(growth, { recursive: true });
  mkdirSync(brain, { recursive: true });
  const mdPath = join(growth, `geo-seo-audit-${slug}-${date}.md`);
  const jsonPath = join(growth, `geo-seo-audit-${slug}-${date}.json`);
  writeFileSync(mdPath, buildMarkdown(rec));
  writeFileSync(jsonPath, JSON.stringify(rec, null, 2));
  writeFileSync(join(brain, `${slug}.json`), JSON.stringify(rec, null, 2));
  writeFileSync(join(__dirname, '.brain', 'geo-seo-audit-latest.json'), JSON.stringify({ ...rec, latestFor: rec.host }, null, 2));
  return { mdPath, jsonPath };
}

/**
 * Audit one target end-to-end.
 * @param {string} target
 * @param {{outDir?:string,now?:Date}} [opts]
 */
export async function auditTarget(target, opts = {}) {
  const now = opts.now || new Date();
  const origin = toSafeOrigin(target);
  const { raw, canonicalHost, requestedHost } = await gatherTarget(origin);
  const sc = deriveScorecard(raw, now);
  const rec = scoreTarget(canonicalHost, sc, now);
  if (canonicalHost !== requestedHost) rec.requestedHost = requestedHost; // e.g. apex → www
  const paths = writeReports(rec, opts.outDir || 'reports/growth');
  return { rec, paths };
}

// ---------------------------------------------------------------------------
// Config + CLI
// ---------------------------------------------------------------------------

/**
 * Read target hosts from config/growth-targets.yml (tiny hand-parse; no yaml dep).
 * Accepts `- url: https://x` or `- host: x` list items under `targets:`.
 * @returns {string[]}
 */
export function readConfiguredTargets() {
  const p = join(__dirname, 'config', 'growth-targets.yml');
  if (!existsSync(p)) return [];
  const out = [];
  let inTargets = false;
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    if (/^targets:\s*$/.test(line)) { inTargets = true; continue; }
    if (inTargets && /^\S/.test(line)) inTargets = false;
    if (!inTargets) continue;
    const m = line.match(/^\s*-?\s*(?:url|host)\s*:\s*["']?([^"'#\s]+)/i);
    if (m) out.push(m[1]);
  }
  return out;
}

function runSelfTest() {
  const assert = (name, cond) => { if (!cond) { console.error(`FAIL: ${name}`); process.exitCode = 1; } else console.log(`ok: ${name}`); };
  const robots = 'User-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nDisallow:\n\nUser-agent: *\nDisallow: /private\nSitemap: https://x.com/sitemap.xml';
  const g = parseRobots(robots);
  assert('ai stanzas = 2', countAiBotStanzas(g).count === 2);
  assert('search allowed (no blanket disallow)', robotsSearchAllowed(g) === true);
  assert('blanket * disallow blocks', robotsSearchAllowed(parseRobots('User-agent: *\nDisallow: /')) === false);
  assert('perplexity blocked -> not allowed', robotsSearchAllowed(parseRobots('User-agent: PerplexityBot\nDisallow: /')) === false);
  assert('jsonld @graph types', extractJsonLdTypes('<script type="application/ld+json">{"@graph":[{"@type":"Organization"},{"@type":["WebSite","Thing"]}]}</script>').sort().join(',') === 'Organization,Thing,WebSite');
  assert('Person + WebSite is a primary entity', buildJsonldView('<script type="application/ld+json">x</script>', ['Person', 'WebSite'], 2).hasPrimaryEntity === true);
  assert('EducationalOrganization counts as org-like', buildJsonldView('<script>x</script>', ['EducationalOrganization', 'WebSite'], 2).hasPrimaryEntity === true);
  assert('WebSite alone is not a primary entity', buildJsonldView('<script>x</script>', ['WebSite'], 1).hasPrimaryEntity === false);
  assert('llms structured', llmsStructured('# Name\n\n> who and what\n\n- [Home](https://x.com/): desc').ok === true);
  assert('llms unstructured', llmsStructured('just text').ok === false);
  assert('first paragraph words', firstParagraphWords('<main><p>one two three four</p></main>') === 4);
  const seo = parseSeoTags('<title>Hello World Title Tag</title><meta name="description" content="d"><h1>x</h1>');
  assert('seo title parsed', seo.title === 'Hello World Title Tag' && seo.h1 === 1);
  assert('freshness parse', sitemapFreshness('<lastmod>2026-06-01</lastmod>', new Date('2026-06-30')).days === 29);
  const sc = deriveScorecard({ '/': { status: 200, body: '<title>t</title>', finalUrl: 'https://x.com/', scheme: 'https', redirects: 0 }, '/llms.txt': { status: 404, body: '' }, '/llms-full.txt': { status: 404, body: '' }, '/geo.md': { status: 404, body: '' }, '/answers.json': { status: 404, body: '' }, '/robots.txt': { status: 404, body: '' }, '/sitemap.xml': { status: 404, body: '' }, '/faq': { status: 404, body: '' } }, new Date());
  assert('empty site => MISSING', tierFor(scoreTarget('x.com', sc, new Date()).score.earned, sc) === 'MISSING');
  console.log(process.exitCode ? '\nself-test FAILED' : '\nself-test passed');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return runSelfTest();
  const asJson = args.includes('--json');
  const outDir = 'reports/growth';
  const positional = args.filter((a) => !a.startsWith('--'));
  let targets = positional;
  if (args.includes('--all') || positional.length === 0) targets = readConfiguredTargets();
  if (!targets.length) {
    console.error('usage: node geo-seo-audit.mjs <url> [--json] | --all | --self-test');
    console.error('(no url and no config/growth-targets.yml targets found)');
    process.exitCode = 1;
    return;
  }
  const results = [];
  for (const t of targets) {
    try {
      const { rec, paths } = await auditTarget(t, { outDir });
      results.push(rec);
      if (!asJson) console.error(`${rec.tier.padEnd(7)} ${String(rec.score.earned).padStart(3)}/100  GEO ${rec.score.geoEarned}/63 SEO ${rec.score.seoEarned}/37  ${rec.host}  → ${paths.mdPath.replace(__dirname + '/', '')}`);
    } catch (err) {
      console.error(`ERROR ${t}: ${err instanceof Error ? err.message : err}`);
      process.exitCode = 1;
    }
  }
  if (asJson) console.log(JSON.stringify(results.length === 1 ? results[0] : results, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) main();
