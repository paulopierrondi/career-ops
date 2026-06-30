#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
N8N_ENV_FILE="${CAREER_OPS_N8N_ENV:-/Users/paulopierrondi/.config/career-ops-n8n/env}"
LOG_DIR="${N8N_LOG_DIR:-/Users/paulopierrondi/Library/Logs/career-ops-n8n}"

mkdir -p "$LOG_DIR"

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

export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
export PROJECT_DIR
export CAREER_OPS_N8N_JOB_BRIDGE_PORT="${CAREER_OPS_N8N_JOB_BRIDGE_PORT:-18766}"

cd "$PROJECT_DIR"
exec /opt/homebrew/opt/node@22/bin/node ops/n8n/job-application-bridge.mjs
