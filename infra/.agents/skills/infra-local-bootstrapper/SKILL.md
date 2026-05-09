---
name: infra-local-bootstrapper
description: >
  Worker para new:db y soporte de new:mvp. Estandariza infraestructura local
  postgres con schema, seed, comandos de ciclo de vida y chequeo de puertos.
---

# Infra Local Bootstrapper

## Comando fuente

- `new:db` (principal)
- `new:mvp` (apoyo para DB/migraciones)

## Input Contract (new:db)

- `name` (kebab-case)
- `provider` (`postgres`)
- `schema` (default `public`)
- `seed` (default `default`)

## Preflight obligatorio

1. Verificar que no exista `infra/local/postgres/<name>`.
2. Verificar puertos libres o documentar colision.
3. Verificar que comandos root `db:*` no queden incoherentes.

## Execution Order

1. Crear estructura `infra/local/postgres/<name>/`.
2. Crear `docker-compose.yml` basado en convencion existente.
3. Crear `sql/01_schema.sql` y `seed/default/*.sql`.
4. Crear `package.json` con scripts `up`, `down`, `reset`.
5. Documentar en README local.

## Output Contract

- Reporte JSON con preflight y pasos ejecutados.
- Stack DB reutilizable por otros MVPs.

## Definition of Done

1. `up/down/reset` reproducibles.
2. Schema + seed aplicables desde cero.
3. README con puertos y variables.
