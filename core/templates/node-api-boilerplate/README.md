# node-api-boilerplate

Backend Node.js + Express + TypeScript para auth, pacientes y observaciones.

## Stack y puertos

- Node + Express
- PostgreSQL (`pg`)
- Joi (validaciones)
- JWT + bcrypt
- API local: `http://localhost:3000`

## Variables de entorno

Ejemplo recomendado para conectar con `infra/local/postgres/soc-db-source`:

```env
DB_USER=soc
DB_HOST=localhost
DB_NAME=soc
DB_PASSWORD=soc
DB_PORT=55433
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false
PORT=3000
JWT_SECRET=secret
```

## Scripts

```bash
pnpm run dev
pnpm run build
pnpm run start
pnpm run test:integration
```

## Endpoints principales

- `POST /auth/login`
- `POST /auth/register`
- `GET /patients`
- `GET /patients/:id`
- `GET /patients/:id/observations`
- `POST /patients/:id/observations`
- `PUT /observations/:id`
- `DELETE /observations/:id`

## Notas importantes

- `idSchema` de params ahora acepta UUID o entero positivo para convivir con seeds legacy/int.
- Conexion SSL configurable por env:
  - `DB_SSL=true` habilita SSL
  - `DB_SSL_REJECT_UNAUTHORIZED=false` para cert autofirmado local
- Build de TypeScript compila a `dist`.
- Los tests de integracion validan login, lectura de pacientes y lectura/edicion de observaciones.
