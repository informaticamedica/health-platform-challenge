# Health Platform Challenge

> Este es un proyecto que propone una arquitectura **simple pero robusta**: un MVP en tecnologias modernas que convive con un ecosistema de control escalable, preparado para crear proyectos en masa con boilerplates, integrar sistemas legacy sin corte, y ejecutar su migracion progresiva hacia cloud-native.
>
> El enfoque incorpora gobierno tecnico por paquetes compartidos, estandares de interoperabilidad en salud (FHIR), analisis y calidad de codigo, observabilidad operativa, y una base de seguridad por capas (auth, middleware y politicas) para evolucionar de forma ordenada por fases. Tambien contempla gobierno de UI mediante un Design System comun para garantizar consistencia visual y de experiencia entre productos y squads.

![Status](https://img.shields.io/badge/status-en%20evolucion-0ea5e9)
![Stack](https://img.shields.io/badge/stack-node%20%7C%20react%20%7C%20postgres-16a34a)
![Arquitectura](https://img.shields.io/badge/arquitectura-monorepo%20modular-f59e0b)

## Vision

Este repositorio busca ser una base defendible para entrevista tecnica (TL/Arquitecto SR) y para evolucion real por fases:

- Entregar rapido con **boilerplates reutilizables**.
- Integrar legacy de forma segura con **adapters y contratos**.
- Operar con base de **observabilidad, seguridad y calidad** desde el inicio.
- Escalar a multiples squads sin romper estandares.

## Objetivos del proyecto

- `Delivery acelerado`: plantillas front/back listas para extender.
- `Migracion sin corte`: coexistencia de IDs y patrones legacy con dominio nuevo.
- `Gobierno tecnico`: packages internos compartidos como contrato transversal.
- `Operacion 24x7`: foco en salud, trazabilidad y evolucion gradual.

## Arquitectura general

### `core/` - Nucleo reusable

- `templates/`: esqueletos base para nuevos servicios/apps.
  - `node-api-boilerplate`: API Node + Express + TypeScript.
  - `react-app-boilerplate`: Front React + Vite + Tailwind.
  - `legacy-adapter-boilerplate`: patron de adaptacion para sistemas legacy.
- `packages/`: librerias internas consumidas via `file:`.
  - `middleware`, `logger`, `config`, `contracts`, `design-system`, `fhir`.

### `infra/` - Entorno local y target cloud

- `local/`: stack minimo para desarrollo y pruebas.
  - `postgres/soc-db-source`: DB semilla con datos clinicos y auth.
  - `keycloak`: base para fase de autenticacion OIDC/SSO.
  - `sentry`: guia runtime para observabilidad SaaS.
- `aws-target/`: referencia de aterrizaje cloud objetivo.

### `mvp/` - Producto demostrativo

- `producto1/producto1-front`: interfaz para login, pacientes y observaciones.
- `producto1/producto1-back`: API de negocio consumiendo los packages core.

## Estructura prevista (alto nivel)

```text
health-platform-challenge/
  core/
    templates/
      node-api-boilerplate/
      react-app-boilerplate/
      legacy-adapter-boilerplate/
    packages/
      middleware/
      logger/
      config/
      contracts/
      design-system/
      fhir/
  infra/
    local/
      postgres/soc-db-source/
      keycloak/
      sentry/
    aws-target/
  mvp/
    producto1/
      producto1-front/
      producto1-back/
  PLAN.md
```

## Scripts del package raiz

Estos scripts viven en `package.json` del root y coordinan workspaces:

```bash
npm run boilerplate:front   # Levanta core/templates/react-app-boilerplate
npm run boilerplate:back    # Levanta core/templates/node-api-boilerplate
npm run db:up               # Inicia PostgreSQL local (workspace soc-db-source)
npm run db:down             # Detiene PostgreSQL local
npm run db:reset            # Reinicia DB en limpio (drop volumen + seed)
```

## Inicio rapido

1. Revisar `PLAN.md` para contexto, decisiones y orden de ejecucion.
2. Instalar dependencias en raiz:
   ```bash
   npm install
   ```
3. Levantar base de datos local:
   ```bash
   npm run db:up
   ```
4. Levantar boilerplates base (en terminales separadas):
   ```bash
   npm run boilerplate:back
   npm run boilerplate:front
   ```

## Roadmap por fases

- `Fase 1`: estructura monorepo + boilerplates + packages base.
- `Fase 2`: consolidacion de middleware/auth (Keycloak/OIDC).
- `Fase 3`: endurecimiento de calidad (pipelines, scans, checks).
- `Fase 4`: homologacion de despliegue hacia target cloud.

## Documentacion clave

- `PLAN.md`: trazabilidad completa de decisiones, alcance y proxima iteracion.
- `core/templates/*/README.md`: detalle funcional de cada plantilla.
- `infra/local/postgres/soc-db-source/README.md`: datos semilla, puertos y ciclo de vida de volumen.

---

### TL;DR

**Un monorepo de salud orientado a entregar rapido, migrar legacy sin corte y evolucionar con arquitectura limpia por fases.**
