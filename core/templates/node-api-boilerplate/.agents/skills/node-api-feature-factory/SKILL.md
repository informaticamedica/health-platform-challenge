---
name: node-api-feature-factory
description: >
  Crea endpoints y capacidades nuevas en node-api-boilerplate respetando los
  patrones actuales de arquitectura, validacion y persistencia SQL. Requiere
  migraciones en src/db/migrations para cualquier cambio de esquema.
---

# Node API Feature Factory Skill

## Objetivo

Agregar recursos nuevos (por ejemplo `Condition` o `Medication`) sin romper el
estilo tecnico del boilerplate.

## Flujo obligatorio

1. Definir schema Joi en `src/types/*.schema.ts`.
2. Implementar controller en `src/controllers/*.controller.ts`.
3. Mover reglas de negocio a `src/services/*.service.ts`.
4. Implementar acceso SQL en `src/models/*.model.ts`.
5. Registrar rutas en `src/routes/*.route.ts`.
6. Agregar middleware `authenticate` si aplica.

## Contratos y convenciones

- Validar body con `RoutesService.validationBody(...)`.
- Validar params con `RoutesService.validationParams(...)`.
- Responder exito con `RoutesService.responseSuccess(...)`.
- Responder error con `RoutesService.responseError(...)`.
- Normalizar params con `RoutesService.getParamAsString(...)`.
- IDs en params deben admitir UUID o enteros positivos cuando aplique.

## Regla de base de datos (critica)

Si una feature agrega/modifica tablas, columnas, constraints o indices:

1. Crear un archivo SQL nuevo en `src/db/migrations/`.
2. No sobrescribir migraciones historicas.
3. Nombrar con prefijo ordenable. Ejemplo:
   - `20260503_01_create_condition_table.sql`
4. Mantener `src/db/sql/ddl.sql` como referencia base del estado operativo.

## Checklist para recursos FHIR

Para `Condition` o `Medication`:

- Definir shape de entrada y enums validos en Joi.
- Crear modelo SQL con campos minimos de negocio.
- Implementar endpoints CRUD + listado por paciente si corresponde.
- Mantener salida uniforme `{ data, error }` del boilerplate.
- Si hay errores de validacion: estado coherente (`400/422`) y mensaje claro.

## Definition of Done

1. `pnpm run build` exitoso.
2. `pnpm test` sin fallas en controladores/rutas afectadas.
3. Rutas nuevas registradas y protegidas correctamente.
4. Migraciones SQL creadas para cambios de esquema.
5. No se rompieron endpoints existentes (`auth`, `patients`, `observations`).
