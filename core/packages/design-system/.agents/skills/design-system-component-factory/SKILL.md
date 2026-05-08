---
name: design-system-component-factory
description: >
  Gestiona el catalogo del design system y define el proceso exacto para crear
  componentes nuevos reutilizables con patron composite, Storybook, pruebas y
  build de libreria.
---

# Design System Component Factory Skill

## Objetivo

Mantener `@platform/design-system` como libreria reutilizable para todos los
productos nuevos.

## Referencia de catalogo

Ver catalogo vivo en: `references/component-catalog.md`.

## Arquitectura actual

- Entrada publica: `src/index.ts`
- Dominios:
  - `src/ui/*`
  - `src/layout/*`
  - `src/feedback/*`
  - `src/display/*`
  - `src/hooks/*`

## Como crear un componente nuevo (patron composite)

Tomar `src/ui/select.tsx` como referencia:

1. Componer primitives y subcomponentes (`Root`, `Trigger`, `Content`, etc.).
2. Exponer API principal + subcomponentes estaticos.
3. Tipar props en TypeScript de forma estricta.
4. Mantener estilos con tokens/vars ya existentes.
5. Evitar logica de negocio de producto dentro del DS.

## Flujo obligatorio al agregar componente

1. Crear componente en dominio correcto (`src/ui`, `src/layout`, etc.).
2. Exportarlo en `src/<domain>/index.ts`.
3. Exportarlo en `src/index.ts`.
4. Crear story en `src/<domain>/<name>.stories.tsx`.
5. Agregar pruebas:
   - Interaccion de Storybook (`play`) como baseline.
   - Unit test adicional si el componente agrega logica no trivial.
6. Ejecutar:
   - `pnpm run test`
   - `pnpm run build`
7. Actualizar `references/component-catalog.md` con nombre, ubicacion y uso.
8. Actualizar esta skill si cambia la convencion de autoria.

## Regla para demandas desde productos

Si un producto necesita componente faltante reutilizable (tabla, calendario,
skeletons, etc.), implementarlo primero aqui, buildear y luego consumirlo desde
el producto.

## Consumption contract

- El paquete se consume como libreria buildada (`dist`).
- Export de estilos: `@platform/design-system/styles/theme.css`.

## Definition of Done

1. Componente exportado y consumible desde `@platform/design-system`.
2. Storybook actualizado.
3. Pruebas relevantes pasando.
4. Build de libreria exitoso.
5. Catalogo y skill actualizados con documentacion de uso.
