# Middleware Validation

Submodulo para validar requests y, cuando aplique, respuestas de API.

## Responsabilidad

- Validar `params`, `query`, `body` antes de ejecutar casos de uso.
- Retornar errores legibles para clientes consumidores.

## Recomendaciones

- Centralizar esquemas por modulo funcional.
- Estandarizar el formato de errores de validacion.
- Evitar duplicar validacion en controladores y servicios.
