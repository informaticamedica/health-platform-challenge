# Core Packages

Paquetes internos compartidos del ecosistema `@platform/*`.

## Catalogo

- `@platform/config`: carga y validacion de configuracion/entorno.
- `@platform/contracts`: tipos y contratos compartidos entre front/back.
- `@platform/design-system`: componentes UI y tokens visuales.
- `@platform/fhir`: utilidades para interoperabilidad FHIR.
- `@platform/logger`: logging estructurado y trazabilidad.
- `@platform/middleware`: middlewares de API (auth, errores, validacion).

## Convenciones

- Version inicial: `0.1.0`.
- Consumo: `workspace:*`.
- Build cuando aplica: TypeScript hacia `dist/`.

## Uso recomendado

1. Definir contratos/tipos en `contracts`.
2. Reutilizar validaciones y middleware en APIs.
3. Compartir UI base mediante `design-system`.
4. Encapsular integraciones FHIR en `fhir`.

## Flujo de trabajo

- Construir paquetes compilables cuando cambian APIs publicas.
- Mantener cambios backward-compatible en lo posible.
- Documentar en cada README del paquete su alcance y limites.
