#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
N8N_TOOL_DIR="${N8N_TOOL_DIR:-/Users/paulopierrondi/Projects/.tools/n8n}"
N8N_ENV_FILE="${CAREER_OPS_N8N_ENV:-/Users/paulopierrondi/.config/career-ops-n8n/env}"
N8N_HOME="${N8N_USER_FOLDER:-/Users/paulopierrondi/.n8n-career-ops}"
WORKFLOW_FILES=(
  "$PROJECT_DIR/ops/n8n/workflows/career-ops-freelance-mail-radar.json"
  "$PROJECT_DIR/ops/n8n/workflows/career-ops-daily-us-ai-job-applications.json"
  "$PROJECT_DIR/ops/n8n/workflows/career-ops-ollama-codex-supervisor.json"
)

mkdir -p "$N8N_HOME"
chmod 700 "$N8N_HOME"

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

export PATH="/opt/homebrew/opt/node@22/bin:$N8N_TOOL_DIR/node_modules/.bin:$PATH"
export N8N_USER_FOLDER="$N8N_HOME"
export N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS="${N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS:-true}"

cd "$PROJECT_DIR"
for workflow_file in "${WORKFLOW_FILES[@]}"; do
  n8n import:workflow --input="$workflow_file"
done
n8n update:workflow --id=careerops-freelance-mail-radar --active=true
n8n update:workflow --id=careerops-daily-us-ai-job-applications --active=true
n8n update:workflow --id=careerops-ollama-codex-supervisor --active="${N8N_OLLAMA_CODEX_WORKFLOW_ACTIVE:-true}"
n8n list:workflow
