# Infra

`infra/` agrupa infraestructura local para desarrollo y referencias de despliegue objetivo.

## Estructura

- `local/`: servicios para correr el proyecto en entorno de desarrollo.
- `registry/`: base para un registro privado de paquetes internos.
- `aws-target/`: orientacion de arquitectura destino en AWS.

## Principio operativo

- Desarrollo local primero (`infra/local/*`).
- Evolucion progresiva hacia topologia cloud definida en `aws-target`.
