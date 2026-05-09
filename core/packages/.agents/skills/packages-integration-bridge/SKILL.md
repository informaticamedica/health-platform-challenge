---
name: packages-integration-bridge
description: >
  Worker para new:package y wiring de paquetes @platform/* en templates y MVPs.
  Aplica contratos de dependencias, exports publicos y scripts de verificacion.
---

# Packages Integration Bridge

## Comando fuente

- `new:package` (principal)
- `new:mvp` y `new:template` (wiring)

## Input Contract

- `name`
- `kind` (`library`, `service`, `shared`)
- `scope` (default `@platform`)

## Reglas obligatorias

1. Crear paquete en `core/packages/<name>`.
2. Exponer API publica en `src/index.ts`.
3. No permitir imports desde `src/*` en consumidores.
4. Priorizar `workspace:*` para dependencias internas.

## Execution Order

1. Crear estructura base del package.
2. Definir `package.json` con `main/types/exports`.
3. Crear scripts `build` y `test`.
4. Actualizar consumidor objetivo cuando aplique.

## Output Contract

- Reporte JSON con dependencias aplicadas.
- Evidencia de compatibilidad TypeScript/build.

## Definition of Done

1. Package resoluble por workspaces.
2. Build exitoso del package y consumidor.
3. Sin imports a rutas privadas.
