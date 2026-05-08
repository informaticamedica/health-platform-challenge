# @platform/middleware

Middlewares compartidos para APIs Node/Express del proyecto.

## Alcance

- `src/auth/`: autenticacion/autorizacion.
- `src/errors/`: manejo centralizado de errores.
- `src/validation/`: validaciones de entrada/salida.

## Scripts

- `pnpm run build`: compila TypeScript a `dist/`.

## Integracion sugerida

- Registrar middlewares en orden: seguridad -> parsing -> auth -> validacion -> rutas -> errores.
- Mantener errores de negocio diferenciados de errores tecnicos.
