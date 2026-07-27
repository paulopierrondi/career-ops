import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  loadStore,
  saveStore,
  addEntry,
  transition,
  nextId,
} from '../approval-queue.mjs';

function tmpStore() {
  const dir = mkdtempSync(join(tmpdir(), 'aq-'));
  return join(dir, 'pending-approvals.json');
}

const base = { company: 'Anthropic', role: 'Solutions Engineer', url: 'https://example.com/jobs/1' };

test('addEntry assigns sequential ids and starts pending', () => {
  const store = { version: 1, entries: [] };
  const a = addEntry(store, base);
  const b = addEntry(store, { ...base, company: 'Google' });
  assert.equal(a.id, 'AQ-001');
  assert.equal(b.id, 'AQ-002');
  assert.equal(a.status, 'pending');
  assert.equal(a.history.length, 1);
});

test('addEntry requires company, role and url', () => {
  const store = { version: 1, entries: [] };
  assert.throws(() => addEntry(store, { ...base, company: '' }), /company/);
  assert.throws(() => addEntry(store, { ...base, role: '' }), /role/);
  assert.throws(() => addEntry(store, { ...base, url: '' }), /url/);
});

test('state machine: pending -> approved -> submitted; invalid moves rejected', () => {
  const store = { version: 1, entries: [] };
  addEntry(store, base);
  assert.throws(() => transition(store, 'AQ-001', 'submitted'), /cannot move/);
  transition(store, 'AQ-001', 'approved', 'looks good');
  assert.equal(store.entries[0].status, 'approved');
  assert.throws(() => transition(store, 'AQ-001', 'pending'), /cannot move/);
  transition(store, 'AQ-001', 'submitted');
  assert.throws(() => transition(store, 'AQ-001', 'approved'), /cannot move/);
});

test('rejected can return to pending (re-prepared)', () => {
  const store = { version: 1, entries: [] };
  addEntry(store, base);
  transition(store, 'AQ-001', 'rejected', 'stale JD');
  const e = transition(store, 'AQ-001', 'pending');
  assert.equal(e.status, 'pending');
  assert.equal(e.history.length, 3);
});

test('transition validates state and id', () => {
  const store = { version: 1, entries: [] };
  addEntry(store, base);
  assert.throws(() => transition(store, 'AQ-001', 'bogus'), /invalid state/);
  assert.throws(() => transition(store, 'AQ-999', 'approved'), /not found/);
});

test('save/load roundtrip is atomic and persistent', () => {
  const path = tmpStore();
  const store = { version: 1, entries: [] };
  addEntry(store, base);
  saveStore(store, path);
  assert.ok(existsSync(path));
  const loaded = loadStore(path);
  assert.equal(loaded.entries.length, 1);
  assert.equal(loaded.entries[0].company, 'Anthropic');
  // no tmp leftovers
  assert.ok(!existsSync(`${path}.tmp-${process.pid}`));
});

test('loadStore on missing file returns empty store', () => {
  const store = loadStore(join(tmpdir(), 'definitely-missing-aq.json'));
  assert.deepEqual(store, { version: 1, entries: [] });
});

test('nextId ignores non-canonical ids', () => {
  const store = { version: 1, entries: [{ id: 'custom-x' }, { id: 'AQ-007' }] };
  assert.equal(nextId(store), 'AQ-008');
});

test('CLI end-to-end: add, list, approve, show (subprocess)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'aq-cli-'));
  const storePath = join(dir, 'pending-approvals.json');
  // run CLI with a patched STORE via cwd trick: use node -e to call main with env override
  // simpler: exercise the exported functions through a tiny runner that points STORE at tmp
  const runner = join(dir, 'run.mjs');
  const cliSource = readFileSync(new URL('../approval-queue.mjs', import.meta.url), 'utf8')
    .replace("join(ROOT, 'data', 'pending-approvals.json')", JSON.stringify(storePath));
  writeFileSync(runner, cliSource);
  const out = execFileSync('node', [runner, 'add', '--company', 'Anthropic', '--role', 'SE', '--url', 'https://example.com/1'], { encoding: 'utf8' });
  const added = JSON.parse(out);
  assert.equal(added.id, 'AQ-001');
  execFileSync('node', [runner, 'approve', 'AQ-001', '--note', 'go']);
  const shown = JSON.parse(execFileSync('node', [runner, 'show', 'AQ-001'], { encoding: 'utf8' }));
  assert.equal(shown.status, 'approved');
  const list = JSON.parse(execFileSync('node', [runner, 'list', '--status', 'approved'], { encoding: 'utf8' }));
  assert.equal(list.length, 1);
});
