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
  "new:p2t",
  "implement:mvp"
]);

function parseArgs(argv) {
  const args = { action: "", config: "", name: "", projectPath: "", repoUrl: "", mode: "headless", confirm: false, approvePhase: 0, phase: 0, phases: 0, requirement: "" };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!args.action && (token.startsWith("new:") || token.startsWith("implement:"))) {
      args.action = token;
      continue;
    }
    if (token === "--action") {
      args.action = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--name") {
      args.name = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--config" || token === "--input") {
      args.config = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--project-path") {
      args.projectPath = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--repo-url") {
      args.repoUrl = argv[i + 1] || "";
      i += 1;
      continue;
    }
    if (token === "--mode") {
      args.mode = argv[i + 1] || "headless";
      i += 1;
      continue;
    }
    if (token === "--confirm") {
      args.confirm = true;
      continue;
    }
    if (token === "--approve-phase") {
      args.approvePhase = Number(argv[i + 1] || 0);
      i += 1;
      continue;
    }
    if (token === "--phase") {
      args.phase = Number(argv[i + 1] || 0);
      i += 1;
      continue;
    }
    if (token === "--phases") {
      args.phases = Number(argv[i + 1] || 0);
      i += 1;
      continue;
    }
    if (token === "--requirement") {
      args.requirement = argv[i + 1] || "";
      i += 1;
      continue;
    }
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

function readFileSafe(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return String(hash);
}

function listFilesRecursive(rootDir, relativeBase = "") {
  const base = path.resolve(rootDir, relativeBase);
  if (!fileExists(base)) return [];
  const results = [];
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === "dist" || entry.name === ".git") continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else results.push(path.relative(rootDir, full).replace(/\\/g, "/"));
    }
  }
  walk(base);
  return results.sort();
}

function readJsonIfExists(filePath, fallback) {
  if (!fileExists(filePath)) return fallback;
  try {
    return readJsonSafe(filePath);
  } catch (_error) {
    return fallback;
  }
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
      migrateCommand: String(input.db?.migrateCommand || "pnpm run db:migrate").trim(),
      mode: String(input.db?.mode || "existing").trim(),
      existingStack: String(input.db?.existingStack || "soc-db-source").trim(),
      createNow: Boolean(input.db?.createNow || false),
      startNow: Boolean(input.db?.startNow || false)
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
  if (action === "implement:mvp") {
    normalized.name = String(input.name || "").trim();
    normalized.requirement = String(input.requirement || "").trim();
    normalized.phases = Number(input.phases || 3);
    normalized.phase = Number(input.phase || 0);
    normalized.approvePhase = Number(input.approvePhase || 0);
  }
  return normalized;
}

function getExistingDbPreset(name) {
  if (name === "modular-api-db") {
    return { host: "localhost", port: "55434", user: "modular", password: "modular", dbName: "modular_dev", ssl: "false", sslRejectUnauthorized: "false" };
  }
  return { host: "localhost", port: "55433", user: "soc", password: "soc", dbName: "soc", ssl: "true", sslRejectUnauthorized: "false" };
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
      const existingNames = collectPackageNames(rootDir);
      const candidateFront = `@platform/${safePackageName(normalized.name)}-front`;
      const candidateBack = `@platform/${safePackageName(normalized.name)}-back`;
      if (normalized.scope !== "back" && existingNames.has(candidateFront)) {
        errors.push(`Conflicto de package name: ${candidateFront}`);
      }
      if (normalized.scope !== "front" && existingNames.has(candidateBack)) {
        errors.push(`Conflicto de package name: ${candidateBack}`);
      }
    }
    if (normalized.db.mode !== "existing" && normalized.db.mode !== "new") {
      errors.push("db.mode debe ser 'existing' o 'new'");
    }
    if (normalized.db.mode === "existing" && !normalized.db.existingStack) {
      errors.push("db.existingStack es obligatorio cuando db.mode=existing");
    }
    if ((normalized.db.createNow || normalized.db.startNow) && normalized.db.provider !== "postgres") {
      errors.push("createNow/startNow solo soportado para postgres");
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
  if (normalized.action === "implement:mvp") {
    if (!normalized.name) errors.push("name es obligatorio");
    const mvpPath = path.resolve(rootDir, "mvp", normalized.name);
    if (!fileExists(mvpPath)) errors.push(`No existe MVP: mvp/${normalized.name}`);
    if (!normalized.requirement) warnings.push("requirement vacio: se creara plan generico");
    if (normalized.phases < 2 || normalized.phases > 3) warnings.push("phases recomendado entre 2 y 3");
    if (normalized.approvePhase < 0 || normalized.approvePhase > 3) errors.push("approvePhase invalida");
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

function collectPackageNames(rootDir) {
  const roots = [
    path.resolve(rootDir, "core", "templates"),
    path.resolve(rootDir, "core", "packages"),
    path.resolve(rootDir, "mvp")
  ];
  const names = new Set();

  function walk(dirPath, depth) {
    if (!fileExists(dirPath) || depth > 5) return;
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") continue;
        walk(full, depth + 1);
      } else if (entry.name === "package.json") {
        try {
          const pkg = readJsonSafe(full);
          if (pkg && pkg.name) names.add(String(pkg.name));
        } catch (_error) {
          // ignore invalid package json
        }
      }
    }
  }

  roots.forEach((root) => walk(root, 0));
  return names;
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
  if (normalized.action === "implement:mvp") {
    plan.push("Analizar requerimiento funcional en modo plan-first");
    plan.push("Generar IMPLEMENTATION_PLAN.md en 2-3 fases");
    plan.push("Ejecutar solo una fase por iteracion y esperar feedback");
  }
  plan.push("Persistir plan determinista para auditoria");
  return { steps: plan, outDir, preflight: pf };
}

function buildStructurePreview(normalized) {
  if (normalized.action === "new:mvp") {
    const lines = [`mvp/${normalized.name}/`];
    if (normalized.scope !== "back") lines.push(`mvp/${normalized.name}/${normalized.name}-front/`);
    if (normalized.scope !== "front") lines.push(`mvp/${normalized.name}/${normalized.name}-back/`);
    lines.push(`mvp/${normalized.name}/package.json`);
    lines.push(`mvp/${normalized.name}/README.md`);
    if (normalized.db.mode === "new" && normalized.db.createNow) {
      lines.push(`infra/local/postgres/${(normalized.db.name || `${normalized.name}-db`).replace(/_/g, "-")}/`);
    }
    return lines;
  }
  if (normalized.action === "new:db") {
    return [
      `infra/local/postgres/${normalized.name}/docker-compose.yml`,
      `infra/local/postgres/${normalized.name}/sql/01_schema.sql`,
      `infra/local/postgres/${normalized.name}/seed/${normalized.seed}/zz_seed_health_check.sql`,
      `infra/local/postgres/${normalized.name}/package.json`,
      `infra/local/postgres/${normalized.name}/README.md`
    ];
  }
  if (normalized.action === "new:package") {
    return [
      `core/packages/${normalized.name}/src/index.ts`,
      `core/packages/${normalized.name}/package.json`,
      `core/packages/${normalized.name}/tsconfig.json`,
      `core/packages/${normalized.name}/README.md`,
      `core/packages/${normalized.name}/.agents/README.md`
    ];
  }
  if (normalized.action === "new:template") {
    return [
      `core/templates/${normalized.name}/`,
      `core/templates/${normalized.name}/README.md`,
      `core/templates/${normalized.name}/.agents/README.md`
    ];
  }
  if (normalized.action === "new:p2t") {
    return [
      `core/templates/${normalized.name}/PROMOTION_PLAN.json`,
      `core/templates/${normalized.name}/README.md`
    ];
  }
  if (normalized.action === "implement:mvp") {
    return [
      `mvp/${normalized.name}/IMPLEMENTATION_PLAN.md`,
      `mvp/${normalized.name}/.orchestrator/state.json`,
      `mvp/${normalized.name}/.orchestrator/reports/phase-*.json`
    ];
  }
  return [];
}

function safePackageName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9-]/g, "-");
}

function rewritePackageNameIfExists(dirPath, packageName) {
  const pkgPath = path.join(dirPath, "package.json");
  if (!fileExists(pkgPath)) return false;
  const pkg = readJsonSafe(pkgPath);
  pkg.name = packageName;
  writeFile(pkgPath, JSON.stringify(pkg, null, 2));
  return true;
}

function computeMvpStructure(input) {
  const lines = [`mvp/${input.name}/`];
  if (input.scope !== "back") lines.push(`mvp/${input.name}/${input.name}-front/`);
  if (input.scope !== "front") lines.push(`mvp/${input.name}/${input.name}-back/`);
  lines.push(`mvp/${input.name}/package.json`);
  lines.push(`mvp/${input.name}/README.md`);
  return lines;
}

function buildMvpStateRoot(rootDir, name) {
  return path.resolve(rootDir, "mvp", name, ".orchestrator");
}

function buildMvpStatePath(rootDir, name) {
  return path.join(buildMvpStateRoot(rootDir, name), "state.json");
}

function writeMvpState(rootDir, name, state) {
  const statePath = buildMvpStatePath(rootDir, name);
  writeFile(statePath, JSON.stringify(state, null, 2));
  return statePath;
}

function readMvpState(rootDir, name) {
  const statePath = buildMvpStatePath(rootDir, name);
  return readJsonIfExists(statePath, null);
}

function getMvpTemplateRequiredFiles(rootDir, templatePath) {
  const files = listFilesRecursive(rootDir, templatePath);
  return files
    .filter((x) => !x.endsWith("README.md"))
    .map((x) => x.replace(`${templatePath.replace(/\\/g, "/")}/`, ""));
}

function verifyMvpScaffold(rootDir, name, state) {
  const mvpRoot = path.resolve(rootDir, "mvp", name);
  const failures = [];
  const checks = [];

  function verifySide(sideKey, sideFolder) {
    const side = state.scaffold[sideKey];
    if (!side || !side.enabled) return;
    const sideRoot = path.join(mvpRoot, sideFolder);
    if (!fileExists(sideRoot)) {
      failures.push(`${sideFolder} no existe`);
      return;
    }
    const required = side.requiredFiles || [];
    let present = 0;
    required.forEach((rel) => {
      const full = path.join(sideRoot, rel);
      if (fileExists(full)) present += 1;
      else failures.push(`Falta ${sideFolder}/${rel}`);
    });
    checks.push({ side: sideKey, required: required.length, present });
    const pkgPath = path.join(sideRoot, "package.json");
    if (!fileExists(pkgPath)) failures.push(`Falta ${sideFolder}/package.json`);
    else {
      const pkg = readJsonSafe(pkgPath);
      if (!String(pkg.name || "").startsWith("@platform/")) {
        failures.push(`package name invalido en ${sideFolder}: ${pkg.name || ""}`);
      }
    }
  }

  verifySide("front", `${name}-front`);
  verifySide("back", `${name}-back`);

  const rootPkgPath = path.join(mvpRoot, "package.json");
  if (!fileExists(rootPkgPath)) {
    failures.push("Falta mvp/<name>/package.json");
  } else {
    const pkg = readJsonSafe(rootPkgPath);
    const scripts = pkg.scripts || {};
    if (state.scope === "ambos" && !scripts.dev) failures.push("Falta script dev conjunto en package root");
    if (state.scope !== "back" && !scripts["dev:front"]) failures.push("Falta script dev:front");
    if (state.scope !== "front" && !scripts["dev:back"]) failures.push("Falta script dev:back");
  }

  return {
    ok: failures.length === 0,
    checks,
    failures
  };
}

function createBaselineSnapshot(rootDir, name) {
  const mvpRoot = path.resolve(rootDir, "mvp", name);
  const files = listFilesRecursive(rootDir, path.relative(rootDir, mvpRoot));
  const snapshot = {};
  files.forEach((fileRel) => {
    const abs = path.resolve(rootDir, fileRel);
    try {
      const content = readFileSafe(abs);
      snapshot[fileRel] = hashText(content);
    } catch (_error) {
      snapshot[fileRel] = "binary-or-unreadable";
    }
  });
  return snapshot;
}

function diffFromBaseline(rootDir, baseline) {
  const changed = [];
  Object.keys(baseline).forEach((fileRel) => {
    if (!fileExists(path.resolve(rootDir, fileRel))) {
      changed.push({ file: fileRel, kind: "deleted" });
      return;
    }
    const nowHash = hashText(readFileSafe(path.resolve(rootDir, fileRel)));
    if (nowHash !== baseline[fileRel]) changed.push({ file: fileRel, kind: "modified" });
  });
  return changed;
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

  return {
    target: path.relative(rootDir, target),
    dbPort,
    commands: {
      up: `npm --prefix ${path.relative(rootDir, target)} run up`,
      down: `npm --prefix ${path.relative(rootDir, target)} run down`,
      reset: `npm --prefix ${path.relative(rootDir, target)} run reset`
    }
  };
}

function isDockerAvailable() {
  try {
    childProcess.execSync("docker info", { stdio: "pipe" });
    return true;
  } catch (_error) {
    return false;
  }
}

function startExistingDbStack(rootDir, stackName) {
  const stackDir = path.resolve(rootDir, "infra", "local", "postgres", stackName);
  if (!fileExists(stackDir)) {
    throw new Error(`Stack DB inexistente: infra/local/postgres/${stackName}`);
  }
  childProcess.execSync("docker compose up -d --build", { cwd: stackDir, stdio: "pipe" });
  return path.relative(rootDir, stackDir);
}

function writeBackendEnvFiles(mvpRoot, mvpName, dbConfig) {
  const backDir = path.join(mvpRoot, `${mvpName}-back`);
  const envContent = [
    `DB_USER=${dbConfig.user}`,
    `DB_HOST=${dbConfig.host}`,
    `DB_NAME=${dbConfig.dbName}`,
    `DB_PASSWORD=${dbConfig.password}`,
    `DB_PORT=${dbConfig.port}`,
    `DB_SSL=${dbConfig.ssl}`,
    `DB_SSL_REJECT_UNAUTHORIZED=${dbConfig.sslRejectUnauthorized}`,
    "PORT=3000",
    "JWT_SECRET=secret"
  ].join("\n");
  writeFile(path.join(backDir, ".env"), envContent);
  writeFile(path.join(backDir, ".env.example"), envContent);
}

function runScopedPnpmInstall(rootDir, mvpName, scope) {
  const filters = [];
  if (scope !== "back") filters.push(`--filter @platform/${safePackageName(mvpName)}-front`);
  if (scope !== "front") filters.push(`--filter @platform/${safePackageName(mvpName)}-back`);
  const command = `pnpm -C ../.. install ${filters.join(" ")}`.trim();
  const mvpRoot = path.resolve(rootDir, "mvp", mvpName);
  try {
    childProcess.execSync(command, { cwd: mvpRoot, stdio: "pipe" });
    return { ok: true, command, fallbackUsed: false };
  } catch (error) {
    const stdout = error.stdout ? String(error.stdout) : "";
    const stderr = error.stderr ? String(error.stderr) : "";
    const output = `${stdout}\n${stderr}`;
    if (output.includes("No projects matched the filters")) {
      const fallbackCommand = "pnpm -C ../.. install";
      childProcess.execSync(fallbackCommand, { cwd: mvpRoot, stdio: "pipe" });
      return { ok: true, command: fallbackCommand, fallbackUsed: true };
    }
    throw error;
  }
}

function collectWorkspaceDepsToBuild(rootDir, mvpRoot, mvpName, scope) {
  const depNames = new Set();
  const packageFiles = [];
  if (scope !== "back") packageFiles.push(path.join(mvpRoot, `${mvpName}-front`, "package.json"));
  if (scope !== "front") packageFiles.push(path.join(mvpRoot, `${mvpName}-back`, "package.json"));
  for (const pkgPath of packageFiles) {
    const pkg = readJsonIfExists(pkgPath, {});
    const sections = [pkg.dependencies || {}, pkg.devDependencies || {}];
    for (const section of sections) {
      for (const [dep, version] of Object.entries(section)) {
        if (dep.startsWith("@platform/") && String(version).startsWith("workspace:")) depNames.add(dep);
      }
    }
  }

  const packageRoots = path.resolve(rootDir, "core", "packages");
  const buildTargets = [];
  if (!fileExists(packageRoots)) return buildTargets;
  const entries = fs.readdirSync(packageRoots, { withFileTypes: true }).filter((x) => x.isDirectory());
  for (const entry of entries) {
    const pkgPath = path.join(packageRoots, entry.name, "package.json");
    const pkg = readJsonIfExists(pkgPath, null);
    if (!pkg || !pkg.name || !depNames.has(pkg.name)) continue;
    if (!pkg.scripts || !pkg.scripts.build) continue;
    const mainField = String(pkg.main || "");
    if (mainField && !fileExists(path.join(packageRoots, entry.name, mainField))) {
      buildTargets.push(pkg.name);
    }
  }
  return buildTargets.sort();
}

function ensureWorkspaceDepsBuilt(rootDir, mvpRoot, mvpName, scope) {
  const toBuild = collectWorkspaceDepsToBuild(rootDir, mvpRoot, mvpName, scope);
  const built = [];
  for (const depName of toBuild) {
    childProcess.execSync(`pnpm --filter ${depName} run build`, { cwd: rootDir, stdio: "pipe" });
    built.push(depName);
  }
  return built;
}

function verifyConcurrentDev(mvpRoot) {
  return new Promise((resolve) => {
    const child = childProcess.spawn("pnpm", ["run", "dev"], {
      cwd: mvpRoot,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true
    });
    let output = "";
    let settled = false;
    const cleanup = { attempted: false, pid: child.pid || null, killed: false, error: "" };
    const killTree = () => {
      cleanup.attempted = true;
      if (!child.pid) return;
      try {
        if (process.platform === "win32") {
          childProcess.execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: "pipe" });
        } else {
          process.kill(-child.pid, "SIGTERM");
        }
        cleanup.killed = true;
      } catch (error) {
        cleanup.error = String(error.stderr || error.message || error);
      }
    };
    const finish = (result) => {
      if (settled) return;
      settled = true;
      killTree();
      resolve({ ...result, cleanup });
    };
    const append = (chunk) => {
      output += String(chunk || "");
      if (output.length > 12000) output = output.slice(-12000);
    };
    child.stdout.on("data", append);
    child.stderr.on("data", append);

    child.on("error", (error) => {
      finish({
        ok: false,
        outputSnippet: `${output.slice(-1000)}\n${String(error.message || error)}`,
        timeoutHit: false,
        frontStarted: false,
        backStarted: false,
        hasFatal: true,
        command: "pnpm run dev"
      });
    });

    const timer = setTimeout(() => {
      const lower = output.toLowerCase();
      const frontStarted = lower.includes("vite") || lower.includes("local:");
      const backStarted = lower.includes("nodemon") || lower.includes("servidor ejecut") || lower.includes("listening");
      const hasFatal = lower.includes("eaddrinuse") || lower.includes("app crashed") || lower.includes("exited with code 1") || lower.includes("no se reconoce como un comando") || lower.includes("error:");
      finish({
        ok: frontStarted && backStarted && !hasFatal,
        outputSnippet: output.slice(-1200),
        timeoutHit: true,
        frontStarted,
        backStarted,
        hasFatal,
        command: "pnpm run dev"
      });
    }, 16000);

    child.on("exit", (code, _signal) => {
      clearTimeout(timer);
      const lower = output.toLowerCase();
      const frontStarted = lower.includes("vite") || lower.includes("local:");
      const backStarted = lower.includes("nodemon") || lower.includes("servidor ejecut") || lower.includes("listening");
      const hasFatal = lower.includes("eaddrinuse") || lower.includes("app crashed") || lower.includes("exited with code 1") || lower.includes("no se reconoce como un comando") || lower.includes("error:") || Number(code || 0) !== 0;
      finish({
        ok: frontStarted && backStarted && !hasFatal,
        outputSnippet: output.slice(-1200),
        timeoutHit: false,
        frontStarted,
        backStarted,
        hasFatal,
        command: "pnpm run dev"
      });
    });
  });
}

function runBackendIntegrationTests(mvpRoot, mvpName, scope) {
  if (scope === "front") {
    return { ok: true, skipped: true, command: "pnpm --dir ./${mvpName}-back run test:integration", outputSnippet: "scope=front" };
  }

  const command = `pnpm --dir ./${mvpName}-back run test:integration`;
  try {
    const output = childProcess.execSync(command, { cwd: mvpRoot, stdio: "pipe" });
    return {
      ok: true,
      skipped: false,
      command,
      outputSnippet: String(output || "").slice(-1200)
    };
  } catch (error) {
    return {
      ok: false,
      skipped: false,
      command,
      outputSnippet: String(error.stderr || error.stdout || error.message || error).slice(-2000)
    };
  }
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
  const scripts = { "db:migrate": input.db.migrateCommand };
  if (input.scope === "ambos") {
    scripts.install = `pnpm -C ../.. install --filter @platform/${safePackageName(input.name)}-front --filter @platform/${safePackageName(input.name)}-back`;
    scripts.build = "pnpm run build:front && pnpm run build:back";
  } else if (input.scope === "front") {
    scripts.install = `pnpm -C ../.. install --filter @platform/${safePackageName(input.name)}-front`;
    scripts.build = "pnpm run build:front";
  } else {
    scripts.install = `pnpm -C ../.. install --filter @platform/${safePackageName(input.name)}-back`;
    scripts.build = "pnpm run build:back";
  }
  if (input.scope !== "back") {
    scripts["dev:front"] = `pnpm --dir ./${input.name}-front run dev`;
    scripts["build:front"] = `pnpm --dir ./${input.name}-front run build`;
  }
  if (input.scope !== "front") {
    scripts["dev:back"] = `pnpm --dir ./${input.name}-back run dev`;
    scripts["build:back"] = `pnpm --dir ./${input.name}-back run build`;
  }
  if (input.scope === "ambos") {
    scripts.dev = "pnpm exec concurrently \"pnpm run dev:front\" \"pnpm run dev:back\"";
  }

  writeFile(
    path.join(mvpRoot, "package.json"),
    JSON.stringify(
      {
        name: input.name,
        private: true,
        scripts,
        devDependencies: {
          concurrently: "^9.0.1"
        }
      },
      null,
      2
    )
  );

  if (input.scope !== "back") {
    rewritePackageNameIfExists(path.join(mvpRoot, `${input.name}-front`), `@platform/${safePackageName(input.name)}-front`);
  }
  if (input.scope !== "front") {
    rewritePackageNameIfExists(path.join(mvpRoot, `${input.name}-back`), `@platform/${safePackageName(input.name)}-back`);
  }

  let dbSelection = { mode: input.db.mode, stack: input.db.existingStack || "", created: null, started: null };
  let dbRuntime = null;
  if (input.db.mode === "new" && input.db.createNow) {
    const newDbName = (input.db.name || `${input.name}-db`).replace(/_/g, "-");
    const dbResult = executeNewDb(rootDir, { name: newDbName, provider: "postgres", schema: "public", seed: "default" });
    dbSelection.created = dbResult.target;
    dbRuntime = {
      host: "localhost",
      port: String(dbResult.dbPort),
      user: "soc",
      password: "soc",
      dbName: (input.db.name || `${input.name}_db`).replace(/-/g, "_"),
      ssl: "false",
      sslRejectUnauthorized: "false"
    };
    if (input.db.startNow) {
      if (!isDockerAvailable()) throw new Error("Docker no disponible para levantar DB nueva");
      const dbDir = path.resolve(rootDir, dbResult.target);
      childProcess.execSync("docker compose up -d --build", { cwd: dbDir, stdio: "pipe" });
      dbSelection.started = dbResult.target;
    }
  } else {
    dbRuntime = getExistingDbPreset(input.db.existingStack || "soc-db-source");
    dbSelection.stack = input.db.existingStack || "soc-db-source";
    if (input.db.startNow) {
      if (!isDockerAvailable()) throw new Error("Docker no disponible para levantar DB existente");
      dbSelection.started = startExistingDbStack(rootDir, dbSelection.stack);
    }
  }

  if (dbRuntime) {
    writeBackendEnvFiles(mvpRoot, input.name, dbRuntime);
  }

  writeFile(
    path.join(mvpRoot, "README.md"),
    `# ${input.name}\n\nMVP generado por new:mvp.\n\n## Install\n\n- npm run install\n\n## Build\n\n- npm run build\n\n## Dev\n\n- npm run dev (front+back)\n- npm run dev:front\n- npm run dev:back\n`
  );

  const frontRequired = input.scope !== "back"
    ? getMvpTemplateRequiredFiles(rootDir, input.templateFront)
    : [];
  const backRequired = input.scope !== "front"
    ? getMvpTemplateRequiredFiles(rootDir, input.templateBack)
    : [];

  const initialState = {
    version: 1,
    name: input.name,
    scope: input.scope,
    createdAt: new Date().toISOString(),
    scaffold: {
      front: { enabled: input.scope !== "back", template: input.templateFront, requiredFiles: frontRequired },
      back: { enabled: input.scope !== "front", template: input.templateBack, requiredFiles: backRequired }
    },
    phases: {
      "1": { status: "pending", approved: false },
      "2": { status: "pending", approved: false },
      "3": { status: "pending", approved: false }
    },
    baseline: createBaselineSnapshot(rootDir, input.name),
    reports: []
  };
  const statePath = writeMvpState(rootDir, input.name, initialState);

  const scaffoldCheck = verifyMvpScaffold(rootDir, input.name, initialState);

  return {
    target: path.relative(rootDir, mvpRoot),
    created,
    structure: computeMvpStructure(input),
    statePath: path.relative(rootDir, statePath),
    scaffoldCheck,
    dbSelection,
    dbRuntime
  };
}

async function executeImplementMvp(rootDir, input) {
  const mvpRoot = path.resolve(rootDir, "mvp", input.name);
  const planPath = path.join(mvpRoot, "IMPLEMENTATION_PLAN.md");
  const reportsDir = path.join(buildMvpStateRoot(rootDir, input.name), "reports");
  ensureDir(reportsDir);
  const phases = Math.min(3, Math.max(2, input.phases || 3));

  let state = readMvpState(rootDir, input.name);
  if (!state) {
    state = {
      version: 1,
      name: input.name,
      scope: "ambos",
      createdAt: new Date().toISOString(),
      scaffold: { front: { enabled: true, template: "" }, back: { enabled: true, template: "" } },
      phases: { "1": { status: "pending", approved: false }, "2": { status: "pending", approved: false }, "3": { status: "pending", approved: false } },
      baseline: createBaselineSnapshot(rootDir, input.name),
      reports: [],
      requirementOriginal: ""
    };
  }

  const req = input.requirement || state.requirementOriginal || "Implementar capacidades de negocio de forma incremental y agnostica al dominio.";
  if (!state.requirementOriginal) {
    state.requirementOriginal = req;
  }

  const phase = input.phase || 0;
  const approvePhase = input.approvePhase || 0;
  const plan = [
    `# Implementation Plan - ${input.name}`,
    "",
    "## Requirement",
    "",
    req,
    "",
    "## Phases",
    "",
    "1. Fase 1 - Foundation: contratos, rutas base, wiring y pruebas iniciales.",
    "2. Fase 2 - Features: endpoints/UI principales y validaciones.",
    phases === 3 ? "3. Fase 3 - Hardening: tests integracion, docs, observabilidad y cierre." : "",
    "",
    "## Flow",
    "",
    "- Ejecutar una fase por iteracion.",
    "- Validar con usuario antes de avanzar.",
    "- No avanzar de fase sin feedback explicito.",
    "",
    "## Verification Gates",
    "",
    "- Fase 1: scaffold integrity + scripts + package names.",
    "- Fase 2: progreso funcional detectable en front/back vs baseline.",
    "- Fase 3: hardening checks (tests/docs) y cierre con reporte."
  ].filter(Boolean).join("\n");
  writeFile(planPath, plan);

  if (approvePhase > 0) {
    const slot = state.phases[String(approvePhase)] || { status: "pending", approved: false };
    if (slot.status !== "executed") {
      throw new Error(`No se puede aprobar fase ${approvePhase} porque no esta ejecutada`);
    }
    slot.approved = true;
    slot.approvedAt = new Date().toISOString();
    state.phases[String(approvePhase)] = slot;
    const statePath = writeMvpState(rootDir, input.name, state);
    return {
      planPath: path.relative(rootDir, planPath),
      statePath: path.relative(rootDir, statePath),
      phase: approvePhase,
      approved: true
    };
  }

  if (phase === 0) {
    const statePath = writeMvpState(rootDir, input.name, state);
    return { planPath: path.relative(rootDir, planPath), phases, statePath: path.relative(rootDir, statePath), mode: "plan-only" };
  }

  if (phase < 1 || phase > phases) {
    throw new Error(`phase invalida: ${phase}. Debe estar entre 1 y ${phases}`);
  }

  if (phase > 1) {
    const prev = state.phases[String(phase - 1)];
    if (!prev || !prev.approved) {
      throw new Error(`No se puede ejecutar fase ${phase} sin aprobar fase ${phase - 1}`);
    }
  }

  let report = { phase, ok: true, checks: [], failures: [] };
  if (phase === 1) {
    const scaffold = verifyMvpScaffold(rootDir, input.name, state);
    let installOk = true;
    let installError = "";
    let depsBuildOk = true;
    let depsBuildError = "";
    let depsBuilt = [];
    try {
      const installResult = runScopedPnpmInstall(rootDir, input.name, state.scope || "ambos");
      state.phase1 = { ...(state.phase1 || {}), install: installResult };
      depsBuilt = ensureWorkspaceDepsBuilt(rootDir, mvpRoot, input.name, state.scope || "ambos");
    } catch (error) {
      const detail = String(error.stderr || error.message || error);
      if (!state.phase1 || !state.phase1.install) {
        installOk = false;
        installError = detail;
      } else {
        depsBuildOk = false;
        depsBuildError = detail;
      }
    }

    const devCheck = (installOk && depsBuildOk)
      ? await verifyConcurrentDev(mvpRoot)
      : { ok: false, outputSnippet: "install/build deps failed", command: "pnpm run dev" };
    const integrationCheck = (installOk && depsBuildOk)
      ? runBackendIntegrationTests(mvpRoot, input.name, state.scope || "ambos")
      : { ok: false, outputSnippet: "install/build deps failed", command: "pnpm --dir ./<mvp-back> run test:integration", skipped: false };
    const failures = [...scaffold.failures];
    if (!installOk) failures.push("Fase 1 install fallo (pnpm install requerido)");
    if (!depsBuildOk) failures.push("Fase 1 build de dependencias workspace fallo");
    if (!devCheck.ok) failures.push("Fase 1 dev check fallo (pnpm run dev no detecto front/back estables)");
    if (!integrationCheck.ok) failures.push("Fase 1 tests de integracion backend fallaron");
    if (installOk && devCheck.ok && integrationCheck.ok) {
      state.phase1 = {
        ...(state.phase1 || {}),
        installVerified: true,
        depsBuildVerified: true,
        depsBuilt,
        devVerified: true,
        integrationVerified: true,
        verifiedAt: new Date().toISOString()
      };
    }

    const lessonsPath = path.join(buildMvpStateRoot(rootDir, input.name), "lessons.md");
    if (failures.length > 0) {
      const lesson = [
        `## ${new Date().toISOString()} - Fase 1`,
        "",
        ...failures.map((f) => `- ${f}`),
        "",
        "### Detalle dev/install",
        "```txt",
        installError || "install ok",
        depsBuildError || `workspace deps built: ${depsBuilt.join(", ") || "none"}`,
        devCheck.outputSnippet || "",
        integrationCheck.outputSnippet || "",
        "```",
        ""
      ].join("\n");
      const prev = fileExists(lessonsPath) ? readFileSafe(lessonsPath) : "# Lessons\n\n";
      writeFile(lessonsPath, `${prev}\n${lesson}`);
    }

    report = {
      phase,
      ok: scaffold.ok && installOk && depsBuildOk && devCheck.ok && integrationCheck.ok,
      checks: [
        ...scaffold.checks,
        { name: "install (pnpm)", ok: installOk },
        { name: "workspace deps build", ok: depsBuildOk, built: depsBuilt },
        { name: "dev smoke (pnpm run dev)", ok: devCheck.ok, cleanup: devCheck.cleanup || null },
        { name: "integration tests backend", ok: integrationCheck.ok, command: integrationCheck.command, skipped: Boolean(integrationCheck.skipped) }
      ],
      failures,
      devCheck,
      integrationCheck
    };
  }

  if (phase === 2) {
    const changes = diffFromBaseline(rootDir, state.baseline || {});
    const frontChanges = changes.filter((x) => x.file.includes(`/mvp/${input.name}/${input.name}-front/`) || x.file.includes(`mvp/${input.name}/${input.name}-front/`));
    const backChanges = changes.filter((x) => x.file.includes(`/mvp/${input.name}/${input.name}-back/`) || x.file.includes(`mvp/${input.name}/${input.name}-back/`));
    const failures = [];
    if ((state.scope || "ambos") !== "back" && frontChanges.length === 0) failures.push("No se detectaron cambios funcionales en front respecto al baseline");
    if ((state.scope || "ambos") !== "front" && backChanges.length === 0) failures.push("No se detectaron cambios funcionales en back respecto al baseline");
    const mvpPkg = readJsonIfExists(path.join(mvpRoot, "package.json"), { scripts: {} });
    let buildOk = true;
    let buildOutput = "";
    let devOk = true;
    let devOut = "";
    try {
      childProcess.execSync("npm run build", { cwd: mvpRoot, stdio: "pipe" });
    } catch (error) {
      buildOk = false;
      buildOutput = String(error.stderr || error.stdout || error.message || error);
    }
    if (mvpPkg.scripts && mvpPkg.scripts.dev) {
      const smoke = await verifyConcurrentDev(mvpRoot);
      devOk = smoke.ok;
      devOut = smoke.outputSnippet || "";
    }
    if (!buildOk) failures.push("Fase 2 build fallo");
    if (!devOk) failures.push("Fase 2 dev smoke fallo");

    report = {
      phase,
      ok: failures.length === 0,
      checks: [
        { name: "front changes", count: frontChanges.length },
        { name: "back changes", count: backChanges.length },
        { name: "build", ok: buildOk },
        { name: "dev smoke", ok: devOk }
      ],
      failures,
      sampleChanges: changes.slice(0, 30),
      buildOutput: buildOutput.slice(-700),
      devOutput: devOut.slice(-700)
    };
  }

  if (phase === 3) {
    const rootPkg = readJsonIfExists(path.join(mvpRoot, "package.json"), { scripts: {} });
    const scripts = rootPkg.scripts || {};
    const failures = [];
    if (!scripts.dev) failures.push("Falta script dev en root mvp");
    if (state.scope !== "back" && !scripts["build:front"]) failures.push("Falta build:front");
    if (state.scope !== "front" && !scripts["build:back"]) failures.push("Falta build:back");
    const docsOk = fileExists(path.join(mvpRoot, "README.md")) && fileExists(planPath);
    if (!docsOk) failures.push("Falta documentacion minima (README o IMPLEMENTATION_PLAN)");
    report = {
      phase,
      ok: failures.length === 0,
      checks: [{ name: "scripts+docs", ok: failures.length === 0 }],
      failures
    };
  }

  const reportPath = path.join(reportsDir, `phase-${phase}.${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
  writeFile(reportPath, JSON.stringify(report, null, 2));

  state.phases[String(phase)] = {
    status: report.ok ? "executed" : "failed",
    approved: false,
    report: path.relative(rootDir, reportPath),
    executedAt: new Date().toISOString()
  };
  state.reports = [...(state.reports || []), path.relative(rootDir, reportPath)];
  const statePath = writeMvpState(rootDir, input.name, state);

  return {
    planPath: path.relative(rootDir, planPath),
    statePath: path.relative(rootDir, statePath),
    phases,
    phase,
    reportPath: path.relative(rootDir, reportPath),
    report
  };
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
  if (normalized.action === "implement:mvp") return executeImplementMvp(rootDir, normalized);
  return null;
}

async function main() {
  const rootDir = process.cwd();
  const parsed = parseArgs(process.argv.slice(2));
  if (!parsed.action) {
    throw new Error("Debes indicar accion new:* (ej: new:mvp)");
  }

  const inputFileConfig = resolveConfig(rootDir, parsed.config);
  const mergedInput = {
    ...inputFileConfig,
    name: parsed.name || inputFileConfig.name,
    requirement: parsed.requirement || inputFileConfig.requirement,
    phases: parsed.phases || inputFileConfig.phases,
    phase: parsed.phase || inputFileConfig.phase,
    projectPath: parsed.projectPath || inputFileConfig.projectPath,
    repoUrl: parsed.repoUrl || inputFileConfig.repoUrl,
    approvePhase: parsed.approvePhase || inputFileConfig.approvePhase
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

  const structurePreview = buildStructurePreview(normalized);
  const shouldExecute = pf.ok && parsed.confirm;
  const executionResult = shouldExecute ? await executeAction(rootDir, normalized) : null;

  const report = {
    version: 1,
    mode: parsed.mode,
    action: parsed.action,
    normalizedInput: normalized,
    preflight: pf,
    execution: plan,
    structurePreview,
    requiresConfirmation: !parsed.confirm,
    analysis,
    executionResult,
    next: pf.ok
      ? (parsed.confirm
        ? "Ejecucion completada. Revisar artefactos y validar build/tests."
        : "Preflight OK. Confirma ejecucion reintentando con --confirm para crear artefactos.")
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

main().catch((error) => {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exit(1);
});
