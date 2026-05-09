const path = require("node:path");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

function inferAction(text) {
  if (includesAny(text, ["mvp", "producto", "product"])) return "new:mvp";
  if (includesAny(text, ["base de datos", "database", "postgres", "postgress", "db"])) return "new:db";
  if (includesAny(text, ["package", "paquete", "libreria", "library"])) return "new:package";
  if (includesAny(text, ["template", "plantilla", "boilerplate"])) return "new:template";
  if (includesAny(text, ["project to template", "p2t", "repo", "repositorio"])) return "new:p2t";
  return "";
}

function inferScope(text) {
  if (includesAny(text, ["front y back", "frontend y backend", "ambos", "fullstack"])) return "ambos";
  if (includesAny(text, ["solo front", "frontend", "react front"])) return "front";
  if (includesAny(text, ["solo back", "backend", "api"])) return "back";
  return "ambos";
}

function inferBackTemplate(text) {
  if (includesAny(text, ["modular", "modular api", "arquitectura modular"])) {
    return "core/templates/modular-api-boilerplate";
  }
  return "core/templates/modular-api-boilerplate";
}

function inferFrontTemplate(_text) {
  return "core/templates/react-app-boilerplate";
}

function inferName(text, action) {
  const match = text.match(/(?:llamado|nombre|name)\s+([a-zA-Z0-9-_]+)/i);
  if (match && match[1]) return slugify(match[1]);
  if (action === "new:mvp") return "example-mvp";
  if (action === "new:db") return "example-db";
  if (action === "new:package") return "example-package";
  if (action === "new:template") return "example-template";
  if (action === "new:p2t") return "example-template-from-project";
  return "example-item";
}

function inferProvider(text) {
  if (includesAny(text, ["postgres", "postgress"])) return "postgres";
  return "postgres";
}

function getNameSuggestions(action, inferredName) {
  const base = slugify(inferredName || "example");
  if (action === "new:mvp") return [base, "patients-mvp", "clinical-mvp"];
  if (action === "new:db") return [base, "clinical-db", "platform-db"];
  if (action === "new:package") return [base, "audit", "integration"];
  if (action === "new:template") return [base, "front-template", "back-template"];
  if (action === "new:p2t") return [base, "project-template", "promoted-template"];
  return [base, "example-one", "example-two"];
}

function parseTextToProposal(text) {
  const normalized = String(text || "").trim().toLowerCase();
  const action = inferAction(normalized);
  const pickedAction = action || "new:mvp";
  const name = inferName(normalized, pickedAction);
  const scope = inferScope(normalized);

  const proposal = {
    action: pickedAction,
    config: {
      name
    },
    confidence: {
      action: action ? "high" : "low",
      name: "medium"
    },
    suggestions: {
      names: getNameSuggestions(pickedAction, name)
    },
    meta: {
      autoImplement: false,
      requirement: ""
    }
  };

  if (pickedAction === "new:mvp") {
    proposal.config.scope = scope;
    proposal.config.templateFront = inferFrontTemplate(normalized);
    proposal.config.templateBack = inferBackTemplate(normalized);
    proposal.config.packagesFront = ["@platform/design-system", "@platform/contracts"];
    proposal.config.packagesBack = ["@platform/fhir", "@platform/contracts", "@platform/middleware", "@platform/config", "@platform/logger"];
    proposal.config.db = {
      provider: inferProvider(normalized),
      name: `platform_${name.replace(/-/g, "_")}`,
      migrateCommand: "pnpm run db:migrate"
    };
    proposal.config.testing = "ambos";
    if (includesAny(normalized, ["implementar", "implemente", "implement", "fhir", "ips", "paciente", "patients"])) {
      proposal.meta.autoImplement = true;
      proposal.meta.requirement = String(text || "").trim();
    }
  } else if (pickedAction === "new:db") {
    proposal.config.provider = inferProvider(normalized);
    proposal.config.schema = "public";
    proposal.config.seed = "default";
  } else if (pickedAction === "new:package") {
    proposal.config.kind = "library";
    proposal.config.scope = "@platform";
  } else if (pickedAction === "new:template") {
    proposal.config.layer = includesAny(normalized, ["back", "backend", "api"]) ? "back" : "front";
    proposal.config.base = proposal.config.layer === "back"
      ? "core/templates/modular-api-boilerplate"
      : "core/templates/react-app-boilerplate";
  } else if (pickedAction === "new:p2t") {
    proposal.config.projectPath = "C:/path/to/local-project";
    proposal.config.target = "core/templates";
    proposal.confidence.projectPath = "low";
  }

  return proposal;
}

function getTemplateOptions(scope) {
  return {
    front: scope !== "back"
      ? ["core/templates/react-app-boilerplate"]
      : [],
    back: scope !== "front"
      ? ["core/templates/modular-api-boilerplate", "core/templates/node-api-boilerplate"]
      : []
  };
}

module.exports = {
  parseTextToProposal,
  getNameSuggestions,
  getTemplateOptions,
  slugify,
  path
};
