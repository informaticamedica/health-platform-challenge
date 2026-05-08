# Keycloak Local

Guia para integrar autenticacion basada en Keycloak durante desarrollo.

## Contexto

- El `docker-compose.yml` raiz define `keycloak` en puerto `8080`.
- Credenciales por defecto: `admin/admin` (via variables de entorno si no se sobreescriben).

## Uso sugerido

- Crear realm de desarrollo.
- Registrar cliente para frontend y/o backend.
- Configurar redirect URIs y CORS de acuerdo a puertos locales.

## Integracion minima

- Backend: validacion de JWT/OIDC en middleware de auth.
- Frontend: flujo de login y renovacion de token acorde a cliente configurado.
