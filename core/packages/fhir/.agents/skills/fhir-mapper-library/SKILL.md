---
name: fhir-mapper-library
description: >
  Crea y mantiene funciones reutilizables en @platform/fhir para mapear datos
  minimos del dominio a recursos FHIR estandar (R4), facilitando adopcion en
  APIs y frontends de productos nuevos.
---

# FHIR Mapper Library Skill

## Objetivo

Convertir `@platform/fhir` en libreria utilitaria compartida entre productos,
con funciones de transformacion y tipos seguros.

## Alcance minimo

- Tipos base por recurso soportado.
- Mappers de entrada minima -> recurso FHIR valido.
- Helpers de referencia/coding reutilizables.
- API publica limpia desde `src/index.ts`.

## Ejemplos de funciones esperadas

- `toFhirCondition(input)`
- `toFhirMedication(input)` o `toFhirMedicationRequest(input)`
- `toFhirPatientReference(patientId)`
- `toCodeableConcept(system, code, display?)`

## Reglas de implementacion

1. Mantener funciones puras (sin IO ni acceso a DB).
2. Inputs minimos, outputs FHIR predecibles.
3. Tipado estricto en TypeScript.
4. Validaciones de campos obligatorios antes de devolver recurso.
5. No acoplar a un producto puntual.

## Flujo al agregar recurso nuevo

1. Agregar tipos en `src/`.
2. Agregar mapper dedicado en `src/`.
3. Exportar en `src/index.ts`.
4. Actualizar README/skill con el nuevo mapper.
5. Ejecutar `pnpm run build`.

## Consumption contract

- Se consume como libreria buildada (`dist`) al estilo registry interno.
- No importar archivos internos desde productos; usar solo exports publicos.

## Definition of Done

1. Build exitoso en `core/packages/fhir`.
2. Mapper exportado y usable desde otro proyecto.
3. Documentacion de uso minima actualizada.
