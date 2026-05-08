# modular-api-db

Local PostgreSQL infrastructure for `modular-api-boilerplate`.

## What it provides

- PostgreSQL 16 service for development on `55434`
- PostgreSQL 16 service for integration tests on `55435`
- Automatic schema and seed initialization on clean volumes

## Credentials

- User: `modular`
- Password: `modular`
- Dev database: `modular_dev`
- Test database: `modular_test`

## SQL initialization order

1. `sql/01_schema.sql`
2. `seed/default/zz_seed_phone_types.sql`

## Scripts

- `pnpm --filter ./infra/local/postgres/modular-api-db run up`
- `pnpm --filter ./infra/local/postgres/modular-api-db run down`
- `pnpm --filter ./infra/local/postgres/modular-api-db run reset`
- `pnpm --filter ./infra/local/postgres/modular-api-db run test:up`
- `pnpm --filter ./infra/local/postgres/modular-api-db run test:down`
- `pnpm --filter ./infra/local/postgres/modular-api-db run test:reset`
