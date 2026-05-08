# Sentry Local Integration

Guia de referencia para instrumentar captura de errores en apps del challenge.

## Objetivo

- Mejorar trazabilidad de fallos en frontend y backend.
- Complementar logs locales con contexto de excepcion.

## Integracion sugerida

- Definir DSN por aplicacion via variables de entorno.
- Etiquetar entorno (`development`, `test`, `production`).
- Adjuntar `release` para correlacion con versiones desplegadas.

## Recomendaciones

- Filtrar datos sensibles antes de enviar eventos.
- Definir sampling conservador en desarrollo.
