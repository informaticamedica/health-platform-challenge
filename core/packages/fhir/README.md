# @platform/fhir

Utilidades compartidas para interoperabilidad basada en FHIR.

## Objetivo

- Encapsular mapeos y helpers ligados al dominio clinico.
- Evitar duplicacion de logica FHIR en cada backend.

## Scripts

- `pnpm run build`: compila TypeScript con `tsc -p tsconfig.json`.

## Salida

- `dist/index.js`
- `dist/index.d.ts`

## Uso recomendado

- Ubicar conversiones de modelos internos <-> recursos FHIR.
- Mantener reglas de validacion y normalizacion en un unico punto.
