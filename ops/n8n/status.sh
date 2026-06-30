#!/usr/bin/env bash
set -Eeuo pipefail

PORT="${N8N_PORT:-5678}"
LABEL="com.paulo.careerops.n8n"
BRIDGE_LABEL="com.paulo.careerops.n8n-radar-bridge"
JOB_BRIDGE_LABEL="com.paulo.careerops.n8n-job-applications-bridge"
OLLAMA_CODEX_BRIDGE_LABEL="com.paulo.careerops.n8n-ollama-codex-bridge"
BRIDGE_PORT="${CAREER_OPS_N8N_BRIDGE_PORT:-18765}"
JOB_BRIDGE_PORT="${CAREER_OPS_N8N_JOB_BRIDGE_PORT:-18766}"
OLLAMA_CODEX_BRIDGE_PORT="${CAREER_OPS_N8N_OLLAMA_CODEX_BRIDGE_PORT:-18767}"

echo "LaunchAgent:"
launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1 && echo "  loaded: yes" || echo "  loaded: no"
launchctl print "gui/$(id -u)/$BRIDGE_LABEL" >/dev/null 2>&1 && echo "  bridge_loaded: yes" || echo "  bridge_loaded: no"
launchctl print "gui/$(id -u)/$JOB_BRIDGE_LABEL" >/dev/null 2>&1 && echo "  job_bridge_loaded: yes" || echo "  job_bridge_loaded: no"
launchctl print "gui/$(id -u)/$OLLAMA_CODEX_BRIDGE_LABEL" >/dev/null 2>&1 && echo "  ollama_codex_bridge_loaded: yes" || echo "  ollama_codex_bridge_loaded: no"

echo "HTTP:"
if curl -fsS "http://127.0.0.1:$PORT/healthz" >/dev/null 2>&1; then
  echo "  healthz: ok"
else
  echo "  healthz: not reachable"
fi
if curl -fsS "http://127.0.0.1:$BRIDGE_PORT/healthz" >/dev/null 2>&1; then
  echo "  bridge_healthz: ok"
else
  echo "  bridge_healthz: not reachable"
fi
if curl -fsS "http://127.0.0.1:$JOB_BRIDGE_PORT/healthz" >/dev/null 2>&1; then
  echo "  job_bridge_healthz: ok"
else
  echo "  job_bridge_healthz: not reachable"
fi
if curl -fsS "http://127.0.0.1:$OLLAMA_CODEX_BRIDGE_PORT/healthz" >/dev/null 2>&1; then
  echo "  ollama_codex_bridge_healthz: ok"
else
  echo "  ollama_codex_bridge_healthz: not reachable"
fi
if curl -fsS "${OLLAMA_BASE_URL:-http://127.0.0.1:11434}/api/tags" >/dev/null 2>&1; then
  echo "  ollama_healthz: ok"
else
  echo "  ollama_healthz: not reachable"
fi

echo "Process:"
ps -axo pid=,comm=,args= | awk '$2 ~ /node/ && ($0 ~ /n8n|radar-bridge|job-application-bridge|ollama-codex-bridge/) { print }' || true
