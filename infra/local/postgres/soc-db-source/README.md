# soc-db-source

Base de datos local derivada de `C:\Users\Juan\Documents\git\soc\backend\src\db`.

## Que levanta

- Un contenedor PostgreSQL 16 en el puerto `55433`.
- SSL habilitado con certificado autofirmado para conexiones locales.
- Ejecuta automaticamente los archivos `.sql` de `./sql` al inicializar un volumen nuevo.
- Carga usuarios semilla al inicializar: `admin@mail.com` y `user@mail.com`.
- Carga pacientes/observaciones semilla para pruebas de frontend y backend.

## Uso

Desde esta carpeta:

```bash
docker compose up -d --build
```

Para recrear y volver a ejecutar SQL desde cero:

```bash
docker compose down -v
docker compose up -d --build
```

## Credenciales

- DB: `soc`
- User: `soc`
- Password: `soc`

## Usuarios semilla

- `admin@mail.com`
- `user@mail.com`
- Password para ambos: `Test1234` (cumple criterio del backend: minimo 8 caracteres)

## Datos clinicos semilla

- Pacientes:
  - `Ana Perez` (`id` esperado: `1`)
  - `Carlos Gomez` (`id` esperado: `2`)
- Observaciones:
  - Ana: 2 observaciones
  - Carlos: 3 observaciones

## Comportamiento de volumen

- `docker compose up -d` mantiene el estado actual del volumen y no reinicializa datos.
- `docker compose up -d --force-recreate` recrea contenedor pero mantiene volumen (no reinicializa SQL).
- `docker compose down -v` y luego `docker compose up -d --build` recrea desde cero y vuelve a ejecutar los SQL de `./sql`.

## Orden de SQL al iniciar en limpio

Los `.sql` se ejecutan en orden alfabetico dentro de `./sql`:

- `ddl.fhir.sql`
- `ddl.sql`
- `zz.seed.users.sql`

El `ddl.sql` final define el esquema operativo actual (IDs enteros) y `zz.seed.users.sql` inserta seeds compatibles con ese esquema.
