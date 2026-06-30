#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
N8N_TOOL_DIR="${N8N_TOOL_DIR:-/Users/paulopierrondi/Projects/.tools/n8n}"
N8N_ENV_FILE="${CAREER_OPS_N8N_ENV:-/Users/paulopierrondi/.config/career-ops-n8n/env}"
N8N_HOME="${N8N_USER_FOLDER:-/Users/paulopierrondi/.n8n-career-ops}"
LOG_DIR="${N8N_LOG_DIR:-/Users/paulopierrondi/Library/Logs/career-ops-n8n}"

mkdir -p "$N8N_HOME" "$LOG_DIR"
chmod 700 "$N8N_HOME"

if [[ -f "$N8N_ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$N8N_ENV_FILE"
  set +a
fi

export PATH="/opt/homebrew/opt/node@22/bin:$N8N_TOOL_DIR/node_modules/.bin:$PATH"
export N8N_USER_FOLDER="$N8N_HOME"
export N8N_HOST="${N8N_HOST:-127.0.0.1}"
export N8N_LISTEN_ADDRESS="${N8N_LISTEN_ADDRESS:-127.0.0.1}"
export N8N_PORT="${N8N_PORT:-5678}"
export N8N_PROTOCOL="${N8N_PROTOCOL:-http}"
export WEBHOOK_URL="${WEBHOOK_URL:-http://127.0.0.1:5678/}"
export N8N_SECURE_COOKIE="${N8N_SECURE_COOKIE:-false}"
export N8N_DIAGNOSTICS_ENABLED="${N8N_DIAGNOSTICS_ENABLED:-false}"
export N8N_PERSONALIZATION_ENABLED="${N8N_PERSONALIZATION_ENABLED:-false}"
export N8N_VERSION_NOTIFICATIONS_ENABLED="${N8N_VERSION_NOTIFICATIONS_ENABLED:-false}"
export N8N_TEMPLATES_ENABLED="${N8N_TEMPLATES_ENABLED:-false}"
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS="${N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS:-true}"
export EXECUTIONS_DATA_PRUNE="${EXECUTIONS_DATA_PRUNE:-true}"
export EXECUTIONS_DATA_MAX_AGE="${EXECUTIONS_DATA_MAX_AGE:-168}"
export PROJECT_DIR

cd "$PROJECT_DIR"
exec n8n start
