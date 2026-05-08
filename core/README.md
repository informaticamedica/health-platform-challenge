# Core

`core/` concentra los activos reutilizables del monorepo: paquetes compartidos y plantillas base para crear nuevos productos.

## Objetivo

- Evitar duplicacion entre productos MVP.
- Estandarizar arquitectura, calidad y convenciones.
- Acelerar el bootstrap de nuevos frontends y backends.

## Estructura

- `packages/`: librerias internas (`@platform/*`) consumidas por templates y MVPs.
- `templates/`: boilerplates listos para clonar o extender por producto.

## Como se usa desde el repo

- Los paquetes se consumen como `workspace:*`.
- Las plantillas se ejecutan desde scripts raiz (`pnpm run dev:front`, `pnpm run dev:back`, `pnpm run dev:back:modular`).

## Relacion con otras carpetas

- `mvp/` usa `core/templates` como punto de partida y `core/packages` como base transversal.
- `infra/` provee los servicios de soporte (DB, auth, observabilidad) para ejecutar lo generado.
