#!/usr/bin/env node
/**
 * approval-queue.mjs — 1-click approval queue for prepared applications.
 *
 * The automation prepares an application end-to-end (CV, form answers,
 * challenge solving via solver-client.mjs) and parks it here. Paulo reviews
 * the queue and approves with ONE command; the submit flow may only proceed
 * for entries in state `approved`. This is the executable half of the
 * ethical gate in AGENTS.md ("NEVER submit without explicit user
 * authorization"): approval is recorded, auditable, and cheap.
 *
 * Store: data/pending-approvals.json (user layer, created on first add).
 * Writes are atomic (tmp + rename) and validated against a small state set.
 *
 * Commands:
 *   node approval-queue.mjs add --company X --role Y --url Z [--portal P]
 *       [--score 4.5] [--artifacts a.pdf,b.md] [--notes "text"]
 *   node approval-queue.mjs list [--status pending|approved|rejected|submitted]
 *   node approval-queue.mjs show <id>
 *   node approval-queue.mjs approve <id> [--note "text"]
 *   node approval-queue.mjs reject <id> [--note "text"]
 *   node approval-queue.mjs mark-submitted <id> [--note "text"]
 *   Add --json to list/show for machine output (default is JSON anyway).
 */

import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const STORE = join(ROOT, 'data', 'pending-approvals.json');

export const STATES = new Set(['pending', 'approved', 'rejected', 'submitted']);

// ---------- store helpers (exported for tests) ----------

export function loadStore(path = STORE) {
  if (!existsSync(path)) return { version: 1, entries: [] };
  const data = JSON.parse(readFileSync(path, 'utf8'));
  if (!Array.isArray(data.entries)) throw new Error('corrupt store: entries missing');
  return data;
}

export function saveStore(store, path = STORE) {
  mkdirSync(dirname(path), { recursive: true });
  const tmp = `${path}.tmp-${process.pid}`;
  writeFileSync(tmp, JSON.stringify(store, null, 2) + '\n');
  renameSync(tmp, path);
}

export function nextId(store) {
  const max = store.entries.reduce((acc, e) => {
    const m = /^AQ-(\d+)$/.exec(e.id);
    return m ? Math.max(acc, Number(m[1])) : acc;
  }, 0);
  return `AQ-${String(max + 1).padStart(3, '0')}`;
}

export function addEntry(store, { company, role, url, portal = '', score = null, artifacts = [], notes = '' }, now = new Date()) {
  if (!company) throw new Error('company is required');
  if (!role) throw new Error('role is required');
  if (!url) throw new Error('url is required');
  const entry = {
    id: nextId(store),
    date: now.toISOString().slice(0, 10),
    company,
    role,
    url,
    portal,
    score,
    artifacts,
    notes,
    status: 'pending',
    history: [{ at: now.toISOString(), to: 'pending' }],
  };
  store.entries.push(entry);
  return entry;
}

export function transition(store, id, to, note = '', now = new Date()) {
  if (!STATES.has(to)) throw new Error(`invalid state: ${to}`);
  const entry = store.entries.find((e) => e.id === id);
  if (!entry) throw new Error(`entry not found: ${id}`);
  const allowed = {
    pending: new Set(['approved', 'rejected']),
    approved: new Set(['submitted', 'rejected']),
    rejected: new Set(['pending']),
    submitted: new Set(),
  };
  if (!allowed[entry.status].has(to)) {
    throw new Error(`cannot move ${id} from ${entry.status} to ${to}`);
  }
  entry.status = to;
  entry.history.push({ at: now.toISOString(), to, ...(note ? { note } : {}) });
  if (note) entry.notes = entry.notes ? `${entry.notes} | ${note}` : note;
  return entry;
}

// ---------- CLI ----------

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      if (key === 'json') args.json = true;
      else args[key] = argv[++i];
    } else args._.push(a);
  }
  return args;
}

function render(entry) {
  const score = entry.score == null ? '—' : `${entry.score}/5`;
  return `${entry.id}  [${entry.status}] ${entry.company} — ${entry.role} (${score}) ${entry.url}`;
}

function main(argv) {
  const args = parseArgs(argv);
  const cmd = args._[0];
  const store = loadStore();

  switch (cmd) {
    case 'add': {
      const entry = addEntry(store, {
        company: args.company,
        role: args.role,
        url: args.url,
        portal: args.portal || '',
        score: args.score != null ? Number(args.score) : null,
        artifacts: args.artifacts ? args.artifacts.split(',').map((s) => s.trim()).filter(Boolean) : [],
        notes: args.notes || '',
      });
      saveStore(store);
      console.log(JSON.stringify(entry, null, 2));
      return 0;
    }
    case 'list': {
      const status = args.status;
      if (status && !STATES.has(status)) throw new Error(`invalid state: ${status}`);
      const entries = store.entries.filter((e) => !status || e.status === status);
      console.log(JSON.stringify(entries.map((e) => ({ ...e, render: render(e) })), null, 2));
      return 0;
    }
    case 'show': {
      const entry = store.entries.find((e) => e.id === args._[1]);
      if (!entry) throw new Error(`entry not found: ${args._[1]}`);
      console.log(JSON.stringify(entry, null, 2));
      return 0;
    }
    case 'approve':
    case 'reject':
    case 'mark-submitted': {
      const to = cmd === 'approve' ? 'approved' : cmd === 'reject' ? 'rejected' : 'submitted';
      const entry = transition(store, args._[1], to, args.note || '');
      saveStore(store);
      console.log(JSON.stringify(entry, null, 2));
      return 0;
    }
    default:
      console.error('usage: node approval-queue.mjs add|list|show|approve|reject|mark-submitted ...');
      return 1;
  }
}

function samePath(a, b) {
  try {
    return realpathSync(a) === realpathSync(b);
  } catch {
    return a === b;
  }
}

const isMain = process.argv[1] && samePath(fileURLToPath(import.meta.url), process.argv[1]);
if (isMain) {
  try {
    process.exit(main(process.argv.slice(2)));
  } catch (err) {
    console.error(`approval-queue: ${err.message}`);
    process.exit(1);
  }
}
