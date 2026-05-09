#!/usr/bin/env node

const childProcess = require("node:child_process");

function run(command) {
  childProcess.execSync(command, { stdio: "inherit" });
}

if (!process.stdin.isTTY) {
  run('node "tools/platform-orchestrator/wizard.js"');
} else {
  try {
    run('node "tools/platform-orchestrator/wizard-ink.mjs"');
  } catch (_error) {
    process.stdout.write("\nInk wizard no disponible. Usando wizard clasico...\n\n");
    run('node "tools/platform-orchestrator/wizard.js"');
  }
}
