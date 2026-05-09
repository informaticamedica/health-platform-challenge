#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

function listDirectories(root) {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== ".agents")
    .map((entry) => entry.name)
    .sort();
}

function getMvpEntries(rootDir) {
  const mvpRoot = path.resolve(rootDir, "mvp");
  return listDirectories(mvpRoot).map((name) => {
    const base = path.resolve(mvpRoot, name);
    const hasFront = fs.existsSync(path.join(base, `${name}-front`));
    const hasBack = fs.existsSync(path.join(base, `${name}-back`));
    return { name, hasFront, hasBack };
  });
}

function getDbEntries(rootDir) {
  const dbRoot = path.resolve(rootDir, "infra", "local", "postgres");
  return listDirectories(dbRoot).map((name) => ({ name }));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function main() {
  const rootDir = process.cwd();
  const opsDir = path.resolve(rootDir, "ops");
  if (!fs.existsSync(opsDir)) fs.mkdirSync(opsDir, { recursive: true });

  const catalog = {
    version: 1,
    generatedAt: new Date().toISOString(),
    packages: listDirectories(path.resolve(rootDir, "core", "packages")),
    templates: listDirectories(path.resolve(rootDir, "core", "templates")),
    dbStacks: getDbEntries(rootDir),
    mvps: getMvpEntries(rootDir)
  };

  const serialized = JSON.stringify(catalog);
  const hash = crypto.createHash("sha256").update(serialized).digest("hex");
  const lock = {
    version: 1,
    generatedAt: catalog.generatedAt,
    hash,
    stats: {
      packages: catalog.packages.length,
      templates: catalog.templates.length,
      dbStacks: catalog.dbStacks.length,
      mvps: catalog.mvps.length
    }
  };

  const catalogPath = path.resolve(opsDir, "component-catalog.json");
  const lockPath = path.resolve(opsDir, "memory.lock.json");
  writeJson(catalogPath, catalog);
  writeJson(lockPath, lock);

  process.stdout.write(`Catalog actualizado: ${path.relative(rootDir, catalogPath)}\n`);
  process.stdout.write(`Lock actualizado: ${path.relative(rootDir, lockPath)}\n`);
}

main();
