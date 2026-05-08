# Postgres Local

Indice de stacks PostgreSQL usados en el challenge.

## Variantes disponibles

- `soc-db-source/`: base fuente para entorno local general.
- `modular-api-db/`: base dedicada al template modular y pruebas asociadas.

## Operacion

- Cada variante tiene su propio `package.json` con scripts `up/down/reset`.
- Se recomienda usar scripts del root cuando corresponda (`db:*` y `db:modular:*`).

## Buenas practicas

- Usar `reset` cuando haya drift de esquema o datos inconsistentes.
- Mantener snapshots/seed sin informacion sensible.
