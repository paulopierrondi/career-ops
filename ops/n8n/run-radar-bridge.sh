#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
N8N_ENV_FILE="${CAREER_OPS_N8N_ENV:-/Users/paulopierrondi/.config/career-ops-n8n/env}"
LOG_DIR="${N8N_LOG_DIR:-/Users/paulopierrondi/Library/Logs/career-ops-n8n}"

mkdir -p "$LOG_DIR"

if [[ -f "$N8N_ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$N8N_ENV_FILE"
  set +a
fi

export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
export PROJECT_DIR

cd "$PROJECT_DIR"
exec /opt/homebrew/opt/node@22/bin/node ops/n8n/radar-bridge.mjs
