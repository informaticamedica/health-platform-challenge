# @platform/logger

Paquete de logging estructurado para servicios del monorepo.

## Rol

- Unificar formato de logs.
- Facilitar trazabilidad operativa entre servicios.
- Preparar integracion con observabilidad (por ejemplo Sentry).

## Estado actual

- `package.json` minimal (`main: index.js`).
- Sin scripts de build/test definidos aun.

## Recomendaciones

- Definir niveles (`debug`, `info`, `warn`, `error`).
- Incluir `requestId`/`correlationId` cuando aplique.
- Agregar politicas de redaccion de datos sensibles.
