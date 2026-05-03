import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dist = resolve(root, "dist");
const src = resolve(root, "src");

const assetsToCopy = [
  [resolve(src, "styles"), resolve(dist, "styles")],
  [resolve(src, "fonts"), resolve(dist, "fonts")],
];

for (const [from, to] of assetsToCopy) {
  if (existsSync(from)) {
    mkdirSync(to, { recursive: true });
    cpSync(from, to, { recursive: true });
  }
}

const packageJsonPath = resolve(root, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

const distPackageJson = {
  name: packageJson.name,
  version: packageJson.version,
  main: "./index.js",
  types: "./index.d.ts",
  exports: {
    ".": {
      types: "./index.d.ts",
      default: "./index.js",
    },
    "./styles/theme.css": "./styles/theme.css",
  },
  peerDependencies: packageJson.peerDependencies,
  dependencies: packageJson.dependencies,
};

writeFileSync(resolve(dist, "package.json"), `${JSON.stringify(distPackageJson, null, 2)}\n`, "utf8");
