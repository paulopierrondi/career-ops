#!/usr/bin/env node
/**
 * Archives already-processed marketplace notification emails from Mail.app.
 *
 * This intentionally uses Mail's native Archive keyboard shortcut instead of
 * delete or mailbox moves. Gmail IMAP labels do not reliably change when moved
 * by Mail's scripting dictionary, while the native Archive action removes the
 * message from Google INBOX and keeps it in All Mail.
 */

import { execFileSync } from 'node:child_process';

const parseOnly = process.argv.includes('--parse-only');
const idArgs = process.argv.slice(2).filter((arg) => arg !== '--parse-only');

const requestedIds = idArgs
  .flatMap((arg) => arg.split(','))
  .map((arg) => arg.trim())
  .filter(Boolean)
  .filter((arg, index, arr) => arr.indexOf(arg) === index);

function normalizeMailMessageId(value) {
  const match = /^(?:(?<source>[a-z0-9_-]+):)?(?<id>\d+)$/i.exec(value);
  if (!match) {
    throw new Error(`Invalid Mail message id "${value}". Expected numeric id or source-prefixed numeric id like "99freelas:353512".`);
  }
  return match.groups.id;
}

const ids = requestedIds
  .map(normalizeMailMessageId)
  .filter((arg, index, arr) => arr.indexOf(arg) === index);

if (ids.length === 0) {
  console.log(JSON.stringify({
    ok: true,
    archived_count: 0,
    requested_ids: requestedIds,
    normalized_ids: [],
    verified_not_in_inbox: [],
    still_in_inbox: [],
    skipped: [],
  }, null, 2));
  process.exit(0);
}

if (parseOnly) {
  console.log(JSON.stringify({
    ok: true,
    requested_ids: requestedIds,
    normalized_ids: ids,
  }, null, 2));
  process.exit(0);
}

const appleScript = `
set targetIds to {${ids.join(', ')}}
set archivedIds to {}
set skippedIds to {}

tell application "Mail"
  activate
  set inboxBox to mailbox "INBOX" of account "Google"
end tell

delay 1

repeat with messageId in targetIds
  tell application "Mail"
    set inboxBox to mailbox "INBOX" of account "Google"
    set foundMessages to (messages of inboxBox whose id is messageId)
    if (count of foundMessages) is 0 then
      set end of skippedIds to (messageId as text)
    else
      set msg to item 1 of foundMessages
      set msgSender to sender of msg
      set msgSubject to subject of msg
      if (msgSender contains "99freelas.com.br" and msgSubject contains "Novo Projeto") or (msgSender contains "workana" and (msgSubject contains "Novo projeto" or msgSubject contains "Nuevo proyecto" or msgSubject contains "New project" or msgSubject contains "Projeto recomendado")) then
        open msg
        delay 0.8
        tell application "System Events"
          tell process "Mail"
            keystroke "a" using {command down, control down}
          end tell
        end tell
        set end of archivedIds to (messageId as text)
        delay 1.4
      else
        set end of skippedIds to (messageId as text)
      end if
    end if
  end tell
end repeat

return "archived=" & archivedIds & "; skipped=" & skippedIds
`;

const stdout = execFileSync('osascript', {
  input: appleScript,
  encoding: 'utf8',
  timeout: 180000,
  maxBuffer: 1024 * 1024,
});

const verifyScript = `
const Mail = Application('Mail');
const google = Mail.accounts.whose({name: 'Google'})()[0];
if (!google) throw new Error('Google Mail account not found');
const inboxBox = google.mailboxes.whose({name: 'INBOX'})()[0];
if (!inboxBox) throw new Error('Google INBOX mailbox not found');
const ids = ${JSON.stringify(ids)};
const rows = [];
for (const id of ids) {
  const matches = inboxBox.messages.whose({id: Number(id)})();
  rows.push({ id, in_google_inbox: matches.length > 0 });
}
JSON.stringify(rows);
`;

const verification = JSON.parse(execFileSync('osascript', ['-l', 'JavaScript'], {
  input: verifyScript,
  encoding: 'utf8',
  timeout: 30000,
  maxBuffer: 1024 * 1024,
}));

console.log(JSON.stringify({
  ok: verification.every((row) => !row.in_google_inbox),
  archived_count: verification.filter((row) => !row.in_google_inbox).length,
  requested_ids: requestedIds,
  normalized_ids: ids,
  verified_not_in_inbox: verification.filter((row) => !row.in_google_inbox).map((row) => row.id),
  still_in_inbox: verification.filter((row) => row.in_google_inbox).map((row) => row.id),
  osascript_result: stdout.trim(),
}, null, 2));
