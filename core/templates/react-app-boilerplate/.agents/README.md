# Skills react-app-boilerplate

Guia para agentes que agregan rutas, vistas o integraciones API en este frontend.

## Skills disponibles

- `skills/react-product-scaffold/SKILL.md`: crea o reconstruye rapido un frontend completo con la misma estructura del boilerplate, incluyendo layout minimo (`Header`, `Layout`, `AuthGuard`, `LoginCard`) e integracion con `@platform/design-system`.

## Arquitectura rapida

- Entry: `src/main.tsx`
- Router: `src/App.tsx`
- Auth context: `src/context/auth.tsx`
- Paginas: `src/pages/**`
- Servicios HTTP: `src/services/backend.ts` y `src/services/api.ts`
- Estado: `zustand` en `src/hooks/useStore.ts`

## Como agregar una nueva ruta frontend

1. Crear pagina en `src/pages/<feature>/index.tsx`.
2. Agregar `Route` en `src/App.tsx`.
3. Si requiere auth, envolver en `ProtectedPage`.
4. Si hay links, usar `react-router-dom` (`Link`/`useNavigate`).

## Como integrar un endpoint nuevo del backend

1. Agregar funcion en `src/services/backend.ts` (lectura) o `src/services/api.ts` (mutaciones).
2. Enviar token en header `Authorization: Bearer <token>`.
3. Manejar respuesta con `handleResponseBack/handleErrorBack`.
4. Consumir desde la pagina/componente y actualizar store si corresponde.

## Reglas operativas

- Base URL por `VITE_API_URL`.
- No usar Next.js APIs ni imports `next/*`.
- En observaciones, no cerrar sesion por errores 400/500; solo por 401.
- Si falla carga externa HL7 por CORS, mantener fallback local de categorias.

## Regla de plantilla

- Si se pide crear un producto nuevo, usar `skills/react-product-scaffold/SKILL.md` como primera fuente de verdad antes de agregar nuevas vistas o rutas.
