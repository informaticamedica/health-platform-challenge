---
name: react-product-scaffold
description: >
  Worker frontend para new:template y new:mvp. Mantiene arquitectura del
  react-app-boilerplate y consumo de @platform/design-system.
---

# React Product Scaffold

## Comando fuente

- `new:template` cuando `layer=front`
- `new:mvp` cuando incluye frontend

## Contrato tecnico

1. Mantener estructura base (`main`, router, auth, services, pages).
2. Consumir `@platform/design-system` como dependencia interna.
3. Variables por `.env` (`VITE_API_URL`).
4. No introducir frameworks fuera del baseline del template.

## Execution Order

1. Copiar base front.
2. Ajustar metadata y scripts.
3. Ajustar wiring DS y contracts.
4. Registrar rutas minimas del producto.

## Definition of Done

1. `pnpm run build` exitoso.
2. Login/rutas protegidas funcionales.
3. README del template/producto actualizado.
