# Legacy Adapter Boilerplate

Plantilla para implementar una capa de adaptacion entre sistemas legacy y servicios nuevos.

## Objetivo

- Aislar dependencias legacy del dominio nuevo.
- Permitir migracion incremental sin corte operativo.

## Patron sugerido

- `adapter`: traduce contratos legacy <-> contratos internos.
- `client/gateway`: encapsula protocolo remoto (DB, SOAP, REST, archivos).
- `mappers`: transformaciones de payload.
- `use-cases`: reglas de negocio desacopladas del origen de datos.

## Buenas practicas

- Diseñar idempotencia para operaciones criticas.
- Agregar politicas de retry y timeouts en integraciones remotas.
- Evitar propagar modelos legacy al resto del sistema.
