# Middleware Errors

Submodulo para normalizar errores HTTP en servicios backend.

## Responsabilidad

- Capturar excepciones no controladas.
- Traducir errores de dominio a respuestas HTTP consistentes.
- Evitar fugas de detalles internos en produccion.

## Recomendaciones

- Definir una taxonomia minima (validacion, auth, no encontrado, conflicto, interno).
- Mantener payload de error estable para frontends.
- Integrar con logger para trazabilidad.
