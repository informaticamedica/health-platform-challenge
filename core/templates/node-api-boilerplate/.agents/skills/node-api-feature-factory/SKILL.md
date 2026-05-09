---
name: node-api-feature-factory
description: >
  Worker backend para new:template y new:mvp. Crea endpoints y capas siguiendo
  patrones route/controller/service/model/schema y migraciones SQL versionadas.
---

# Node API Feature Factory

## Comando fuente

- `new:template` cuando `layer=back`
- `new:mvp` cuando incluye backend

## Contrato tecnico

1. Mantener arquitectura por capas del boilerplate.
2. Validaciones con Joi y `RoutesService`.
3. Respuesta uniforme `{ data, error }`.
4. Cambios de esquema siempre con migracion nueva en `src/db/migrations`.

## Execution Order

1. Definir schema.
2. Implementar model + service + controller.
3. Registrar rutas.
4. Crear migraciones si aplica.
5. Verificar build y tests.

## Definition of Done

1. `pnpm run build` exitoso.
2. Tests backend sin regresiones.
3. Rutas registradas y documentadas.
