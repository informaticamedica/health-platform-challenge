---
name: react-product-scaffold
description: >
  Frontend scaffold para crear productos nuevos con la misma arquitectura del
  react-app-boilerplate. Incluye layout minimo obligatorio (Header, Layout,
  AuthGuard, LoginCard), rutas base, wiring de auth y consumo de
  @platform/design-system.
---

# React Product Scaffold Skill

## Objetivo

Crear rapidamente un frontend nuevo (en un proyecto `*-front`) que mantenga la
misma estructura y comportamiento del boilerplate actual.

## Entradas esperadas

- `productName`: nombre del producto.
- `resourceNames`: recursos FHIR objetivo (ejemplo: `Condition`, `Medication`).
- `apiBaseUrl`: URL base backend (default `http://localhost:3000`).

## Estructura obligatoria

Mantener estos bloques:

- Entry: `src/main.tsx`
- Router: `src/App.tsx`
- Auth context: `src/context/auth.tsx`
- Services: `src/services/backend.ts` y `src/services/api.ts`
- Layout: `src/components/layouts/Layout.tsx` + `src/components/layouts/Header.tsx`
- Auth UI: `src/components/auth/LoginCard.tsx` + `src/components/auth/AuthGuard.tsx`

## Checklist de integracion DS

1. Definir dependencia en `package.json` con ruta relativa correcta segun ubicacion del producto.
   - Para `mvp/<producto>/<producto>-front`, usar:
   - `"@platform/design-system": "file:../../../core/packages/design-system/dist"`
2. Importar tema global en `src/globals.css`:
   - `@import "@platform/design-system/styles/theme.css";`
3. Asegurar `tailwind.config.ts` con escaneo DS:
   - `./node_modules/@platform/design-system/dist/**/*.{js,ts,jsx,tsx,mdx}`
   - `../../core/packages/design-system/dist/**/*.{js,ts,jsx,tsx,mdx}`
4. Usar componentes del DS (no duplicar UI local equivalente).

## Layout minimo obligatorio

### 1) `Header`

- Basado en `AppHeader` del DS.
- Debe mostrar identidad del producto y acciones de sesion.
- Accion de logout conectada a `signOut` del auth context.

### 2) `Layout`

- Basado en `AppLayout` del DS.
- Inyectar `header={<Header />}`.
- Renderizar `children` para zonas funcionales.

### 3) `AuthGuard`

- Bloquea rutas privadas.
- Mientras carga sesion: mostrar `LoadingSpinner`.
- Si no autenticado: redirigir con `RedirectScreen`.

### 4) `LoginCard`

- Formulario minimo email/password.
- Componentes DS: `Input`, `Button`, `LoadingSpinner`, `useToast`.
- Exito: navegar a `/patients` (o dashboard del recurso).
- Error: mostrar toast destructivo.

### 5) `Toaster`

- Montar una instancia global en `src/App.tsx`.

## Rutas minimas

- `/` -> Login/Home
- `/patients` -> listado protegido
- `/patients/:id` -> detalle protegido

Si el recurso solicitado es `Condition` o `Medication`, agregar rutas analogas
sin romper las existentes:

- `/conditions`, `/conditions/:id`
- `/medications`, `/medications/:id`

## Convenciones de consumo API

- Lecturas en `src/services/backend.ts`.
- Mutaciones en `src/services/api.ts`.
- Header `Authorization: Bearer <token>`.
- Manejo con `handleResponseBack/handleErrorBack`.
- Solo cerrar sesion automaticamente con `401`.

## Definition of Done

1. Compila con `npm run build`.
2. Navegacion de login y rutas protegidas funcional.
3. UI base renderiza solo con componentes DS para shell y auth.
4. Variables de entorno documentadas en `.env` (`VITE_API_URL`).
5. Estructura final es equivalente al boilerplate.
