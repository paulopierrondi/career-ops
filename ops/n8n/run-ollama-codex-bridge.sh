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
export OLLAMA_BASE_URL="${OLLAMA_BASE_URL:-http://127.0.0.1:11434}"
export OLLAMA_MODEL="${OLLAMA_MODEL:-${N8N_OLLAMA_MODEL:-qwen3-coder:30b}}"
export N8N_GEMINI_MODEL="${N8N_GEMINI_MODEL:-${GEMINI_MODEL:-gemini-2.5-flash-lite}}"
export CAREER_OPS_N8N_OLLAMA_CODEX_BRIDGE_PORT="${CAREER_OPS_N8N_OLLAMA_CODEX_BRIDGE_PORT:-18767}"
export N8N_OLLAMA_CODEX_AUTORUN="${N8N_OLLAMA_CODEX_AUTORUN:-false}"
export N8N_OLLAMA_GEMINI_AUTORUN="${N8N_OLLAMA_GEMINI_AUTORUN:-false}"
export N8N_OLLAMA_GEMINI_REQUIRE_REASON="${N8N_OLLAMA_GEMINI_REQUIRE_REASON:-true}"
export N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE="${N8N_OLLAMA_CODEX_ALLOW_WORKSPACE_WRITE:-false}"

cd "$PROJECT_DIR"
exec /opt/homebrew/opt/node@22/bin/node ops/n8n/ollama-codex-bridge.mjs
