---
name: template-promoter
description: >
  Convierte un proyecto existente en un template reusable para el monorepo.
  Analiza repo remoto o path local, identifica componentes reutilizables y
  propone estructura parametrizable en core/templates.
---

# Template Promoter

## Entrada obligatoria

- `name`: nombre del template objetivo.
- `repoUrl` o `projectPath`: origen a analizar.
- `target`: default `core/templates`.

## Flujo obligatorio

1. Preflight de acceso al origen.
2. Inventario de estructura y dependencias.
3. Clasificacion por capas: front, back, db, infra, docs.
4. Deteccion de hardcodes para parametrizacion.
5. Propuesta de template reusable + checklist de adopcion.

## Criterios de reutilizacion

1. Scripts consistentes (`dev`, `build`, `test`).
2. Configuracion por env sin secretos embebidos.
3. Separacion clara entre dominio y framework.
4. Dependencias no acopladas a rutas privadas.

## Salida obligatoria

- Plan con carpetas objetivo en `core/templates/<name>`.
- Lista de archivos a parametrizar.
- Riesgos y supuestos.

## Definition of Done

1. Proyecto origen analizado.
2. Mapeo reusable documentado.
3. Propuesta lista para ejecutar con `new:template`.
