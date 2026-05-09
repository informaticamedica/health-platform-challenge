#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");
const childProcess = require("node:child_process");

const ALLOWED_ACTIONS = new Set([
  "new:mvp",
  "new:db",
  "new:package",
  "new:template",
  "new:p2t"
]);

function parseArgs(argv) {
  const args = { action: "", config: "", name: "", projectPath: "", repoUrl: "", mode: "headless" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!args.action && token.startsWith("new:")) {
      args.action = token;
      continue;
    }
    if (token === "--action") args.action = argv[i + 1] || "";
    if (token === "--name") args.name = argv[i + 1] || "";
    if (token === "--config") args.config = argv[i + 1] || "";
    if (token === "--input") args.config = argv[i + 1] || "";
    if (token === "--project-path") args.projectPath = argv[i + 1] || "";
    if (token === "--repo-url") args.repoUrl = argv[i + 1] || "";
    if (token === "--mode") args.mode = argv[i + 1] || "headless";
    if (!token.startsWith("-") && !args.config && i > 0) {
      args.config = token;
    }
  }
  return args;
}

function readJsonSafe(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function fileExists(p) {
  return fs.existsSync(p);
}

function ensureDir(p) {
  if (!fileExists(p)) fs.mkdirSync(p, { recursive: true });
}

function writeFile(p, content) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, `${content.endsWith("\n") ? content : `${content}\n`}`, "utf8");
}

function copyDir(source, target, options = {}) {
  const ignored = new Set(options.ignore || []);
  ensureDir(target);
  const entries = fs.readdirSync(source, { withFileTypes: true });
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to, options);
    } else {
      ensureDir(path.dirname(to));
      fs.copyFileSync(from, to);
    }
  }
}

function resolveConfig(rootDir, configPath) {
  if (!configPath) return {};
  const absolute = path.isAbsolute(configPath) ? configPath : path.resolve(rootDir, configPath);
  if (!fileExists(absolute)) {
    throw new Error(`Config no encontrado: ${configPath}`);
  }
  return readJsonSafe(absolute);
}

function normalizeArray(values) {
  return Array.from(new Set((values || []).map((x) => String(x).trim()).filter(Boolean))).sort();
}

function normalizeInput(action, input) {
  const normalized = { action };
  if (action === "new:mvp") {
    normalized.name = String(input.name || "").trim();
    normalized.scope = String(input.scope || "ambos").trim();
    normalized.templateFront = String(input.templateFront || "core/templates/react-app-boilerplate").trim();
    normalized.templateBack = String(input.templateBack || "core/templates/node-api-boilerplate").trim();
    normalized.packagesFront = normalizeArray(input.packagesFront || ["@platform/design-system", "@platform/contracts"]);
    normalized.packagesBack = normalizeArray(input.packagesBack || ["@platform/config", "@platform/contracts", "@platform/fhir", "@platform/logger", "@platform/middleware"]);
    normalized.db = {
      provider: String(input.db?.provider || "postgres").trim(),
      name: String(input.db?.name || "").trim(),
      migrateCommand: String(input.db?.migrateCommand || "pnpm run db:migrate").trim()
    };
    normalized.testing = String(input.testing || "ambos").trim();
  }
  if (action === "new:db") {
    normalized.name = String(input.name || "").trim();
    normalized.provider = String(input.provider || "postgres").trim();
    normalized.schema = String(input.schema || "public").trim();
    normalized.seed = String(input.seed || "default").trim();
  }
  if (action === "new:package") {
    normalized.name = String(input.name || "").trim();
    normalized.kind = String(input.kind || "library").trim();
    normalized.scope = String(input.scope || "@platform").trim();
  }
  if (action === "new:template") {
    normalized.name = String(input.name || "").trim();
    normalized.layer = String(input.layer || "front").trim();
    normalized.base = String(input.base || "").trim();
  }
  if (action === "new:p2t") {
    normalized.name = String(input.name || "").trim();
    normalized.repoUrl = String(input.repoUrl || "").trim();
    normalized.projectPath = String(input.projectPath || "").trim();
    normalized.target = String(input.target || "core/templates").trim();
  }
  return normalized;
}

function preflight(rootDir, normalized) {
  const errors = [];
  const warnings = [];
  if (!ALLOWED_ACTIONS.has(normalized.action)) {
    errors.push(`Accion no soportada: ${normalized.action}`);
  }
  if (normalized.action === "new:mvp") {
    const kebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!kebab.test(normalized.name)) errors.push("name debe estar en kebab-case");
    if (normalized.name) {
      const target = path.resolve(rootDir, "mvp", normalized.name);
      if (fileExists(target)) errors.push(`Ya existe: mvp/${normalized.name}`);
    }
  }
  if (normalized.action === "new:db") {
    if (normalized.provider !== "postgres") errors.push("new:db soporta solo postgres");
    if (!normalized.name) errors.push("name es obligatorio");
  }
  if (normalized.action === "new:package") {
    if (!normalized.name) errors.push("name es obligatorio");
    const packagePath = path.resolve(rootDir, "core", "packages", normalized.name);
    if (fileExists(packagePath)) errors.push(`Ya existe: core/packages/${normalized.name}`);
  }
  if (normalized.action === "new:template") {
    if (!normalized.name) errors.push("name es obligatorio");
    const templatePath = path.resolve(rootDir, "core", "templates", normalized.name);
    if (fileExists(templatePath)) errors.push(`Ya existe: core/templates/${normalized.name}`);
    if (!normalized.base) warnings.push("base vacio: se crea template sin base inicial");
  }
  if (normalized.action === "new:p2t") {
    if (!normalized.name) errors.push("name es obligatorio");
    if (!normalized.repoUrl && !normalized.projectPath) {
      errors.push("new:p2t requiere --repo-url o --project-path");
    }
    const target = path.resolve(rootDir, "core", "templates", normalized.name);
    if (fileExists(target)) errors.push(`Ya existe: core/templates/${normalized.name}`);
    if (normalized.projectPath) {
      const absolute = path.isAbsolute(normalized.projectPath)
        ? normalized.projectPath
        : path.resolve(rootDir, normalized.projectPath);
      if (!fileExists(absolute)) errors.push(`projectPath no existe: ${normalized.projectPath}`);
    }
  }
  return { ok: errors.length === 0, errors, warnings };
}

function scanProject(projectPath) {
  const findings = {
    hasPackageJson: false,
    hasDockerCompose: false,
    hasNodeBackendHints: false,
    hasReactFrontHints: false,
    hasDbHints: false,
    reusableCandidates: []
  };

  const packageJson = path.join(projectPath, "package.json");
  const dockerCompose = path.join(projectPath, "docker-compose.yml");
  findings.hasPackageJson = fileExists(packageJson);
  findings.hasDockerCompose = fileExists(dockerCompose);

  if (findings.hasPackageJson) {
    try {
      const pkg = readJsonSafe(packageJson);
      const deps = Object.assign({}, pkg.dependencies || {}, pkg.devDependencies || {});
      const keys = Object.keys(deps);
      findings.hasNodeBackendHints = keys.includes("express") || keys.includes("fastify");
      findings.hasReactFrontHints = keys.includes("react") || keys.includes("next");
      if (keys.includes("pg") || keys.includes("prisma")) findings.hasDbHints = true;
      if (keys.includes("react")) findings.reusableCandidates.push("front-template");
      if (keys.includes("express") || keys.includes("fastify")) findings.reusableCandidates.push("back-template");
    } catch (_error) {
      findings.reusableCandidates.push("manual-package-json-review");
    }
  }

  const sqlDir = path.join(projectPath, "sql");
  if (fileExists(sqlDir)) {
    findings.hasDbHints = true;
    findings.reusableCandidates.push("db-template");
  }

  return findings;
}

function buildExecutionPlan(rootDir, normalized, pf) {
  const plan = [];
  const outDir = path.resolve(rootDir, "ops", "plans");
  plan.push("Resolver skill por accion new:*");
  plan.push("Validar input contra contrato canonico");
  plan.push("Ejecutar preflight estricto");
  if (normalized.action === "new:p2t") {
    plan.push("Analizar proyecto origen y mapear artefactos reutilizables");
    plan.push("Proponer estructura de template y reglas de parametrizacion");
  }
  plan.push("Persistir plan determinista para auditoria");
  return { steps: plan, outDir, preflight: pf };
}

function executeNewDb(rootDir, input) {
  const target = path.resolve(rootDir, "infra", "local", "postgres", input.name);
  const postgresRoot = path.resolve(rootDir, "infra", "local", "postgres");
  const dbCount = fs.readdirSync(postgresRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).length;
  const dbPort = 55440 + dbCount;
  ensureDir(target);
  ensureDir(path.join(target, "sql"));
  ensureDir(path.join(target, "seed", input.seed));

  writeFile(
    path.join(target, "docker-compose.yml"),
    [
      "services:",
      `  ${input.name}:`,
      "    image: postgres:16",
      "    restart: unless-stopped",
      `    container_name: ${input.name}`,
      "    environment:",
      "      POSTGRES_USER: soc",
      "      POSTGRES_PASSWORD: soc",
      `      POSTGRES_DB: ${input.name.replace(/-/g, "_")}`,
      "    ports:",
      `      - \"${dbPort}:5432\"`,
      "    volumes:",
      "      - ./sql:/docker-entrypoint-initdb.d/00_schema",
      `      - ./seed/${input.seed}:/docker-entrypoint-initdb.d/10_seed`
    ].join("\n")
  );

  writeFile(
    path.join(target, "sql", "01_schema.sql"),
    [
      `CREATE SCHEMA IF NOT EXISTS ${input.schema};`,
      "",
      `CREATE TABLE IF NOT EXISTS ${input.schema}.health_check (`,
      "  id SERIAL PRIMARY KEY,",
      "  status TEXT NOT NULL DEFAULT 'ok',",
      "  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
      ");"
    ].join("\n")
  );

  writeFile(
    path.join(target, "seed", input.seed, "zz_seed_health_check.sql"),
    [
      `INSERT INTO ${input.schema}.health_check(status) VALUES ('seeded')`,
      "ON CONFLICT DO NOTHING;"
    ].join("\n")
  );

  writeFile(
    path.join(target, "package.json"),
    JSON.stringify(
      {
        name: input.name,
        version: "0.1.0",
        private: true,
        scripts: {
          up: "docker compose up -d",
          down: "docker compose down",
          reset: "docker compose down -v; if ($?) { docker compose up -d }"
        }
      },
      null,
      2
    )
  );

  writeFile(
    path.join(target, "README.md"),
    [
      `# ${input.name}`,
      "",
      "Stack PostgreSQL local con schema y seed.",
      "",
      "## Scripts",
      "",
      "- `pnpm run up`",
      "- `pnpm run down`",
      "- `pnpm run reset`"
    ].join("\n")
  );

  return { target: path.relative(rootDir, target), dbPort };
}

function executeNewPackage(rootDir, input) {
  const target = path.resolve(rootDir, "core", "packages", input.name);
  ensureDir(path.join(target, "src"));
  ensureDir(path.join(target, ".agents"));
  writeFile(path.join(target, "src", "index.ts"), "export const healthPlatform = true;");
  writeFile(
    path.join(target, "package.json"),
    JSON.stringify(
      {
        name: `${input.scope}/${input.name}`,
        version: "0.1.0",
        private: true,
        main: "dist/index.js",
        types: "dist/index.d.ts",
        scripts: {
          build: "tsc -p tsconfig.json",
          test: "node -e \"console.log('no tests yet')\""
        }
      },
      null,
      2
    )
  );
  writeFile(
    path.join(target, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2020",
          module: "CommonJS",
          declaration: true,
          outDir: "dist",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true
        },
        include: ["src/**/*"]
      },
      null,
      2
    )
  );
  writeFile(path.join(target, "README.md"), `# ${input.name}\n\nPackage generado por new:package.`);
  writeFile(path.join(target, ".agents", "README.md"), "# Skills\n\nEste package se integra via packages-integration-bridge.");
  return { target: path.relative(rootDir, target) };
}

function executeNewTemplate(rootDir, input) {
  const target = path.resolve(rootDir, "core", "templates", input.name);
  ensureDir(target);
  if (input.base) {
    const base = path.isAbsolute(input.base) ? input.base : path.resolve(rootDir, input.base);
    if (fileExists(base)) {
      copyDir(base, target, { ignore: ["node_modules", "dist"] });
    }
  }
  if (!fileExists(path.join(target, "README.md"))) {
    writeFile(path.join(target, "README.md"), `# ${input.name}\n\nTemplate generado por new:template (${input.layer}).`);
  }
  ensureDir(path.join(target, ".agents"));
  if (!fileExists(path.join(target, ".agents", "README.md"))) {
    writeFile(path.join(target, ".agents", "README.md"), "# Skills\n\nTemplate gobernado por skills de scaffold.");
  }
  return { target: path.relative(rootDir, target), fromBase: Boolean(input.base) };
}

function executeNewMvp(rootDir, input) {
  const mvpRoot = path.resolve(rootDir, "mvp", input.name);
  ensureDir(mvpRoot);
  const created = [];
  if (input.scope !== "back") {
    const frontTarget = path.join(mvpRoot, `${input.name}-front`);
    const frontBase = path.resolve(rootDir, input.templateFront);
    copyDir(frontBase, frontTarget, { ignore: ["node_modules", "dist"] });
    created.push(path.relative(rootDir, frontTarget));
  }
  if (input.scope !== "front") {
    const backTarget = path.join(mvpRoot, `${input.name}-back`);
    const backBase = path.resolve(rootDir, input.templateBack);
    copyDir(backBase, backTarget, { ignore: ["node_modules", "dist"] });
    created.push(path.relative(rootDir, backTarget));
  }
  writeFile(
    path.join(mvpRoot, "package.json"),
    JSON.stringify(
      {
        name: input.name,
        private: true,
        scripts: {
          "install:all": "pnpm -r install",
          "build:all": "pnpm -r run build",
          "dev:front": `pnpm --filter ./${input.name}-front run dev`,
          "dev:back": `pnpm --filter ./${input.name}-back run dev`,
          "db:migrate": input.db.migrateCommand
        }
      },
      null,
      2
    )
  );
  writeFile(path.join(mvpRoot, "README.md"), `# ${input.name}\n\nMVP generado por new:mvp.`);
  return { target: path.relative(rootDir, mvpRoot), created };
}

function executeNewP2T(rootDir, input) {
  let sourcePath = "";
  let tempPath = "";
  if (input.projectPath) {
    sourcePath = path.isAbsolute(input.projectPath) ? input.projectPath : path.resolve(rootDir, input.projectPath);
  } else {
    tempPath = fs.mkdtempSync(path.join(os.tmpdir(), "platform-p2t-"));
    sourcePath = path.join(tempPath, "repo");
    childProcess.execSync(`git clone "${input.repoUrl}" "${sourcePath}"`, { stdio: "pipe" });
  }

  const findings = scanProject(sourcePath);
  const target = path.resolve(rootDir, "core", "templates", input.name);
  ensureDir(target);
  writeFile(path.join(target, "PROMOTION_PLAN.json"), JSON.stringify({ sourcePath, findings }, null, 2));
  writeFile(
    path.join(target, "README.md"),
    [
      `# ${input.name}`,
      "",
      "Template generado desde proyecto origen con new:p2t.",
      "",
      "Ver detalles en `PROMOTION_PLAN.json`."
    ].join("\n")
  );

  if (tempPath && fileExists(tempPath)) {
    fs.rmSync(tempPath, { recursive: true, force: true });
  }
  return { target: path.relative(rootDir, target), findings };
}

function executeAction(rootDir, normalized) {
  if (normalized.action === "new:db") return executeNewDb(rootDir, normalized);
  if (normalized.action === "new:package") return executeNewPackage(rootDir, normalized);
  if (normalized.action === "new:template") return executeNewTemplate(rootDir, normalized);
  if (normalized.action === "new:mvp") return executeNewMvp(rootDir, normalized);
  if (normalized.action === "new:p2t") return executeNewP2T(rootDir, normalized);
  return null;
}

function main() {
  const rootDir = process.cwd();
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.action) {
    throw new Error("Debes indicar accion new:* (ej: new:mvp)");
  }

  const inputFileConfig = resolveConfig(rootDir, parsed.config);
  const mergedInput = {
    ...inputFileConfig,
    name: parsed.name || inputFileConfig.name,
    projectPath: parsed.projectPath || inputFileConfig.projectPath,
    repoUrl: parsed.repoUrl || inputFileConfig.repoUrl
  };

  const normalized = normalizeInput(parsed.action, mergedInput);
  const pf = preflight(rootDir, normalized);
  const plan = buildExecutionPlan(rootDir, normalized, pf);

  let analysis = null;
  if (pf.ok && normalized.action === "new:p2t" && normalized.projectPath) {
    const absolute = path.isAbsolute(normalized.projectPath)
      ? normalized.projectPath
      : path.resolve(rootDir, normalized.projectPath);
    analysis = scanProject(absolute);
  }

  const executionResult = pf.ok ? executeAction(rootDir, normalized) : null;

  const report = {
    version: 1,
    mode: parsed.mode,
    action: parsed.action,
    normalizedInput: normalized,
    preflight: pf,
    execution: plan,
    analysis,
    executionResult,
    next: pf.ok
      ? "Ejecucion completada. Revisar artefactos y validar build/tests."
      : "Corregi errores de preflight y reintenta."
  };

  const plansDir = path.resolve(rootDir, "ops", "plans");
  if (!fileExists(plansDir)) fs.mkdirSync(plansDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = path.resolve(plansDir, `${parsed.action.replace(":", "-")}.${stamp}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  process.stdout.write(`\nPlan guardado en: ${path.relative(rootDir, filePath)}\n`);
  if (!pf.ok) process.exitCode = 2;
}

try {
  main();
} catch (error) {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
}
