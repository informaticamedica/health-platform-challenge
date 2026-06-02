#!/usr/bin/env node

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const childProcess = require("node:child_process");
const readline = require("node:readline");
const { parseTextToProposal, getNameSuggestions, getTemplateOptionsFromRepo, getDbOptionsFromRepo, nextMvpName, slugify } = require("./intent-parser.js");

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  gray: "\x1b[90m"
};

const STEPS = ["Crear", "Nombre", "Alcance", "Templates", "DB", "Confirmar"];

function color(text, c) {
  return `${c}${text}${ANSI.reset}`;
}

function clearScreen() {
  process.stdout.write("\x1b[2J\x1b[H");
}

function renderTabs(activeIndex, subtitle) {
  clearScreen();
  process.stdout.write(`${color("Health Platform Orchestrator", ANSI.bold)} ${color("wizard", ANSI.cyan)}\n`);
  process.stdout.write(`${color("-".repeat(72), ANSI.gray)}\n`);
  const line = STEPS
    .map((step, i) => {
      if (i === activeIndex) return color(`[${i + 1} ${step}]`, ANSI.magenta + ANSI.bold);
      return color(`[${i + 1} ${step}]`, ANSI.gray);
    })
    .join(" ");
  process.stdout.write(`${line}\n`);
  process.stdout.write(`${color(subtitle, ANSI.dim)}\n\n`);
}

function createRl() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function previewStructure(action, config) {
  if (action === "new:mvp") {
    const lines = [`mvp/${config.name}/`];
    if (config.scope !== "back") lines.push(`mvp/${config.name}/${config.name}-front/`);
    if (config.scope !== "front") lines.push(`mvp/${config.name}/${config.name}-back/`);
    lines.push(`mvp/${config.name}/${config.name}-db/`);
    lines.push(`mvp/${config.name}/package.json`);
    lines.push(`mvp/${config.name}/README.md`);
    return lines;
  }
  if (action === "new:db") {
    return [
      `infra/local/postgres/${config.name}/docker-compose.yml`,
      `infra/local/postgres/${config.name}/sql/01_schema.sql`,
      `infra/local/postgres/${config.name}/seed/default/*.sql`,
      `infra/local/postgres/${config.name}/package.json`
    ];
  }
  return ["Estructura especifica disponible en executionResult."];
}

function ask(rl, question) {
  return new Promise((resolve) => rl.question(question, (answer) => resolve(String(answer || "").trim())));
}

async function askMenu(rl, title, options) {
  process.stdout.write(`${color(title, ANSI.bold)}\n`);
  options.forEach((opt, index) => {
    const label = index === 0 ? `${opt.label} ${color("(recomendado)", ANSI.green)}` : opt.label;
    process.stdout.write(`  ${color(String(index + 1), ANSI.cyan)}) ${label}\n`);
  });
  while (true) {
    const answer = await ask(rl, `${color("Selecciona opcion", ANSI.blue)}: `);
    const n = Number(answer);
    if (Number.isInteger(n) && n >= 1 && n <= options.length) {
      return options[n - 1].value;
    }
    process.stdout.write(`${color("Opcion invalida.", ANSI.red)}\n`);
  }
}

async function askName(rl, action, suggested) {
  const options = suggested.map((value, index) => ({ label: index === 0 ? `${value} (recomendado)` : value, value }));
  options.push({ label: "Escribir nombre custom", value: "__custom__" });
  const selected = await askMenu(rl, "Nombre para el recurso", options);
  if (selected !== "__custom__") return selected;
  while (true) {
    const custom = slugify(await ask(rl, `${color(`Nombre custom para ${action}`, ANSI.blue)}: `));
    if (custom) return custom;
    process.stdout.write(`${color("Nombre invalido.", ANSI.red)}\n`);
  }
}

async function gatherByAction(rl, action, config) {
  if (action === "new:mvp") {
    const scope = await askMenu(rl, "Alcance del MVP", [
      { label: "Ambos", value: "ambos" },
      { label: "Front", value: "front" },
      { label: "Back", value: "back" }
    ]);
    config.scope = scope;

    const tpl = getTemplateOptionsFromRepo(process.cwd(), scope);
    if (tpl.front.length > 0) {
      config.templateFront = await askMenu(rl, "Template frontend", tpl.front.map((x) => ({ label: x, value: x })));
    }
    if (tpl.back.length > 0) {
      config.templateBack = await askMenu(rl, "Template backend", tpl.back.map((x) => ({ label: x, value: x })));
    }

    config.packagesFront = ["@platform/design-system", "@platform/contracts"];
    config.packagesBack = ["@platform/fhir", "@platform/contracts", "@platform/middleware", "@platform/config", "@platform/logger"];

    const dbOptions = getDbOptionsFromRepo(process.cwd());
    const selectedDbLabel = await askMenu(rl, "DB local", dbOptions.map((x) => ({ label: x.label, value: x.label })));
    const selectedDb = dbOptions.find((x) => x.label === selectedDbLabel) || { type: "postgres", template: "modular-api-db", path: "infra/local/postgres/modular-api-db" };
    const dbDefaultName = `platform_${config.name.replace(/-/g, "_")}`;
    const dbName = await ask(rl, `${color("DB name", ANSI.blue)} [${dbDefaultName}]: `);
    config.db = {
      provider: selectedDb.type,
      name: dbName || dbDefaultName,
      migrateCommand: "pnpm run db:migrate",
      mode: "existing",
      existingStack: selectedDb.template,
      templatePath: selectedDb.path,
      createNow: false,
      startNow: false
    };
    config.testing = "ambos";
  }

  if (action === "new:db") {
    config.provider = await askMenu(rl, "DB provider", [{ label: "postgres", value: "postgres" }]);
    config.schema = (await ask(rl, `${color("Schema", ANSI.blue)} [public]: `)) || "public";
    config.seed = (await ask(rl, `${color("Seed", ANSI.blue)} [default]: `)) || "default";
  }

  if (action === "new:package") {
    config.kind = await askMenu(rl, "Tipo de package", [
      { label: "library", value: "library" },
      { label: "service", value: "service" },
      { label: "shared", value: "shared" }
    ]);
    config.scope = (await ask(rl, `${color("Scope", ANSI.blue)} [@platform]: `)) || "@platform";
  }

  if (action === "new:template") {
    config.layer = await askMenu(rl, "Capa de template", [
      { label: "front", value: "front" },
      { label: "back", value: "back" },
      { label: "legacy", value: "legacy" }
    ]);
    const defaultBase = config.layer === "back"
      ? "core/templates/modular-api-boilerplate"
      : "core/templates/react-app-boilerplate";
    config.base = (await ask(rl, `${color("Base template", ANSI.blue)} [${defaultBase}]: `)) || defaultBase;
  }

  if (action === "new:p2t") {
    const sourceType = await askMenu(rl, "Fuente de origen", [
      { label: "Ruta local", value: "local" },
      { label: "Repo git", value: "repo" }
    ]);
    if (sourceType === "local") {
      config.projectPath = await ask(rl, `${color("Ruta local del proyecto", ANSI.blue)}: `);
    } else {
      config.repoUrl = await ask(rl, `${color("URL del repo git", ANSI.blue)}: `);
    }
    config.target = (await ask(rl, `${color("Target", ANSI.blue)} [core/templates]: `)) || "core/templates";
  }

  return config;
}

function runCli(action, config) {
  const tempFile = path.join(os.tmpdir(), `platform-orchestrator-${Date.now()}.json`);
  fs.writeFileSync(tempFile, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  const command = `node "tools/platform-orchestrator/cli.js" ${action} "${tempFile}" --confirm`;
  childProcess.execSync(command, { stdio: "inherit" });
  fs.unlinkSync(tempFile);
}

async function main() {
  const rl = createRl();
  try {
    process.stdout.write(`${color("Atajos", ANSI.dim)}: Enter para confirmar opciones numericas.\n\n`);
    let first = process.env.PLATFORM_ORCHESTRATOR_ACTION || "";
    if (!first) {
      renderTabs(0, "Selecciona el tipo de creacion o usa texto libre.");
      first = await askMenu(rl, "Que quieres crear", [
        { label: "MVP", value: "new:mvp" },
        { label: "DB", value: "new:db" },
        { label: "Package", value: "new:package" },
        { label: "Template", value: "new:template" },
        { label: "Project to Template (p2t)", value: "new:p2t" },
        { label: "Describir en texto libre", value: "__text__" }
      ]);
    }

    let action = first;
    let baseConfig = {};
    let autoImplement = false;
    let implementRequirement = "";

    if (first === "__text__") {
      renderTabs(0, "Modo texto libre: describe objetivo, stack y alcance.");
      const text = await ask(rl, `${color("Describe lo que quieres crear", ANSI.blue)}: `);
      const proposal = parseTextToProposal(text);
      action = proposal.action;
      baseConfig = { ...proposal.config };
      autoImplement = Boolean(proposal.meta?.autoImplement);
      implementRequirement = proposal.meta?.requirement || "";
      process.stdout.write(`\n${color("Interpretacion", ANSI.bold)}: ${color(action, ANSI.cyan)}\n`);
      process.stdout.write(`${color("Confianza action", ANSI.dim)}: ${proposal.confidence.action}\n`);
    }

    renderTabs(1, `Definir nombre para ${action}.`);
    const suggestions = action === "new:mvp" ? [baseConfig.name || nextMvpName(process.cwd()), "patients-mvp", "clinical-mvp"] : getNameSuggestions(action, baseConfig.name || "example-item");
    const name = await askName(rl, action, suggestions);
    const config = { ...baseConfig, name };

    renderTabs(2, "Completar configuracion segun el tipo seleccionado.");
    await gatherByAction(rl, action, config);

    renderTabs(5, "Revisar resumen final y confirmar.");
    process.stdout.write(`${color("Resumen final", ANSI.bold)}\n`);
    process.stdout.write(`${color(JSON.stringify({ action, ...config }, null, 2), ANSI.yellow)}\n`);
    if (action === "new:mvp" && autoImplement) {
      process.stdout.write(`${color("Post-step", ANSI.bold)} ${color("implement:mvp habilitado por texto libre", ANSI.green)}\n`);
    }
    process.stdout.write(`${color("Estructura a crear", ANSI.bold)}\n`);
    previewStructure(action, config).forEach((line) => {
      process.stdout.write(`${color(`- ${line}`, ANSI.gray)}\n`);
    });
    const confirm = await askMenu(rl, "Confirma accion", [
      { label: "Ejecutar", value: "run" },
      { label: "Cancelar", value: "cancel" }
    ]);

    if (confirm === "run") {
      process.stdout.write(`\n${color("Ejecutando...", ANSI.green)}\n`);
      runCli(action, config);
      if (action === "new:mvp" && autoImplement) {
        process.stdout.write(`${color("\nGenerando plan de implementacion (implement:mvp)...", ANSI.cyan)}\n`);
        runCli("implement:mvp", {
          name: config.name,
          requirement: implementRequirement || `Implementar requerimiento funcional para ${config.name}`,
          phases: 3,
          phase: 0
        });
      }
    } else {
      process.stdout.write(`${color("Cancelado por usuario.", ANSI.red)}\n`);
    }
  } finally {
    rl.close();
  }
}

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});
