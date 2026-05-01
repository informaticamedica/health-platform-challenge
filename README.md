# platform-challenge

Monorepo local para demostrar estrategia de migracion legacy -> cloud-native en contexto salud/operaciones 24x7.

## Objetivo

- Estandarizar delivery con boilerplates reutilizables.
- Probar integracion progresiva con legacy sin corte.
- Definir base de observabilidad, seguridad y calidad por fases.

## Estructura

- `core/`: templates y packages compartidos.
- `infra/`: infraestructura local y mapeo a AWS objetivo.
- `mvp/`: producto demostrativo que consume `core`.

## Inicio rapido

1. Revisar `PLAN.md`.
2. Completar `.env` desde `.env.example`.
3. Levantar infraestructura base con `docker compose up -d`.
