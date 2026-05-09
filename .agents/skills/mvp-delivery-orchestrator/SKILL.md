---
name: mvp-delivery-orchestrator
description: >
  Orquesta la implementacion funcional de un MVP ya creado. Trabaja en modo
  plan-first, define 2-3 fases y ejecuta una fase por iteracion con validacion
  del usuario antes de avanzar.
---

# MVP Delivery Orchestrator

## Comando fuente

- `implement:mvp`

## Contrato

1. Recibir `name` del MVP existente y `requirement`.
2. Generar `IMPLEMENTATION_PLAN.md` con 2-3 fases.
3. Ejecutar solo una fase por vez.
4. Esperar feedback del usuario antes de siguiente fase.

## Fases y mecanismos de verificacion

### Fase 1 - Scaffold Integrity

- Verifica que front/back respeten el template base (archivos requeridos presentes).
- Verifica package names unicos y scripts minimos (`dev:*`, `build:*`, `dev` si scope=ambos).
- Ejecuta `npm run install` en root MVP y luego `npm run dev` (smoke) validando que front y back inician.
- Genera reporte en `.orchestrator/reports/phase-1.*.json`.

### Fase 2 - Feature Progress

- Compara cambios contra baseline inicial del MVP.
- Exige cambios detectables en capas habilitadas (front y/o back segun scope).
- Ejecuta `npm run build` y `npm run dev` (smoke) al final de la fase.
- Genera reporte de diff y alertas en `.orchestrator/reports/phase-2.*.json`.

### Fase 3 - Hardening

- Verifica checklist de cierre: scripts de build/dev, documentacion minima y reporte final.
- Genera `.orchestrator/reports/phase-3.*.json`.

## Comandos operativos

- Plan: `implement:mvp --name <mvp> --phase 0 --confirm`
- Ejecutar fase: `implement:mvp --name <mvp> --phase <1|2|3> --confirm`
- Aprobar fase: `implement:mvp --name <mvp> --approve-phase <1|2|3> --confirm`

Regla dura: no ejecutar fase N+1 sin fase N aprobada.
Regla dura: no sobreescribir requirement original del plan si no se envio uno nuevo explicito.

## Definition of Done

1. Plan documentado en el MVP.
2. Evidencia de validacion por fase.
3. Sin saltar fases sin confirmacion del usuario.
