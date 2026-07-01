#!/usr/bin/env bash
set -Eeuo pipefail

# Career Ops — Growth GEO/SEO Radar runner.
# Report-only: audits configured public targets (curl of served artifacts), writes
# reports/growth/ + .brain snapshots, emails Paulo. Never deploys, never mutates a site.

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
AUTOMATION_ID="${AUTOMATION_ID:-n8n-growth-geo-seo-radar}"
N8N_ENV_FILE="${CAREER_OPS_N8N_ENV:-/Users/paulopierrondi/.config/career-ops-n8n/env}"
NODE_BIN="${NODE_BIN:-/opt/homebrew/opt/node@22/bin/node}"
command -v "$NODE_BIN" >/dev/null 2>&1 || NODE_BIN="$(command -v node)"

if [[ -f "$N8N_ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$N8N_ENV_FILE"
  set +a
fi

EMAIL_MODE="${N8N_GROWTH_EMAIL_MODE:-always}"   # always | actionable | none
REPORT_DIR="$PROJECT_DIR/reports/growth"
LOCK_DIR="${N8N_GROWTH_LOCK_DIR:-/tmp/career-ops-n8n-growth-geo-seo.lock}"
RUN_TS="$(date '+%Y-%m-%d-%H-%M-%S')"
JSON_PATH="$REPORT_DIR/${RUN_TS}-n8n-growth-geo-seo.json"
SUMMARY_LOG="$REPORT_DIR/${RUN_TS}-n8n-growth-geo-seo.md"
FAILURE_LOG="$REPORT_DIR/${RUN_TS}-n8n-growth-geo-seo-failed.md"

mkdir -p "$REPORT_DIR"
cd "$PROJECT_DIR"

# Stale-lock reap (>30m) then acquire.
if [[ -d "$LOCK_DIR" ]] && find "$LOCK_DIR" -mmin +30 -print -quit | grep -q .; then rm -rf "$LOCK_DIR"; fi
if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  "$NODE_BIN" -e "console.log(JSON.stringify({ok:true,automation_id:process.argv[1],status:'skipped_concurrent',timestamp:new Date().toISOString()},null,2))" "$AUTOMATION_ID"
  exit 0
fi
trap 'rmdir "$LOCK_DIR" >/dev/null 2>&1 || true' EXIT

send_email() {
  [[ "$EMAIL_MODE" == "none" ]] && return 0
  /Users/paulopierrondi/.local/bin/brain-send-automation-email \
    --automation "$AUTOMATION_ID" --status "$1" --log "$2" >/dev/null 2>&1 || true
}

if ! "$NODE_BIN" geo-seo-audit.mjs --all --json >"$JSON_PATH.tmp" 2>"$JSON_PATH.stderr"; then
  {
    echo "# Growth GEO/SEO Radar Failure — $(date '+%Y-%m-%d %H:%M:%S %Z')"
    echo
    echo "- Automation: \`$AUTOMATION_ID\`"
    echo "- Command: \`node geo-seo-audit.mjs --all --json\`"
    echo
    echo "## Stderr"
    echo
    sed -E 's/(api[_-]?key|token|secret|password|cookie)=([^ ]+)/\1=[REDACTED]/ig' "$JSON_PATH.stderr" || true
  } >"$FAILURE_LOG"
  send_email failed "$FAILURE_LOG"
  "$NODE_BIN" -e "console.log(JSON.stringify({ok:false,automation_id:process.argv[1],status:'failed',failure_log:process.argv[2]},null,2))" "$AUTOMATION_ID" "$FAILURE_LOG"
  exit 1
fi

mv "$JSON_PATH.tmp" "$JSON_PATH"
rm -f "$JSON_PATH.stderr"

# Build a redacted summary + scorecard from the audit JSON.
"$NODE_BIN" - "$JSON_PATH" "$SUMMARY_LOG" "$AUTOMATION_ID" <<'NODE'
const fs = require('fs');
const [jsonPath, mdPath, automationId] = process.argv.slice(2);
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const recs = Array.isArray(data) ? data : [data];
recs.sort((a, b) => b.score.earned - a.score.earned);
const rows = recs.map(r => `| ${r.host} | **${r.tier}** | ${r.score.earned}/100 | ${r.score.geoEarned}/63 | ${r.score.seoEarned}/37 | ${r.gaps.length} |`).join('\n');
const md = `# Growth GEO/SEO Radar — ${new Date().toISOString().slice(0,10)}

Report-only served-artifact audit. Reference: AgentCore (agenticoscore.ai). SEO never without GEO.

| Target | Tier | Score | GEO | SEO | Gaps |
|---|---|---|---|---|---|
${rows}

Reports: \`reports/growth/geo-seo-audit-{host}-*.md\` · Brain: \`.brain/geo-seo/*.json\`

> Deploying any generated GEO kit is human-gated (Paulo's explicit command).
`;
fs.writeFileSync(mdPath, md);
console.log(JSON.stringify({ ok: true, automation_id: automationId, timestamp: new Date().toISOString(), targets: recs.length, scorecard: recs.map(r => ({ host: r.host, tier: r.tier, score: r.score.earned, gaps: r.gaps.length })) }, null, 2));
NODE

send_email success "$SUMMARY_LOG"
