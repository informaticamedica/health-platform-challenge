# modular-api-boilerplate

Reusable backend template built with Node.js, Express, TypeScript, PostgreSQL, and Zod.

## Architecture

- Layered modules: `routes -> controllers -> services -> repositories`
- Shared utilities: validation, API response contract, SQLSTATE error mapping, logging
- SQL-first repositories with file-based queries and cached SQL loader
- Swagger/OpenAPI docs available at `/docs`

## Language convention

- Internal code, file names, and technical documentation are in English.
- User-facing API messages are in Spanish.

## Local setup

1. Install dependencies from repository root:

```bash
pnpm install
```

2. Create env files in this template folder:

```bash
copy .env.example .env
copy .env.test.example .env.test
```

3. Start database from repository root:

```bash
pnpm db:modular:up
```

4. Start API from repository root:

```bash
pnpm dev:back:modular
```

## Scripts

- `pnpm --filter ./core/templates/modular-api-boilerplate run dev`
- `pnpm --filter ./core/templates/modular-api-boilerplate run build`
- `pnpm --filter ./core/templates/modular-api-boilerplate run test`
- `pnpm --filter ./core/templates/modular-api-boilerplate run test:integration`

## Example domain

This template ships with an example contacts-and-activities domain:

- `POST /contacts`
- `GET /contacts/by-email`
- `GET /contacts/search`
- `GET /contacts/by-phone`
- `PATCH /contacts/:id`
- `DELETE /contacts/:id`
- `POST /activities`
- `GET /activities/search`

You can replace the example module while preserving the same architecture and testing setup.

## Health API compatibility

This template also implements the same public health API endpoints as `node-api-boilerplate`:

- `POST /auth/register`
- `POST /auth/login`
- `GET /patients`
- `GET /patients/:id`
- `GET /patients/:id/observations`
- `POST /patients/:id/observations`
- `POST /patients`
- `PUT /patients/:id`
- `DELETE /patients/:id`
- `GET /observations/categories`
- `GET /observations/loinc`
- `GET /observations/:id/fhir`
- `PUT /observations/:id`
- `DELETE /observations/:id`
