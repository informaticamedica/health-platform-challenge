# Snapshots de Seed

Carpeta reservada para snapshots de datos semilla del entorno `modular-api-db`.

## Convencion recomendada

- Nombrar archivos con fecha y contexto (`YYYYMMDD-contexto.sql`).
- Documentar origen y objetivo del snapshot.

## Reglas de seguridad

- No incluir datos reales de pacientes ni secretos.
- Anonimizar o sintetizar datos antes de versionar.

## Uso

- Consumir snapshots desde scripts de carga/seed del proyecto DB.
