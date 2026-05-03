# react-app-boilerplate

Frontend React + Vite para login, pacientes y observaciones.

## Stack y puertos

- React 18 + TypeScript + Vite
- React Router DOM 6
- Tailwind + Radix UI
- Frontend: `http://localhost:5170`
- Backend esperado: `http://localhost:3000`

## Variables de entorno

Crear/editar `.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Flujo funcional

- Login contra `POST /auth/login`.
- Rutas protegidas:
  - `/patients`
  - `/patients/:id`
- Si `GET /patients/:id/observations` responde `401`, hace signout y vuelve al login.
- Si responde otro error (`400/500`), no cierra sesion automaticamente.

## Nota sobre categorias HL7

La pantalla de observaciones intenta cargar categorias desde:

- `https://terminology.hl7.org/6.1.0/CodeSystem-observation-category.json`

Como ese origen puede bloquear CORS, el frontend usa fallback local:

- `vital-signs`
- `exam`
- `laboratory`

## Compatibilidad actual con DB semilla

La DB local semilla usa pacientes con `id` numerico (`1`, `2`), y la app ya esta ajustada para consumirlos sin redireccionar al login por error de formato de ID.
