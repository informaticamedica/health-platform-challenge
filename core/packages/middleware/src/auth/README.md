# Middleware Auth

Submodulo para controles de autenticacion y autorizacion en APIs.

## Responsabilidad

- Verificar identidad del request.
- Aplicar reglas de acceso por endpoint/rol.

## Recomendaciones de implementacion

- Mantener verificacion de token aislada de logica de negocio.
- Devolver errores consistentes (`401`/`403`) usando el submodulo de errores.
- Permitir inyeccion de estrategia (JWT local, OIDC/Keycloak, etc.).
