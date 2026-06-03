// @ts-check
/** @typedef {import('./_types.js').Provider} Provider */

function resolveCompany(entry) {
  const url = entry.careers_url || '';
  const match = url.match(/careers\.smartrecruiters\.com\/([^/?#]+)/i)
    || url.match(/jobs\.smartrecruiters\.com\/([^/?#]+)/i);
  return entry.smartrecruiters_company || (match ? match[1] : null);
}

function resolveApiUrl(entry) {
  const company = resolveCompany(entry);
  if (!company) return null;
  const limit = Number(entry.smartrecruiters_limit || 100);
  return `https://api.smartrecruiters.com/v1/companies/${encodeURIComponent(company)}/postings?limit=${limit}&offset=0`;
}

function locationFor(job) {
  const loc = job.location || {};
  return loc.fullLocation || [loc.city, loc.region, loc.country].filter(Boolean).join(', ');
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

function publicJobUrl(entry, job) {
  const company = resolveCompany(entry);
  if (job.ref && /jobs\.smartrecruiters\.com/i.test(job.ref)) return job.ref;
  const id = job.id || String(job.ref || '').match(/postings\/([^/?#]+)/)?.[1];
  if (!company || !id) return job.ref || '';
  const slug = slugify(job.name);
  return `https://jobs.smartrecruiters.com/${company}/${id}${slug ? `-${slug}` : ''}`;
}

/** @type {Provider} */
export default {
  id: 'smartrecruiters',

  detect(entry) {
    const apiUrl = resolveApiUrl(entry);
    return apiUrl ? { url: apiUrl } : null;
  },

  async fetch(entry, ctx) {
    const apiUrl = resolveApiUrl(entry);
    if (!apiUrl) throw new Error(`smartrecruiters: cannot derive API URL for ${entry.name}`);
    const json = await ctx.fetchJson(apiUrl, { redirect: 'error' });
    const jobs = Array.isArray(json?.content) ? json.content : [];
    return jobs.map(job => ({
      title: job.name || '',
      url: publicJobUrl(entry, job),
      company: entry.name,
      location: locationFor(job),
    })).filter(job => job.title && job.url);
  },
};
