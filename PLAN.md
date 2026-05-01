# Registro de plan y proceso

Este archivo deja trazabilidad de:

1. El contexto y decisiones tomadas durante la conversacion.
2. El prompt completo usado para crear la estructura inicial.
3. El orden de ejecucion acordado.

## Resumen del proceso conversado

### Objetivo principal

- Disenar una plataforma local simplificada, defendible en entrevista tecnica (TL/Arquitecto SR), con foco en delivery por boilerplates.

### Preferencias definidas por el usuario

- El primer resultado debia incluir esqueleto del repo vacio con carpetas y README minimos.
- El analisis y la documentacion debian quedar en el repo nuevo.
- Monorepo usando `npm` (no `pnpm`).
- Pipeline principal solo cuando exista codigo real.
- Observabilidad inicial simplificada: Sentry runtime (SaaS) + logs por Docker Desktop.
- Omitir stack pesada de logs al inicio (sin Loki/Grafana/Promtail en la primera etapa).
- Seguridad con Keycloak a partir de fase auth/middleware.
- OIDC real, multiples clients para SSO, usuarios locales.
- Roles base: `operator`, `supervisor`, `admin`.
- Permisos atomicos con formato `[entidad].[accion]` y luego roles compuestos.
- Design System con shadcn + Tailwind + Storybook, usado como contrato entre squads.
- Front consumiendo build estatico del DS.
- Backend base Node + Express + TypeScript.
- Una sola instancia PostgreSQL local.
- CI/CD local recomendado: GitHub Actions + `act`.
- SonarQube no obligatorio al inicio (paso simulado permitido).
- Trivy considerado en pipeline de forma inicial simulada.
- Prioridad de negocio/entrevista en este orden:
  1. Capacidad de delivery con boilerplates.
  2. Migracion legacy sin corte.
  3. Observabilidad operativa 24x7.
  4. Gobierno tecnico de squads.
  5. Seguridad y compliance.

### Ajustes posteriores solicitados

- Simplificar aun mas la plataforma inicial.
- Agregar `core/packages/fhir`.
- Estandarizar carpeta `.agents/` para documentar skills locales en cada modulo.
- Ejecutar en este orden:
  1. Estructura completa + README + `.agents/README.md`.
  2. Revisar `C:\Users\Juan\Documents\git\soc` y armar boilerplates front/back.
  3. Crear packages y consumo mediante `file:`.
  4. Armar dockers de infra faltante, reutilizando DB de `soc`.

## Prompt completo usado como base de construccion

```md
# Rol del agente

Actua como Technical Leader / Arquitecto SR.

Tu tarea es disenar e implementar por fases una plataforma local simplificada, orientada a entrevista tecnica, para demostrar:
1) capacidad de delivery con boilerplates,
2) migracion legacy sin corte,
3) observabilidad operativa,
4) gobierno tecnico de squads,
5) seguridad base.

# Modo de trabajo obligatorio

- Si estoy en Plan Mode / Read-Only, NO editar nada; solo analizar y planificar.
- Si falta informacion critica, preguntar antes de decidir.
- Priorizar simplicidad y ejecucion por fases.
- No sobredimensionar.

# Repositorios y contexto

- Repositorio historico a revisar: `C:\Users\Juan\Documents\git\soc`
- Nuevo repositorio de trabajo: `platform-challenge`
- Monorepo con npm workspaces.
- Stack base:
  - Backend: Node.js + Express + TypeScript
  - Frontend: React + TypeScript + Tailwind
  - DS: shadcn + tailwind + storybook
  - Auth: Keycloak (fase de auth)
  - Observabilidad inicial: Sentry SaaS runtime + logs en Docker Desktop
  - DB: PostgreSQL unica instancia

# Estructura objetivo obligatoria

(usar exactamente esta estructura; cada carpeta principal/subproyecto debe tener README.md y carpeta .agents/ con README explicando skills)

platform-challenge/
  README.md
  package.json
  package-lock.json
  .gitignore
  .env.example
  docker-compose.yml
  .agents/README.md

  core/
    README.md
    .agents/README.md
    templates/
      README.md
      node-api-boilerplate/
        README.md
        .agents/README.md
      react-app-boilerplate/
        README.md
        .agents/README.md
      legacy-adapter-boilerplate/
        README.md
        .agents/README.md
    packages/
      README.md
      design-system/
        README.md
        .agents/README.md
      middleware/
        README.md
        .agents/README.md
        src/
          auth/
          http/
          validation/
          errors/
      logger/
        README.md
        .agents/README.md
      config/
        README.md
        .agents/README.md
      contracts/
        README.md
        .agents/README.md
      fhir/
        README.md
        .agents/README.md

  infra/
    README.md
    .agents/README.md
    local/
      README.md
      keycloak/
        README.md
      postgres/
        README.md
      sentry/
        README.md
    aws-target/
      README.md

  mvp/
    README.md
    .agents/README.md
    producto1/
      README.md
      .agents/README.md
      producto1-front/
        README.md
        .agents/README.md
      producto1-back/
        README.md
        .agents/README.md

# Orden de ejecucion obligatorio (cuando se habilite implementacion)

1) Crear la estructura de carpetas completa + README.md minimos en cada carpeta indicada + `.agents/README.md` en cada nivel solicitado.
2) Revisar `C:\Users\Juan\Documents\git\soc` y construir los boilerplates de front y back en `core/templates`.
3) Crear packages reutilizables en `core/packages` (incluyendo `fhir`) y hacer que los boilerplates los consuman con dependencia `file:`.
4) Armar/ajustar Docker de infra faltante en `infra/local`, reutilizando la base de DB proveniente de `C:\Users\Juan\Documents\git\soc` cuando aplique.

# Reglas de implementacion

- No borrar ni mover archivos existentes sin justificacion explicita.
- No meter features no pedidas.
- README de cada modulo: proposito, que expone, como se consume, scripts esperados y estado de madurez.
- Mantener minima cantidad de contenedores para funcionar.
- No agregar observabilidad compleja al inicio (sin Loki/Grafana al principio).
- Sentry solo runtime app en primeras fases.
- Pipeline principal GitHub Actions + act cuando ya exista codigo.
- Incluir pasos simulados de Sonar y Trivy en estrategia de calidad.

# Entregables por iteracion

Al terminar cada bloque, responder con:
1) Archivos/carpetas creados o modificados.
2) Decisiones tecnicas tomadas y por que.
3) Riesgos detectados.
4) Siguiente paso recomendado.

# Idioma y estilo de salida

- Todo en espanol.
- Concreto, tecnico y defendible en entrevista.
- Sin frases genericas.
```

## Orden de ejecucion acordado

1. Crear estructura de carpetas completa con `README.md` y `.agents/README.md`.
2. Revisar `C:\Users\Juan\Documents\git\soc` y construir boilerplates de front y back.
3. Crear packages compartidos (incluyendo `fhir`) y conectarlos en boilerplates con dependencias `file:`.
4. Armar infraestructura Docker faltante reutilizando base SQL del repo `soc`.

## Estado actual del plan

- [x] Estructura base creada.
- [x] Boilerplates iniciales creados y conectados a packages con `file:`.
- [x] Package `fhir` agregado.
- [x] Infra local minima (`postgres` + `keycloak`) y SQL base importada desde `soc`.
- [ ] Endurecer boilerplates con mayor reutilizacion directa de `soc` (siguiente iteracion).
