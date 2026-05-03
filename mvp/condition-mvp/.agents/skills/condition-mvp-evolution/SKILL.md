---
name: condition-mvp-evolution
description: >
  Evoluciona condition-mvp agregando capacidades clinicas alrededor del recurso
  Condition sin romper el baseline front/back de fase 1.
---

# Condition MVP Evolution Skill

## Objetivo

Extender `condition-mvp` por iteraciones controladas manteniendo compatibilidad
con los contratos del backend y la experiencia base del frontend.

## Orden operativo

1. Validar estado actual de rutas y migraciones de `Condition`.
2. Implementar una mejora por iteracion (filtros, paginacion, FHIR enrichment, etc.).
3. Agregar migracion SQL si cambia esquema.
4. Verificar build front/back y pruebas backend.

## Proximas evoluciones sugeridas

- Filtros por `clinical_status` y rango de fecha.
- Endpoint `GET /conditions/:id/fhir` con salida FHIR R4.
- Formulario de alta con selector de paciente y validaciones UI.
- Test de integracion para CRUD completo de `Condition`.
