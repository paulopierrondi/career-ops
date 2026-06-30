#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
AUTOMATION_ID="${AUTOMATION_ID:-n8n-workana-99freelas-mail-radar}"
N8N_ENV_FILE="${CAREER_OPS_N8N_ENV:-/Users/paulopierrondi/.config/career-ops-n8n/env}"

if [[ -f "$N8N_ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$N8N_ENV_FILE"
  set +a
fi

SINCE_HOURS="${N8N_FREELANCE_SINCE_HOURS:-8}"
EMAIL_MODE="${N8N_FREELANCE_EMAIL_MODE:-actionable}"
ARCHIVE_PROCESSED="${N8N_FREELANCE_ARCHIVE_PROCESSED:-true}"
REPORT_DIR="$PROJECT_DIR/reports/freelance"
LOCK_DIR="${N8N_FREELANCE_LOCK_DIR:-/tmp/career-ops-n8n-freelance-radar.lock}"
RUN_TS="$(date '+%Y-%m-%d-%H-%M-%S')"
JSON_PATH="$REPORT_DIR/${RUN_TS}-n8n-freelance-mail-radar.json"
FAILURE_LOG="$REPORT_DIR/${RUN_TS}-n8n-freelance-mail-radar-failed.md"
NOHIT_LOG="$REPORT_DIR/${RUN_TS}-n8n-freelance-mail-radar-nohit.md"

export OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://127.0.0.1:11434}"
export OLLAMA_MODEL="${OLLAMA_MODEL:-${N8N_OLLAMA_MODEL:-qwen3-coder:30b}}"
export OPENAI_BASE_URL="${OPENAI_BASE_URL:-${N8N_LOCAL_LLM_OPENAI_BASE_URL:-$OLLAMA_BASE_URL/v1}}"
export OPENAI_MODEL="${OPENAI_MODEL:-$OLLAMA_MODEL}"

mkdir -p "$REPORT_DIR"
cd "$PROJECT_DIR"

if [[ -d "$LOCK_DIR" ]] && find "$LOCK_DIR" -mmin +10 -print -quit | grep -q .; then
  rm -rf "$LOCK_DIR"
fi

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  /opt/homebrew/opt/node@22/bin/node -e "console.log(JSON.stringify({ok:true, automation_id:process.argv[1], status:'skipped_concurrent', timestamp:new Date().toISOString()}, null, 2))" "$AUTOMATION_ID"
  exit 0
fi

cleanup_lock() {
  rmdir "$LOCK_DIR" >/dev/null 2>&1 || true
}
trap cleanup_lock EXIT

run_json() {
  /Users/paulopierrondi/.local/bin/brain-env-run -- \
    /opt/homebrew/opt/node@22/bin/node scripts/freelance-mail-radar.mjs \
      --source all \
      --since-hours "$SINCE_HOURS" \
      --json \
      --ai-drafts
}

send_email() {
  local status="$1"
  local log_path="$2"
  if [[ "$EMAIL_MODE" == "none" ]]; then
    return 0
  fi
  /Users/paulopierrondi/.local/bin/brain-send-automation-email \
    --automation "$AUTOMATION_ID" \
    --status "$status" \
    --log "$log_path" >/dev/null || true
}

if ! run_json >"$JSON_PATH.tmp" 2>"$JSON_PATH.stderr"; then
  {
    echo "# n8n Freelance Mail Radar Failure - $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo
    echo "- Automation: \`$AUTOMATION_ID\`"
    echo "- Command: \`node scripts/freelance-mail-radar.mjs --source all --since-hours $SINCE_HOURS --json --ai-drafts\`"
    echo "- JSON path: \`$JSON_PATH\`"
  echo
  echo "## Stderr"
    echo
    sed -E 's/(api[_-]?key|token|secret|password|cookie)=([^ ]+)/\\1=[REDACTED]/ig' "$JSON_PATH.stderr" || true
  } >"$FAILURE_LOG"
  send_email failed "$FAILURE_LOG"
  /opt/homebrew/opt/node@22/bin/node -e "console.log(JSON.stringify({ok:false, automation_id:process.argv[1], status:'failed', failure_log:process.argv[2]}, null, 2))" "$AUTOMATION_ID" "$FAILURE_LOG"
  exit 1
fi

mv "$JSON_PATH.tmp" "$JSON_PATH"
rm -f "$JSON_PATH.stderr"

SUMMARY_JSON="$(/opt/homebrew/opt/node@22/bin/node - "$JSON_PATH" "$AUTOMATION_ID" <<'NODE'
const fs = require('fs');
const [jsonPath, automationId] = process.argv.slice(2);
const raw = fs.readFileSync(jsonPath, 'utf8').trim();
const start = raw.indexOf('{');
const end = raw.lastIndexOf('}');
if (start < 0 || end < start) {
  throw new Error('No JSON object found in radar output');
}
const parsed = JSON.parse(raw.slice(start, end + 1));
  const summary = {
  ok: true,
  automation_id: automationId,
  timestamp: new Date().toISOString(),
  checked_messages: parsed.checked_messages ?? 0,
  parsed_candidates: parsed.parsed_candidates ?? 0,
  new_messages: parsed.new_messages ?? 0,
  actionable: parsed.actionable ?? 0,
  report_path: parsed.report_path ?? null,
  draft_paths: parsed.draft_paths ?? [],
  top: parsed.top ?? [],
  raw_json_path: jsonPath,
  processed_mail_message_ids: parsed.processed_mail_message_ids ?? [],
  new_mail_message_ids: parsed.new_mail_message_ids ?? [],
  actionable_mail_message_ids: parsed.actionable_mail_message_ids ?? [],
  proposal_submission_gate: {
    draft_only_mode: true,
    automated_vai_state: process.env.N8N_FREELANCE_AUTOMATED_VAI === 'true',
    allowed_without_active_paulo_confirmation: false,
    n8n_submission_allowed: false,
    required_before_submit: 'n8n stops at draft_ready. Paulo must review and submit manually inside Workana/99Freelas outside this workflow before any proposal submission, credit spend, boost, paid moderation, login bypass, or profile/payment/tax/identity change',
  },
};
process.stdout.write(JSON.stringify(summary));
NODE
)"

ACTIONABLE="$(/opt/homebrew/opt/node@22/bin/node -e "const x=JSON.parse(process.argv[1]); console.log(Number(x.actionable||0));" "$SUMMARY_JSON")"
REPORT_PATH="$(/opt/homebrew/opt/node@22/bin/node -e "const x=JSON.parse(process.argv[1]); console.log(x.report_path||'');" "$SUMMARY_JSON")"
PROCESSED_IDS="$(/opt/homebrew/opt/node@22/bin/node -e "const x=JSON.parse(process.argv[1]); console.log((x.processed_mail_message_ids||[]).join(','));" "$SUMMARY_JSON")"
ARCHIVE_JSON=""

if [[ "$ARCHIVE_PROCESSED" == "true" && -n "$PROCESSED_IDS" ]]; then
  if ARCHIVE_JSON="$(/opt/homebrew/opt/node@22/bin/node scripts/archive-freelance-mail-messages.mjs "$PROCESSED_IDS" 2>/tmp/career-ops-n8n-mail-archive.stderr)"; then
    SUMMARY_JSON="$(/opt/homebrew/opt/node@22/bin/node -e "const s=JSON.parse(process.argv[1]); s.mail_archive=JSON.parse(process.argv[2]); console.log(JSON.stringify(s));" "$SUMMARY_JSON" "$ARCHIVE_JSON")"
  else
    ARCHIVE_LOG="$REPORT_DIR/${RUN_TS}-n8n-freelance-mail-archive-failed.md"
    {
      echo "# n8n Freelance Mail Archive Failure - $(date '+%Y-%m-%d %H:%M:%S %Z')"
      echo
      echo "- Automation: \`$AUTOMATION_ID\`"
      echo "- Processed message ids: \`$PROCESSED_IDS\`"
      echo
      echo "## Stderr"
      echo
      sed -E 's/(api[_-]?key|token|secret|password|cookie)=([^ ]+)/\\1=[REDACTED]/ig' /tmp/career-ops-n8n-mail-archive.stderr || true
    } >"$ARCHIVE_LOG"
    SUMMARY_JSON="$(/opt/homebrew/opt/node@22/bin/node -e "const s=JSON.parse(process.argv[1]); s.mail_archive={ok:false, failure_log:process.argv[2]}; console.log(JSON.stringify(s));" "$SUMMARY_JSON" "$ARCHIVE_LOG")"
  fi
elif [[ "$ARCHIVE_PROCESSED" != "true" ]]; then
  SUMMARY_JSON="$(/opt/homebrew/opt/node@22/bin/node -e "const s=JSON.parse(process.argv[1]); s.mail_archive={ok:true, skipped:true, reason:'N8N_FREELANCE_ARCHIVE_PROCESSED disabled'}; console.log(JSON.stringify(s));" "$SUMMARY_JSON")"
else
  SUMMARY_JSON="$(/opt/homebrew/opt/node@22/bin/node -e "const s=JSON.parse(process.argv[1]); s.mail_archive={ok:true, archived_count:0, requested_ids:[]}; console.log(JSON.stringify(s));" "$SUMMARY_JSON")"
fi

if [[ "$ACTIONABLE" -gt 0 ]]; then
  if [[ -n "$REPORT_PATH" && -f "$REPORT_PATH" ]]; then
    send_email success "$REPORT_PATH"
  else
    {
      echo "# n8n Freelance Mail Radar Actionable Lead - $(date '+%Y-%m-%d %H:%M:%S %Z')"
      echo
      echo "\`\`\`json"
      /opt/homebrew/opt/node@22/bin/node -e "console.log(JSON.stringify(JSON.parse(process.argv[1]), null, 2));" "$SUMMARY_JSON"
      echo "\`\`\`"
    } >"$NOHIT_LOG"
    send_email success "$NOHIT_LOG"
  fi
elif [[ "$EMAIL_MODE" == "always" ]]; then
  {
    echo "# n8n Freelance Mail Radar No-Hit - $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo
    echo "\`\`\`json"
    /opt/homebrew/opt/node@22/bin/node -e "console.log(JSON.stringify(JSON.parse(process.argv[1]), null, 2));" "$SUMMARY_JSON"
    echo "\`\`\`"
  } >"$NOHIT_LOG"
  send_email success "$NOHIT_LOG"
fi

/opt/homebrew/opt/node@22/bin/node -e "console.log(JSON.stringify(JSON.parse(process.argv[1]), null, 2));" "$SUMMARY_JSON"
