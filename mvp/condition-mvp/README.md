# condition-mvp

Producto MVP para gestionar el recurso FHIR `Condition` sobre la base del boilerplate front/back.

## Estructura

- `condition-mvp-front`: React + Vite + Design System.
- `condition-mvp-back`: Node + Express + PostgreSQL.

## Puertos

- Frontend: `5172`
- Backend: `3002`

## Arranque rapido

1. Instalar dependencias:
   - `npm run install:all`
2. Ejecutar migraciones:
   - `npm run db:migrate`
3. Levantar backend:
   - `npm run dev:back`
4. Levantar frontend:
   - `npm run dev:front`

## Endpoints Condition

- `GET /conditions`
- `GET /conditions/:id`
- `GET /conditions/patient/:id`
- `POST /conditions`
- `PUT /conditions/:id`
- `DELETE /conditions/:id`
