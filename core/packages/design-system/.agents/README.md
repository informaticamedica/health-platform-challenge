# Skills design-system

Creacion de componentes, tokens y documentacion en Storybook.

## Skills disponibles

- `skills/design-system-component-factory/SKILL.md`: inventario de componentes actuales y flujo para crear nuevos componentes con patron composite.

## Regla de publicacion interna

- Si se crea un componente nuevo reutilizable (tabla, calendario, skeleton, etc.), se debe:
  1. exportar en `src/**/index.ts` y `src/index.ts`,
  2. crear `*.stories.tsx`,
  3. agregar pruebas segun el harness vigente,
  4. ejecutar build,
  5. actualizar la skill con su existencia y forma de uso.
