---
name: mvp-product-orchestrator
description: >
  Worker para new:mvp. Crea MVPs en mvp/<name> siguiendo estructura, templates,
  paquetes compartidos, convenciones de puertos y validaciones del repo.
---

# MVP Product Orchestrator

## Comando fuente

- Se ejecuta solo a traves de `new:mvp`.

## Input Contract

- `name` (kebab-case, unico en `mvp/`)
- `scope` (`front`, `back`, `ambos`)
- `templateFront`, `templateBack`
- `packagesFront`, `packagesBack`
- `db.provider`, `db.name`, `db.migrateCommand`
- `testing` (`unit`, `integration`, `ambos`)

## Preflight obligatorio

1. Verificar que `mvp/<name>` no exista.
2. Verificar que templates existen.
3. Verificar que packages existen en `core/packages`.
4. Verificar puertos sin colision usando regla actual de `mvp/`.
5. Verificar guardrail de cross-project (off por defecto).

## Execution Order

1. Crear `mvp/<name>/`.
2. Copiar templates segun `scope`.
3. Ajustar nombres, env y puertos.
4. Configurar dependencies `@platform/*`.
5. Crear scripts minimos (`npm install`, `build:*`, `dev:*`, `dev` concurrente si scope=ambos, `db:migrate`).
6. Generar README del MVP y skill local de evolucion.

## Delegacion permitida

1. `react-product-scaffold`
2. `node-api-feature-factory`
3. `packages-integration-bridge`
4. `infra-local-bootstrapper`

## Output Contract

- Reporte JSON con `preflight`, `execution`, `validation`, `next`.
- MVP creado sin tocar `core/*` cuando `allowCrossProjectChanges=false`.

## Definition of Done

1. Build de front/back compila segun scope.
2. Scripts del MVP ejecutables.
3. README del MVP documentado.
4. Names de package unicos (`@platform/<name>-front|back`) sin conflicto de workspaces.
