#!/usr/bin/env bash
set -euo pipefail

echo "== WayAI CI dependency self-heal =="

lock_ok=0
if [ -f package-lock.json ]; then
  if node -e 'JSON.parse(require("fs").readFileSync("package-lock.json","utf8"));'; then
    lock_ok=1
  else
    echo "package-lock.json is invalid JSON; removing corrupted lockfile."
    rm -f package-lock.json
  fi
fi

if [ "$lock_ok" -eq 1 ]; then
  if npm ci --ignore-scripts; then
    echo "Dependency graph is healthy."
    exit 0
  fi
  echo "npm ci failed; regenerating the lockfile from package.json."
  rm -rf node_modules
fi

npm install --package-lock-only --ignore-scripts
npm ci --ignore-scripts
echo "Dependency graph auto-healed successfully."
