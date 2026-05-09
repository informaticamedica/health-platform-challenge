# Orquestacion Headless

Este directorio define el contrato determinista del orquestador general.

## Archivos clave

- `skill-registry.json`: mapeo `new:*` -> skill/worker.
- `schemas/*.json`: contratos de input/output.
- `examples/*.json`: configuraciones de ejemplo.
- `plans/*.json`: reportes de ejecucion generados.
- `component-catalog.json`: memoria de componentes detectados en el repo.
- `memory.lock.json`: hash/version de la memoria para detectar drift.

## Comandos

```bash
npm run new
npm run new:mvp -- ops/examples/new-mvp.json
npm run new:db -- ops/examples/new-db.json
npm run new:package -- ops/examples/new-package.json
npm run new:template -- ops/examples/new-template.json
npm run new:p2t -- ops/examples/new-p2t.local.json
npm run implement:mvp -- ops/examples/implement-mvp.json
npm run new:memory:refresh
```

Nota: `cli.js` requiere `--confirm` para ejecutar creacion real. Sin `--confirm` solo hace preflight + preview.

Los comandos crean artefactos reales y registran el reporte en `ops/plans/`.

Nota: los `*.json` de `ops/plans/` se ignoran en git para evitar ruido de ejecucion.

`npm run new` incluye flujo guiado y opcion de describir en texto libre para inferir plan inicial.
La interfaz principal usa TUI con Ink (flechas + enter); si no carga Ink, usa modo clasico.
Con prompt simple como `crear un mvp que implemente ips de pacientes en fhir`, el wizard crea MVP y luego dispara `implement:mvp`.

`implement:mvp` trabaja en modo plan-first: genera fases y ejecuta una fase por iteracion con validacion del usuario.
