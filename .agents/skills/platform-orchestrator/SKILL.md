---
name: platform-orchestrator
description: >
  Orquestador general headless con entrada unica por comandos new:*.
  Resuelve rutas de ejecucion, aplica preflight determinista y delega a skills
  especializadas segun contrato.
---

# Platform Orchestrator

## Objetivo

Centralizar la creacion de artefactos del monorepo con un contrato estable y
reproducible.

## Comandos soportados

1. `new:mvp`
2. `new:db`
3. `new:package`
4. `new:template`
5. `new:p2t`

## Modo obligatorio

- Solo `headless`.
- Solo salida JSON estructurada.
- Sin preguntas abiertas durante ejecucion.

## Entrada obligatoria

- `--action <new:*>`
- `--config <path>` recomendado para reproducibilidad.

## Contrato de ejecucion

1. Normalizar input.
2. Validar input con schema de `ops/schemas`.
3. Ejecutar preflight.
4. Delegar en skill correspondiente.
5. Emitir reporte canónico con: `preflight`, `execution`, `validation`, `next`.

## Mapeo comando -> skill

- `new:mvp` -> `mvp-product-orchestrator`
- `new:db` -> `infra-local-bootstrapper`
- `new:package` -> `packages-integration-bridge`
- `new:template` -> `react-product-scaffold` y/o `node-api-feature-factory`
- `new:p2t` -> `template-promoter`

## Guardrails

1. Prohibido ejecutar acciones fuera de `new:*`.
2. Prohibido aplicar cambios si preflight falla.
3. Prohibido inventar rutas de destino fuera del monorepo.
4. Prohibido saltar validaciones de contratos de skills.

## Definition of Done

1. Reporte JSON guardado en `ops/plans/`.
2. Ruta de skill delegada explicitamente en el reporte.
3. Resultado reproducible con el mismo `--config`.
