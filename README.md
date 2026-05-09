# Health Platform Challenge

> Este es un proyecto que propone una arquitectura **simple pero robusta**: un MVP en tecnologias modernas que convive con un ecosistema de control escalable, preparado para crear proyectos en masa con boilerplates, integrar sistemas legacy sin corte, y ejecutar su migracion progresiva hacia cloud-native.
>
> El enfoque incorpora gobierno tecnico por paquetes compartidos, estandares de interoperabilidad en salud (FHIR), analisis y calidad de codigo, observabilidad operativa, y una base de seguridad por capas (auth, middleware y politicas) para evolucionar de forma ordenada por fases. Tambien contempla gobierno de UI mediante un Design System comun para garantizar consistencia visual y de experiencia entre productos y squads.

![Status](https://img.shields.io/badge/status-en%20evolucion-0ea5e9)
![Stack](https://img.shields.io/badge/stack-node%20%7C%20react%20%7C%20postgres-16a34a)
![Arquitectura](https://img.shields.io/badge/arquitectura-monorepo%20modular-f59e0b)

## Vision

Este repositorio propone un flujo de trabajo estandar para crear MVPs rapido, con servicios desacoplados y escalables de forma individual, bajo gobierno tecnico por dominio.

- Acelerar la creacion de productos con **templates reutilizables** y una estructura repetible.
- Mantener cada capa (front, back, DS, FHIR, infra) gobernada por **skills especificas** con reglas claras.
- Coordinar la entrega end-to-end con **skills orquestadoras** que transforman prompts en productos ejecutables.
- Preservar interoperabilidad, calidad y seguridad desde la fase inicial sin frenar el delivery.

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
- `registry/`: base conceptual para levantar Verdaccio y publicar librerias internas del monorepo.
- `aws-target/`: referencia de aterrizaje cloud objetivo.

### `mvp/` - Producto demostrativo

- `producto1/producto1-front`: interfaz para login, pacientes y observaciones.
- `producto1/producto1-back`: API de negocio consumiendo los packages core.
- `.agents/skills/mvp-product-orchestrator`: skill para crear productos MVP independientes por recurso FHIR.
- `condition-mvp/`: ejemplo generado con la skill (2 prompts, menos de 15 minutos).

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
    registry/
    aws-target/
  mvp/
    .agents/
      skills/
        mvp-product-orchestrator/
    condition-mvp/
      condition-mvp-front/
      condition-mvp-back/
    producto1/
      producto1-front/
      producto1-back/
  PLAN.md
```

## Scripts del package raiz

Estos scripts viven en `package.json` del root y coordinan workspaces:

```bash
pnpm run dev:front          # Levanta core/templates/react-app-boilerplate
pnpm run dev:back           # Levanta core/templates/node-api-boilerplate
pnpm run db:up              # Inicia PostgreSQL local (workspace soc-db-source)
pnpm run db:down            # Detiene PostgreSQL local
pnpm run db:reset           # Reinicia DB en limpio (drop volumen + seed)
```

## Orquestador general (headless)

Comandos canonicos `new:*`:

```bash
npm run new:mvp
npm run new:db
npm run new:package
npm run new:template
npm run new:p2t
```

Uso reproducible con config:

```bash
npm run new:mvp -- ops/examples/new-mvp.json
npm run new:db -- ops/examples/new-db.json
npm run new:package -- ops/examples/new-package.json
npm run new:template -- ops/examples/new-template.json
npm run new:p2t -- ops/examples/new-p2t.local.json
```

`new:p2t` admite:

- `--repo-url <git-url>`
- `--project-path <ruta-local>`

Salida determinista en `ops/plans/`.

Los comandos `new:*` ejecutan creacion real de artefactos y dejan trazabilidad en `ops/plans/`.

## Generacion de MVP por skill

Skill disponible: `mvp/.agents/skills/mvp-product-orchestrator/SKILL.md`.

Capacidades principales:

- Crea un producto aislado en `mvp/<productName>/` con `*-front` y `*-back`.
- Copia templates base y configura scripts de orquestacion (`install`, `build`, `dev`, `db:migrate`).
- Aplica reglas de puertos y convenciones de integracion con `@platform/design-system` y `@platform/fhir`.
- Deja skill local de evolucion en `mvp/<productName>/.agents/skills/` para iterar fases siguientes.

Ejemplo validado: `mvp/condition-mvp/` (recurso FHIR `Condition`), generado con 2 prompts en menos de 15 minutos.

### Como se crea un MVP con esta skill

La skill opera en 2 momentos:

1. `Preflight`: pide una ficha de configuracion, analiza alcance y confirma plan.
2. `Ejecucion`: crea estructura, copia templates, ajusta puertos y deja el MVP listo para evolucionar.

Formulario inicial que la skill te va a pedir (copiar/pegar):

```txt
nombre: condition-mvp
recurso-fhir: Condition
alcance-fase-1: CRUD-minimo
puerto-back: 3003
puerto-front: 5173
usar-core-design-system: si
usar-core-fhir: si
permitir-cambios-cross-project: no
db-migrate-comando: pnpm run db:migrate
```

Notas de comportamiento:

- Si no cambias un campo, toma ese valor por defecto.
- Si `permitir-cambios-cross-project: no`, evita tocar `core/*` y resuelve dentro de `mvp/<productName>/`.
- Si detecta faltantes en Design System o FHIR compartido, frena y pide confirmacion explicita antes de modificar otros proyectos.

### Archivos y carpetas que genera

Salida esperada para `mvp/<productName>/`:

- `mvp/<productName>/<productName>-front/` (app React/Vite basada en template)
- `mvp/<productName>/<productName>-back/` (API Node/Express basada en template)
- `mvp/<productName>/package.json` con scripts:
  - `install:front`, `install:back`, `install:all`
  - `build:front`, `build:back`, `build:all`
  - `dev:front`, `dev:back`, `db:migrate`
- `mvp/<productName>/README.md` con arranque rapido del producto
- `mvp/<productName>/.agents/skills/<productName>-evolution/SKILL.md` para continuar fase 2+

Adicionalmente, en front/back ajusta configuraciones base (`name`, `.env`, puertos, integracion con DS/FHIR, `.gitignore`) y crea los archivos funcionales del recurso solicitado (por ejemplo rutas/controladores/mapeos/vistas para `Condition`).

## Inicio rapido

1. Revisar `PLAN.md` para contexto, decisiones y orden de ejecucion.
2. Instalar dependencias en raiz:
   ```bash
   pnpm install
   ```
3. Levantar base de datos local:
   ```bash
   pnpm run db:up
   ```
4. Levantar boilerplates base (en terminales separadas):
   ```bash
   pnpm run dev:back
   pnpm run dev:front
   ```

### Levantar el ejemplo `condition-mvp`

```bash
cd mvp/condition-mvp
pnpm run install:all
pnpm run db:migrate
pnpm run dev:back
pnpm run dev:front
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
