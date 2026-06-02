# Graficos de estructura y filosofia del proyecto

Este documento resume la estructura real del repositorio `health-platform-challenge` en cuatro graficos complementarios. La lectura recomendada es:

1. `Mapa estructural del monorepo`: que existe fisicamente en el repo.
2. `Arquitectura por capas y filosofia`: por que esta organizado asi.
3. `Flujo de orquestacion, skills y trazabilidad`: como se crean y evolucionan artefactos.
4. `Flujo runtime de un MVP de salud`: como corre un producto end-to-end.

## 1. Mapa estructural del monorepo

```text
health-platform-challenge/
|
+-- Root de plataforma
|   +-- README.md                         Vision, arquitectura, comandos y roadmap resumido
|   +-- PLAN.md                           Decisiones, contexto, fases y criterios de ejecucion
|   +-- package.json                      Scripts raiz y workspaces declarados
|   +-- pnpm-workspace.yaml               Alcance real del monorepo
|   +-- docker-compose.yml                Postgres raiz y Keycloak local
|   +-- .env.example                      Variables base de plataforma
|
+-- core/                                Nucleo reutilizable y gobernado
|   |
|   +-- packages/                         Paquetes internos consumidos como workspace
|   |   +-- config/                       Configuracion runtime y entorno
|   |   +-- contracts/                    DTOs y contratos compartidos front/back
|   |   +-- design-system/                UI, layout, feedback, hooks, tokens, Storybook
|   |   +-- fhir/                         Helpers, normalizacion y mapeos clinicos FHIR
|   |   +-- logger/                       Logging estructurado y trazabilidad
|   |   +-- middleware/                   Auth, errores, validacion y request-id
|   |
|   +-- templates/                        Boilerplates base para nuevos productos
|       +-- react-app-boilerplate/        React, Vite, TypeScript, Tailwind
|       +-- node-api-boilerplate/         Node, Express, TypeScript, PostgreSQL
|       +-- modular-api-boilerplate/      API por capas con Swagger y testing
|       +-- legacy-adapter-boilerplate/   Adaptacion legacy y migracion progresiva
|
+-- infra/                               Infraestructura local y referencia cloud
|   |
|   +-- local/                            Servicios para desarrollo
|   |   +-- postgres/
|   |   |   +-- soc-db-source/            DB SOC, puerto 55433, seeds clinicos y auth
|   |   |   +-- modular-api-db/           DB modular, puertos 55434 y 55435
|   |   |   +-- init/                     DDL FHIR usado por compose raiz
|   |   +-- keycloak/                     Guia OIDC/SSO local
|   |   +-- sentry/                       Guia de observabilidad runtime
|   |
|   +-- registry/                         Registry privado conceptual
|   +-- aws-target/                       ECS/Fargate o EKS, RDS, CloudWatch, secretos
|
+-- mvp/                                 Productos demostrativos
|   |
|   +-- condition-mvp/                    MVP generado para recurso FHIR Condition
|   |   +-- condition-mvp-front/          React/Vite, pacientes, observaciones, conditions
|   |   +-- condition-mvp-back/           Node/Express, auth, patients, observations, conditions
|   |   +-- .agents/skills/               Skill local de evolucion del producto
|   |
|   +-- producto1/                        Producto en construccion
|   |   +-- producto1-front/              Consume contracts y design-system
|   |   +-- producto1-back/               Consume config, contracts, fhir, logger, middleware
|   |
|   +-- ips-fhir-mvp/                     Registrado en memoria operacional
|
+-- ops/                                 Gobierno headless y trazabilidad
|   +-- skill-registry.json               Mapeo new:* e implement:mvp hacia skills
|   +-- schemas/                          Contratos de entrada y salida
|   +-- examples/                         Configs reproducibles
|   +-- plans/                            Reportes de ejecucion generados
|   +-- component-catalog.json            Memoria de packages, templates, DB stacks y MVPs
|   +-- memory.lock.json                  Control de drift de memoria
|
+-- .agents/                             Skills globales del repositorio
|   +-- skills/platform-orchestrator/      Entrada general, wizard y headless
|   +-- skills/mvp-product-orchestrator/   Provisioning de MVPs
|   +-- skills/mvp-delivery-orchestrator/  Implementacion funcional por fases
|   +-- skills/template-promoter/          Proyecto existente hacia template reusable
|
+-- tools/platform-orchestrator/          Motor ejecutable del gobierno operativo
    +-- cli.js                            CLI headless para new:* e implement:mvp
    +-- wizard-launch.js                  Entrada interactiva desde npm run new
    +-- wizard.js / wizard-ink.mjs        Wizard clasico e Ink TUI
    +-- intent-parser.js                  Inferencia de accion desde texto libre
    +-- memory-refresh.js                 Actualiza component-catalog y memory.lock
```

## 2. Arquitectura por capas y filosofia

```mermaid
flowchart TB
  PHIL["Filosofia central<br/>Simple pero robusto<br/>Delivery acelerado con gobierno tecnico<br/>Migracion legacy sin corte<br/>Interoperabilidad FHIR<br/>Operacion 24x7<br/>Evolucion cloud-native por fases"]

  subgraph GOVERNANCE["Capa 1: Gobierno tecnico"]
    DOCS["README.md + PLAN.md<br/>Vision, decisiones, roadmap y trazabilidad"]
    AG[".agents/<br/>Skills por dominio y reglas operativas"]
    OPS["ops/<br/>Schemas, registry, memory, plans<br/>Contratos deterministas"]
    WORKSPACE["pnpm workspace<br/>core/packages/*, core/templates/*,<br/>mvp/*/*-front, mvp/*/*-back,<br/>infra DB stacks"]
  end

  subgraph FACTORY["Capa 2: Fabrica de productos"]
    ORCH["tools/platform-orchestrator<br/>wizard + CLI headless"]
    NEWMVP["new:mvp<br/>Crea producto aislado"]
    NEWDB["new:db<br/>Crea DB local reproducible"]
    NEWPKG["new:package<br/>Integra paquetes @platform/*"]
    NEWTPL["new:template<br/>Crea/promueve templates"]
    P2T["new:p2t<br/>Promueve proyecto existente a template"]
    IMPLEMENT["implement:mvp<br/>Plan-first, 2-3 fases, gate humano"]
  end

  subgraph REUSE["Capa 3: Reutilizacion core"]
    TPL["core/templates<br/>React app, Node API, Modular API, Legacy adapter"]
    PKG["core/packages<br/>config, contracts, design-system,<br/>fhir, logger, middleware"]
    DS["Design System<br/>Consistencia visual, accesibilidad,<br/>tokens y Storybook"]
    FHIR["FHIR Package<br/>Mappers, normalizacion clinica,<br/>interoperabilidad"]
    MW["Middleware<br/>Auth, validacion, errores"]
  end

  subgraph PRODUCT["Capa 4: Productos MVP"]
    MVP1["condition-mvp<br/>CRUD Condition + pacientes + observaciones"]
    MVP2["producto1<br/>Producto en evolucion"]
    MVP3["ips-fhir-mvp<br/>Detectado por memoria operacional"]
    FRONT["*-front<br/>React/Vite/Tailwind"]
    BACK["*-back<br/>Node/Express/Postgres"]
  end

  subgraph RUNTIME["Capa 5: Runtime e infra"]
    DB["PostgreSQL local<br/>soc-db-source, modular-api-db,<br/>compose raiz"]
    AUTH["Keycloak<br/>OIDC/SSO futuro"]
    OBS["Sentry + logs<br/>Observabilidad inicial liviana"]
    CLOUD["AWS target<br/>ECS/Fargate o EKS, RDS,<br/>CloudWatch, secretos, backups"]
  end

  PHIL --> DOCS
  PHIL --> ORCH
  DOCS --> ORCH
  OPS --> ORCH
  ORCH --> TPL
  ORCH --> PKG
  TPL --> MVP1
  PKG --> MVP1
  MVP1 --> DB

  DOCS --> OPS
  AG --> ORCH
  OPS --> ORCH
  WORKSPACE --> TPL
  WORKSPACE --> PKG

  ORCH --> NEWMVP
  ORCH --> NEWDB
  ORCH --> NEWPKG
  ORCH --> NEWTPL
  ORCH --> P2T
  ORCH --> IMPLEMENT

  NEWMVP --> TPL
  NEWMVP --> PKG
  NEWMVP --> MVP1
  NEWDB --> DB
  IMPLEMENT --> MVP1

  TPL --> FRONT
  TPL --> BACK
  PKG --> FRONT
  PKG --> BACK
  DS --> FRONT
  FHIR --> BACK
  MW --> BACK

  FRONT --> BACK
  BACK --> DB
  BACK --> AUTH
  BACK --> OBS
  DB --> CLOUD
  AUTH --> CLOUD
  OBS --> CLOUD
```

## 3. Flujo de orquestacion, skills y trazabilidad

### 3.1 Entrada, contratos y preflight

```mermaid
sequenceDiagram
  autonumber
  participant U as Usuario
  participant W as Wizard
  participant CLI as CLI
  participant OPS as Ops
  participant PO as Orquestador
  participant FS as Filesystem

  U->>W: Solicita crear o implementar MVP
  W->>CLI: Normaliza accion
  CLI->>OPS: Lee skill-registry.json
  CLI->>OPS: Valida input con schemas
  CLI->>OPS: Consulta memoria operacional
  CLI->>PO: Ejecuta preflight determinista
  PO->>FS: Verifica templates reales
  PO->>FS: Verifica packages reales
  PO->>FS: Verifica rutas, nombres y puertos
  PO->>CLI: Devuelve resultado de preflight
```

### 3.2 Provisioning de MVP con new:mvp

```mermaid
sequenceDiagram
  autonumber
  participant PO as Orquestador
  participant MVP as MVP worker
  participant TPL as Templates
  participant PKG as Packages
  participant INF as Infra worker
  participant FS as Filesystem
  participant PLAN as Reportes

  PO->>MVP: Delega creacion de MVP
  MVP->>FS: Crea carpeta del MVP
  MVP->>TPL: Copia templates front y back
  MVP->>PKG: Configura dependencias workspace
  MVP->>INF: Resuelve base de datos
  INF->>FS: Puede crear stack Postgres local
  MVP->>FS: Ajusta package names, env y scripts
  MVP->>FS: Genera README y skill local
  MVP->>PLAN: Guarda reporte JSON
```

### 3.3 Implementacion por fases y otros comandos

```mermaid
sequenceDiagram
  autonumber
  participant PO as Orquestador
  participant DEL as Delivery worker
  participant INF as Infra worker
  participant TPL as Template worker
  participant FS as Filesystem
  participant PLAN as Reportes
  participant U as Usuario

  alt implement:mvp
    PO->>DEL: Delega implementacion funcional
    DEL->>FS: Verifica que el MVP exista
    DEL->>FS: Genera IMPLEMENTATION_PLAN.md
    DEL->>PLAN: Registra estado de fase
    DEL->>FS: Ejecuta una fase por iteracion
    DEL->>PLAN: Guarda reporte de fase
    DEL->>U: Solicita aprobacion para avanzar
  else new:db
    PO->>INF: Delega DB local
    INF->>FS: Crea compose, SQL, seed y README
    INF->>PLAN: Reporta ciclo up down reset
  else new:p2t
    PO->>TPL: Delega promocion a template
    TPL->>FS: Analiza origen y parametriza destino
    TPL->>PLAN: Reporta riesgos y adopcion
  end
```

## 4. Flujo runtime de un MVP de salud

```mermaid
flowchart LR
  USER["Usuario<br/>operator / supervisor / admin futuro"] --> FRONT["MVP Front<br/>React + Vite + TypeScript<br/>Tailwind + Router + Zustand"]

  FRONT --> DS["@platform/design-system<br/>Button, Input, Select, Modal,<br/>AppLayout, AppHeader, Card,<br/>Toaster, LoadingSpinner,<br/>tokens theme.css"]
  FRONT --> CONTRACTS["@platform/contracts<br/>DTOs y contratos compartidos"]
  FRONT --> API["Backend API<br/>Node + Express + TypeScript"]

  API --> AUTH["Auth Layer<br/>JWT actual en boilerplate<br/>Keycloak/OIDC como fase siguiente"]
  API --> MW["@platform/middleware<br/>auth, validation, errors,<br/>request-id"]
  API --> LOGGER["@platform/logger<br/>logs estructurados,<br/>correlationId recomendado"]
  API --> CONFIG["@platform/config<br/>env, defaults y validacion futura"]
  API --> FHIR["@platform/fhir<br/>mapeo modelos internos hacia FHIR"]
  API --> DB["PostgreSQL local"]

  DB --> SOC["soc-db-source<br/>puerto 55433<br/>usuarios seed admin@mail.com/user@mail.com<br/>pacientes Ana Perez/Carlos Gomez<br/>observaciones clinicas<br/>IDs enteros legacy"]
  DB --> MODDB["modular-api-db<br/>puerto dev 55434<br/>puerto test 55435<br/>contacts, activities,<br/>patients, observations"]

  API --> ENDPOINTS["Endpoints comunes<br/>POST /auth/login<br/>POST /auth/register<br/>GET /patients<br/>GET /patients/:id<br/>GET /patients/:id/observations<br/>POST /patients/:id/observations<br/>PUT /observations/:id<br/>DELETE /observations/:id"]

  API --> CONDITION["Extension condition-mvp<br/>GET /conditions<br/>GET /conditions/:id<br/>GET /conditions/patient/:id<br/>POST /conditions<br/>PUT /conditions/:id<br/>DELETE /conditions/:id"]

  FRONT --> HL7["HL7 Terminology remoto<br/>observation-category.json<br/>fallback local: vital-signs, exam, laboratory"]

  API --> SENTRY["Sentry runtime<br/>DSN por app, env, release,<br/>filtrado de datos sensibles"]
  API --> DOCKER["Docker Desktop logs<br/>observabilidad inicial simple"]
  API --> KEYCLOAK["Keycloak local<br/>puerto 8080<br/>realm, clients, redirect URIs, CORS"]

  subgraph PRODUCTS["Productos actuales"]
    CFMVP["condition-mvp<br/>front 5172, back 3002<br/>FHIR Condition"]
    P1["producto1<br/>front/back declarados<br/>scripts pendientes"]
    IPS["ips-fhir-mvp<br/>registrado en component-catalog"]
  end

  CFMVP --> FRONT
  P1 --> FRONT
  IPS --> FRONT

  subgraph CLOUD_TARGET["Evolucion cloud target"]
    ECS["APIs Node<br/>ECS/Fargate o EKS"]
    RDS["PostgreSQL<br/>RDS"]
    CW["Observabilidad<br/>CloudWatch + Sentry"]
    IDP["Identidad<br/>Keycloak dedicado o IdP corporativo"]
    SEC["Red privada, secretos,<br/>backups, alertas, promociones CI/CD"]
  end

  API -.-> ECS
  DB -.-> RDS
  SENTRY -.-> CW
  KEYCLOAK -.-> IDP
  ECS --> SEC
  RDS --> SEC
  CW --> SEC
  IDP --> SEC
```
