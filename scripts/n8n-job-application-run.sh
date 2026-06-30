#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
AUTOMATION_ID="${AUTOMATION_ID:-n8n-daily-us-ai-job-applications}"
N8N_ENV_FILE="${CAREER_OPS_N8N_ENV:-/Users/paulopierrondi/.config/career-ops-n8n/env}"
REPORT_DIR="$PROJECT_DIR/reports/job-applications"
LOCK_DIR="${N8N_JOB_APPLICATION_LOCK_DIR:-/tmp/career-ops-n8n-job-applications.lock}"
RUN_TS="$(date '+%Y-%m-%d-%H-%M-%S')"
JSON_PATH="$REPORT_DIR/${RUN_TS}-n8n-daily-us-ai-job-applications.json"
FAILURE_LOG="$REPORT_DIR/${RUN_TS}-n8n-daily-us-ai-job-applications-failed.md"
NOHIT_LOG="$REPORT_DIR/${RUN_TS}-n8n-daily-us-ai-job-applications-nohit.md"

mkdir -p "$REPORT_DIR"
cd "$PROJECT_DIR"

load_env_file() {
  local env_file="$1"
  local line key value
  [[ -f "$env_file" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" =~ ^[[:space:]]*$ || "$line" =~ ^[[:space:]]*# ]] && continue
    if [[ "$line" =~ ^[[:space:]]*([A-Za-z_][A-Za-z0-9_]*)=(.*)$ ]]; then
      key="${BASH_REMATCH[1]}"
      value="${BASH_REMATCH[2]}"
      export "$key=$value"
    else
      echo "WARN ignoring invalid env line in $env_file" >&2
    fi
  done < "$env_file"
}

if [[ -f "$N8N_ENV_FILE" ]]; then
  load_env_file "$N8N_ENV_FILE"
fi

export AUTOMATION_ID
export N8N_JOB_APPLICATION_SUBMIT_MODE="${SUBMIT_MODE:-${N8N_JOB_APPLICATION_SUBMIT_MODE:-ready_for_submit}}"
export N8N_JOB_APPLICATION_DAILY_LIMIT="${N8N_JOB_APPLICATION_DAILY_LIMIT:-3}"

if [[ -d "$LOCK_DIR" ]] && find "$LOCK_DIR" -mmin +120 -print -quit | grep -q .; then
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

send_email() {
  local status="$1"
  local log_path="$2"
  /Users/paulopierrondi/.local/bin/brain-send-automation-email \
    --automation "$AUTOMATION_ID" \
    --status "$status" \
    --log "$log_path" >/dev/null || true
}

if ! /Users/paulopierrondi/.local/bin/brain-env-run -- \
  /opt/homebrew/opt/node@22/bin/node scripts/job-application-autopilot.mjs --json \
  >"$JSON_PATH.tmp" 2>"$JSON_PATH.stderr"; then
  {
    echo "# n8n Daily US AI Job Applications Failure - $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo
    echo "- Automation: \`$AUTOMATION_ID\`"
    echo "- JSON path: \`$JSON_PATH\`"
    echo
    echo "## Stderr"
    echo
    sed -E 's/(api[_-]?key|token|secret|password|cookie)=([^ ]+)/\1=[REDACTED]/ig' "$JSON_PATH.stderr" || true
    echo
    echo "## Stdout"
    echo
    sed -E 's/(api[_-]?key|token|secret|password|cookie)=([^ ]+)/\1=[REDACTED]/ig' "$JSON_PATH.tmp" || true
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
const parsed = start >= 0 && end > start ? JSON.parse(raw.slice(start, end + 1)) : {};
const summary = {
  ok: parsed.ok !== false,
  automation_id: automationId,
  timestamp: new Date().toISOString(),
  status: parsed.status || 'failed',
  submitted_count: parsed.submitted_count || 0,
  ready_count: parsed.ready_count || 0,
  blocked_count: parsed.blocked_count || 0,
  archived_pipeline_count: parsed.archived_pipeline_count || 0,
  approval_count: parsed.approval_count || 0,
  approval_queue_path: parsed.approval_queue_path || null,
  approval_queue_json_path: parsed.approval_queue_json_path || null,
  processed_count: Array.isArray(parsed.processed) ? parsed.processed.length : 0,
  report_path: parsed.report_path || null,
  raw_json_path: jsonPath,
  processed: parsed.processed || [],
  errors: parsed.errors || [],
};
process.stdout.write(JSON.stringify(summary));
NODE
)"

STATUS="$(/opt/homebrew/opt/node@22/bin/node -e "const x=JSON.parse(process.argv[1]); console.log(x.status || 'failed');" "$SUMMARY_JSON")"
REPORT_PATH="$(/opt/homebrew/opt/node@22/bin/node -e "const x=JSON.parse(process.argv[1]); console.log(x.report_path || '');" "$SUMMARY_JSON")"

if [[ -n "$REPORT_PATH" && -f "$PROJECT_DIR/$REPORT_PATH" ]]; then
  send_email success "$PROJECT_DIR/$REPORT_PATH"
else
  {
    echo "# n8n Daily US AI Job Applications - $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo
    echo "\`\`\`json"
    /opt/homebrew/opt/node@22/bin/node -e "console.log(JSON.stringify(JSON.parse(process.argv[1]), null, 2));" "$SUMMARY_JSON"
    echo "\`\`\`"
  } >"$NOHIT_LOG"
  send_email success "$NOHIT_LOG"
fi

/opt/homebrew/opt/node@22/bin/node -e "const x=JSON.parse(process.argv[1]); x.email_status='sent_or_queued'; console.log(JSON.stringify(x, null, 2));" "$SUMMARY_JSON"
