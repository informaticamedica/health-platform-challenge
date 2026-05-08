# @platform/config

Paquete para centralizar configuracion de runtime (variables de entorno, defaults y validaciones).

## Rol dentro del proyecto

- Reducir lectura dispersa de `process.env`.
- Estandarizar nombres y comportamiento de variables.
- Facilitar testeo con configuraciones predecibles.

## Estado actual

- `package.json` expone `main: index.js`.
- No define scripts de build/test todavia.

## Recomendaciones de evolucion

- Exportar `loadConfig()` con validacion temprana.
- Definir tipado estricto para entornos (`dev`, `test`, `prod`).
- Incluir politica de valores por defecto y errores claros al faltar variables criticas.
