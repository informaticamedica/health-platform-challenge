# @platform/contracts

Contratos y tipos compartidos entre aplicaciones del monorepo.

## Scripts

- `pnpm run build`: compila TypeScript con `tsc -p tsconfig.json`.

## Salida

- JavaScript en `dist/index.js`.
- Tipos en `dist/index.d.ts`.

## Uso

- Consumir desde front y back via `workspace:*`.
- Mantener aqui DTOs, payloads y contratos de API de uso comun.

## Buenas practicas

- Cambios breaking deben coordinarse entre consumidores.
- Preferir contratos estables y versionables.
