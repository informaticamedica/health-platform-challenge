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

## Definition of Done

1. Plan documentado en el MVP.
2. Evidencia de validacion por fase.
3. Sin saltar fases sin confirmacion del usuario.
