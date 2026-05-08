# @platform/producto1-back

Backend del subproyecto `producto1`.

## Dependencias core

- `@platform/config`
- `@platform/contracts`
- `@platform/fhir`
- `@platform/logger`
- `@platform/middleware`

## Rol esperado

- Exponer la API del producto.
- Aplicar middleware compartido (auth, errores, validacion).
- Consumir contratos y utilidades FHIR comunes.

## Estado actual

- `package.json` no incluye scripts todavia.
- Se recomienda agregar como minimo: `dev`, `build`, `start`, `test`.
