# AWS Target

Documentacion de referencia para el aterrizaje cloud del challenge.

## Proposito

- Definir una direccion de despliegue productiva.
- Mapear capacidades locales a servicios administrados de AWS.

## Mapeo recomendado (alto nivel)

- APIs Node -> ECS/Fargate o EKS.
- Base Postgres local -> RDS PostgreSQL.
- Observabilidad -> CloudWatch + Sentry.
- Identidad (Keycloak local) -> despliegue dedicado o federacion con IdP corporativo.

## Consideraciones

- Redes privadas, control de acceso y secretos gestionados.
- Pipelines de CI/CD con promociones por ambiente.
- Backups, alertas y estrategias de recuperacion.
