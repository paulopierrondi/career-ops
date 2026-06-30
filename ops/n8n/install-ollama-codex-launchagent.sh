#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="${PROJECT_DIR:-/Users/paulopierrondi/Projects/career-ops}"
LABEL="com.paulo.careerops.n8n-ollama-codex-bridge"
SOURCE_PLIST="$PROJECT_DIR/ops/n8n/launchagents/$LABEL.plist"
TARGET_PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG_DIR="${N8N_LOG_DIR:-/Users/paulopierrondi/Library/Logs/career-ops-n8n}"

mkdir -p "$HOME/Library/LaunchAgents" "$LOG_DIR"
plutil -lint "$SOURCE_PLIST"
install -m 0644 "$SOURCE_PLIST" "$TARGET_PLIST"

launchctl bootout "gui/$(id -u)/$LABEL" >/dev/null 2>&1 || true
launchctl bootstrap "gui/$(id -u)" "$TARGET_PLIST"
launchctl kickstart -k "gui/$(id -u)/$LABEL"
launchctl print "gui/$(id -u)/$LABEL" >/dev/null

echo "installed=$TARGET_PLIST"
echo "label=$LABEL"
