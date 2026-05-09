#!/usr/bin/env node

import React, { useMemo, useState } from "react";
import { Box, Text, render, useApp, useInput } from "ink";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import childProcess from "node:child_process";
import parserModule from "./intent-parser.js";

const { parseTextToProposal, getNameSuggestions, getTemplateOptions, slugify } = parserModule;

const ACTIONS = [
  { label: "MVP", value: "new:mvp" },
  { label: "DB", value: "new:db" },
  { label: "Package", value: "new:package" },
  { label: "Template", value: "new:template" },
  { label: "Project to Template (p2t)", value: "new:p2t" },
  { label: "Texto libre", value: "__text__" }
];

const TABS = ["Crear", "Nombre", "Config", "Confirmar"];

function runCli(action, config) {
  const tempFile = path.join(os.tmpdir(), `platform-orchestrator-${Date.now()}.json`);
  fs.writeFileSync(tempFile, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  childProcess.execSync(`node "tools/platform-orchestrator/cli.js" ${action} "${tempFile}"`, { stdio: "inherit" });
  fs.unlinkSync(tempFile);
}

function stepSubtitle(step) {
  if (step === 0) return "Selecciona tipo o usa texto libre";
  if (step === 1) return "Elige nombre sugerido o custom";
  if (step === 2) return "Completa configuracion";
  return "Confirma, edita o ejecuta";
}

function progress(step) {
  const pct = Math.round((step / (TABS.length - 1)) * 100);
  const len = 24;
  const fill = Math.round((pct / 100) * len);
  return `${"#".repeat(fill)}${"-".repeat(len - fill)} ${pct}%`;
}

function App() {
  const { exit } = useApp();
  const [step, setStep] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState("menu");
  const [textBuffer, setTextBuffer] = useState("");
  const [action, setAction] = useState("");
  const [config, setConfig] = useState({});
  const [log, setLog] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [editingFinal, setEditingFinal] = useState(false);
  const [editCursor, setEditCursor] = useState(0);

  const nameSuggestions = useMemo(
    () => (action ? getNameSuggestions(action, config.name || "example-item") : []),
    [action, config.name]
  );

  const configQuestions = useMemo(() => {
    if (action === "new:mvp") {
      const scope = config.scope || "ambos";
      const templates = getTemplateOptions(scope);
      return [
        { key: "scope", type: "select", label: "Scope", options: ["ambos", "front", "back"] },
        ...(templates.front.length ? [{ key: "templateFront", type: "select", label: "Template front", options: templates.front }] : []),
        ...(templates.back.length ? [{ key: "templateBack", type: "select", label: "Template back", options: templates.back }] : []),
        { key: "dbName", type: "input", label: "DB name", defaultValue: `platform_${(config.name || "example").replace(/-/g, "_")}` }
      ];
    }
    if (action === "new:db") {
      return [
        { key: "provider", type: "select", label: "DB provider", options: ["postgres"] },
        { key: "schema", type: "input", label: "Schema", defaultValue: "public" },
        { key: "seed", type: "input", label: "Seed", defaultValue: "default" }
      ];
    }
    if (action === "new:package") {
      return [
        { key: "kind", type: "select", label: "Kind", options: ["library", "service", "shared"] },
        { key: "scope", type: "input", label: "Scope", defaultValue: "@platform" }
      ];
    }
    if (action === "new:template") {
      return [
        { key: "layer", type: "select", label: "Layer", options: ["front", "back", "legacy"] },
        { key: "base", type: "input", label: "Base template", defaultValue: config.layer === "back" ? "core/templates/modular-api-boilerplate" : "core/templates/react-app-boilerplate" }
      ];
    }
    if (action === "new:p2t") {
      return [
        { key: "sourceType", type: "select", label: "Source", options: ["local", "repo"] },
        { key: "sourceValue", type: "input", label: config.sourceType === "repo" ? "Repo URL" : "Project path", defaultValue: config.sourceType === "repo" ? "https://github.com/org/repo" : "C:/path/to/local-project" },
        { key: "target", type: "input", label: "Target", defaultValue: "core/templates" }
      ];
    }
    return [];
  }, [action, config.layer, config.name, config.scope, config.sourceType]);

  const activeOptions = useMemo(() => {
    if (step === 0) return ACTIONS.map((x) => x.label);
    if (step === 1) return [...nameSuggestions, "Escribir custom"];
    if (step === 2) {
      const q = configQuestions[questionIndex];
      return q && q.type === "select" ? q.options : [];
    }
    if (step === 3) return ["Ejecutar", "Editar campos", "Cancelar"];
    return [];
  }, [step, nameSuggestions, configQuestions, questionIndex]);

  const currentQuestion = step === 2 ? configQuestions[questionIndex] : null;

  const flatEntries = useMemo(() => {
    const entries = [];
    for (const [k, v] of Object.entries(config)) {
      if (v && typeof v === "object" && !Array.isArray(v)) {
        for (const [ik, iv] of Object.entries(v)) entries.push({ key: `${k}.${ik}`, value: String(iv) });
      } else {
        entries.push({ key: k, value: Array.isArray(v) ? JSON.stringify(v) : String(v) });
      }
    }
    return entries;
  }, [config]);

  function setDeep(prev, deepKey, value) {
    if (!deepKey.includes(".")) return { ...prev, [deepKey]: value };
    const [left, right] = deepKey.split(".");
    return { ...prev, [left]: { ...(prev[left] || {}), [right]: value } };
  }

  useInput((input, key) => {
    if (key.ctrl && input === "c") return exit();

    if (mode === "input") {
      if (key.return) {
        if (step === 0) {
          const proposal = parseTextToProposal(textBuffer);
          setAction(proposal.action);
          setConfig(proposal.config);
          setStep(1);
          setCursor(0);
          setLog(`Interpretado como ${proposal.action}`);
        } else if (step === 1) {
          const name = slugify(textBuffer);
          if (name) {
            setConfig((prev) => ({ ...prev, name }));
            setStep(2);
            setCursor(0);
            setQuestionIndex(0);
          }
        } else if (step === 2 && currentQuestion) {
          const val = textBuffer || currentQuestion.defaultValue || "";
          if (action === "new:mvp" && currentQuestion.key === "dbName") {
            setConfig((prev) => ({
              ...prev,
              db: { provider: "postgres", name: val, migrateCommand: "pnpm run db:migrate" },
              testing: "ambos",
              packagesFront: ["@platform/design-system", "@platform/contracts"],
              packagesBack: ["@platform/fhir", "@platform/contracts", "@platform/middleware", "@platform/config", "@platform/logger"]
            }));
          } else if (action === "new:p2t" && currentQuestion.key === "sourceValue") {
            setConfig((prev) => {
              const next = { ...prev };
              if (prev.sourceType === "repo") next.repoUrl = val;
              else next.projectPath = val;
              return next;
            });
          } else {
            setConfig((prev) => ({ ...prev, [currentQuestion.key]: val }));
          }

          const nextQ = questionIndex + 1;
          if (nextQ >= configQuestions.length) {
            setStep(3);
            setCursor(0);
          } else {
            setQuestionIndex(nextQ);
            setCursor(0);
          }
        } else if (step === 3 && editingFinal) {
          const item = flatEntries[editCursor];
          if (item) {
            setConfig((prev) => setDeep(prev, item.key, textBuffer));
            setLog(`Actualizado ${item.key}`);
          }
          setEditingFinal(false);
        }
        setMode("menu");
        setTextBuffer("");
        return;
      }
      if (key.backspace || key.delete) return setTextBuffer((prev) => prev.slice(0, -1));
      if (input.length === 1 && !key.ctrl && !key.meta) return setTextBuffer((prev) => prev + input);
      return;
    }

    if (key.upArrow) return editingFinal ? setEditCursor((v) => Math.max(0, v - 1)) : setCursor((v) => Math.max(0, v - 1));
    if (key.downArrow) return editingFinal ? setEditCursor((v) => Math.min(flatEntries.length - 1, v + 1)) : setCursor((v) => Math.min(activeOptions.length - 1, v + 1));

    if (key.return) {
      if (step === 0) {
        const selected = ACTIONS[cursor].value;
        if (selected === "__text__") {
          setMode("input");
          setTextBuffer("");
        } else {
          setAction(selected);
          setConfig({ name: "" });
          setStep(1);
          setCursor(0);
        }
        return;
      }

      if (step === 1) {
        if (cursor === 3) {
          setMode("input");
          setTextBuffer("");
        } else {
          const name = slugify(nameSuggestions[cursor]);
          setConfig((prev) => ({ ...prev, name }));
          setStep(2);
          setCursor(0);
          setQuestionIndex(0);
        }
        return;
      }

      if (step === 2 && currentQuestion) {
        if (currentQuestion.type === "select") {
          const value = currentQuestion.options[cursor];
          setConfig((prev) => ({ ...prev, [currentQuestion.key]: value }));
          const nextQ = questionIndex + 1;
          if (nextQ >= configQuestions.length) {
            setStep(3);
            setCursor(0);
          } else {
            setQuestionIndex(nextQ);
            setCursor(0);
          }
        } else {
          setMode("input");
          setTextBuffer("");
        }
        return;
      }

      if (step === 3) {
        if (editingFinal) {
          setMode("input");
          setTextBuffer(flatEntries[editCursor]?.value || "");
          return;
        }
        if (cursor === 0) {
          const finalConfig = { ...config };
          if (action === "new:p2t") {
            delete finalConfig.sourceType;
            delete finalConfig.sourceValue;
          }
          runCli(action, finalConfig);
          exit();
          return;
        }
        if (cursor === 1) {
          setEditingFinal(true);
          setEditCursor(0);
          setLog("Edit mode activo: Enter para modificar el campo seleccionado");
          return;
        }
        exit();
      }
    }
  });

  return React.createElement(
    Box,
    { flexDirection: "row" },
    React.createElement(
      Box,
      { width: 34, borderStyle: "round", borderColor: "cyan", flexDirection: "column", paddingX: 1 },
      React.createElement(Text, { bold: true, color: "cyan" }, "Estado"),
      React.createElement(Text, null, `Paso: ${step + 1}/${TABS.length}`),
      React.createElement(Text, null, `Progreso: ${progress(step)}`),
      React.createElement(Text, null, `Accion: ${action || "-"}`),
      React.createElement(Text, null, `Nombre: ${config.name || "-"}`),
      React.createElement(Text, null, `Modo: ${mode}${editingFinal ? " + edit" : ""}`),
      React.createElement(Text, { dimColor: true }, "Flechas + Enter")
    ),
    React.createElement(
      Box,
      { width: 92, marginLeft: 1, flexDirection: "column" },
      React.createElement(Text, { bold: true, color: "cyan" }, "Health Platform Orchestrator"),
      React.createElement(Text, { color: "gray" }, "------------------------------------------------------------------------"),
      React.createElement(Box, null, TABS.map((tab, i) => React.createElement(Text, { key: tab, color: i === step ? "magenta" : "gray" }, `[${i + 1} ${tab}] `))),
      React.createElement(Text, { dimColor: true }, stepSubtitle(step)),
      step === 2 && currentQuestion ? React.createElement(Text, { color: "yellow" }, currentQuestion.label) : null,
      React.createElement(
        Box,
        { marginTop: 1, flexDirection: "column" },
        mode === "input"
          ? React.createElement(Text, { color: "green" }, `> ${textBuffer}`)
          : !editingFinal
            ? activeOptions.map((opt, i) => React.createElement(Text, { key: `${opt}-${i}`, color: i === cursor ? "green" : "white" }, `${i === cursor ? "❯" : " "} ${opt}`))
            : flatEntries.map((entry, i) => React.createElement(Text, { key: `${entry.key}-${i}`, color: i === editCursor ? "yellow" : "white" }, `${i === editCursor ? "❯" : " "} ${entry.key}: ${entry.value}`))
      ),
      step === 3
        ? React.createElement(
            Box,
            { marginTop: 1, flexDirection: "column" },
            React.createElement(Text, { color: "yellow" }, "Resumen"),
            React.createElement(Text, { color: "gray" }, JSON.stringify({ action, ...config }, null, 2))
          )
        : null,
      log ? React.createElement(Text, { color: "blue" }, log) : null,
      React.createElement(Text, { dimColor: true }, "Ctrl+C para salir")
    )
  );
}

render(React.createElement(App));
