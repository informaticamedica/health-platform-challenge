# Orquestacion Headless

Este directorio define el contrato determinista del orquestador general.

## Archivos clave

- `skill-registry.json`: mapeo `new:*` -> skill/worker.
- `schemas/*.json`: contratos de input/output.
- `examples/*.json`: configuraciones de ejemplo.
- `plans/*.json`: reportes de ejecucion generados.

## Comandos

```bash
npm run new:mvp -- ops/examples/new-mvp.json
npm run new:db -- ops/examples/new-db.json
npm run new:package -- ops/examples/new-package.json
npm run new:template -- ops/examples/new-template.json
npm run new:p2t -- ops/examples/new-p2t.local.json
npm run new:p2t -- ops/examples/new-p2t.repo-local-boilerplate.json
```

Los comandos crean artefactos reales y registran el reporte en `ops/plans/`.
