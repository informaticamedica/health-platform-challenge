# Skills node-api-boilerplate

Guia para agentes que agregan endpoints y validaciones en este backend.

## Skills disponibles

- `skills/node-api-feature-factory/SKILL.md`: implementa endpoints nuevos siguiendo la arquitectura actual (route/controller/service/model/schema), con validaciones Joi y respuesta uniforme.
- `skills/node-api-feature-factory/SKILL.md` exige que todo cambio de tablas se guarde en `src/db/migrations/*.sql`.

## Arquitectura rapida

- Entry: `src/index.ts`
- App y middlewares globales: `src/app.ts`
- Rutas: `src/routes/*.route.ts`
- Controllers: `src/controllers/*.controller.ts`
- Services: `src/services/*.service.ts`
- Models (SQL): `src/models/*.model.ts`
- DB client: `src/db/postgres.ts`
- Schemas Joi: `src/types/*.schema.ts`

## Como agregar un endpoint nuevo

1. Definir schema Joi en `src/types` si aplica.
2. Crear/editar metodo en `controller`.
3. Si hay logica de negocio, moverla a `service`.
4. Si hay acceso SQL, crear metodo en `model`.
5. Registrar endpoint en `src/routes/*.route.ts`.
6. Si requiere auth, agregar middleware `authenticate`.

## Patrones actuales

- `RoutesService.validationParams(...)` y `validationBody(...)` para validar input.
- `RoutesService.responseSuccess(...)` y `responseError(...)` para salida uniforme.
- `RoutesService.getParamAsString(...)` para normalizar params `string | string[]`.
- IDs en params aceptan UUID o enteros positivos (`idSchema`).

## Conexion DB local

- Host: `localhost`
- Port: `55433`
- SSL: habilitado en contenedor local
- En backend local usar:
  - `DB_SSL=true`
  - `DB_SSL_REJECT_UNAUTHORIZED=false`

## Precauciones

- Mantener compatibilidad con esquema operativo actual (`ddl.sql`, IDs enteros).
- No modificar estructura de tablas sin agregar migracion SQL nueva en `src/db/migrations/`.
