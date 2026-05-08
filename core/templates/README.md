# Templates

Plantillas base para crear aplicaciones y servicios consistentes dentro del challenge.

## Templates disponibles

- `react-app-boilerplate`: frontend React + Vite + TypeScript + Tailwind.
- `node-api-boilerplate`: API Node + Express + TypeScript.
- `modular-api-boilerplate`: backend modular por capas con testing integrado.
- `legacy-adapter-boilerplate`: base para integraciones con sistemas legacy.

## Criterio de uso

- Elegir `react-app-boilerplate` para nuevos frontends.
- Elegir `node-api-boilerplate` para APIs simples o MVP rapido.
- Elegir `modular-api-boilerplate` cuando se requiere arquitectura mas estricta por dominios.
- Elegir `legacy-adapter-boilerplate` cuando hay conectores o migracion progresiva.

## Relacion con MVP

Las carpetas de `mvp/*` suelen nacer copiando estas plantillas y adaptandolas por producto.
