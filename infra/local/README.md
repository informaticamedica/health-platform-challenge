# Infra Local

Servicios locales para ejecutar y probar los proyectos del repositorio.

## Componentes

- `postgres/`: bases de datos locales (fuente SOC y modular API).
- `keycloak/`: identidad/autenticacion en desarrollo.
- `sentry/`: notas de observabilidad y captura de errores.

## Orden recomendado de arranque

1. Levantar base de datos requerida (`soc-db-source` o `modular-api-db`).
2. Levantar backend(s).
3. Levantar frontend(s).
4. Activar identity/observabilidad segun el flujo a probar.
