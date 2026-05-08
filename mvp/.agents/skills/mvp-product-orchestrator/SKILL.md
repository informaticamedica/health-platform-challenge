---
name: mvp-product-orchestrator
description: >
  Crea productos MVP independientes dentro de mvp/, usando templates front/back,
  consumiendo design-system y package fhir, y coordinando skills por proyecto
  para implementar recursos como Condition o Medication.
---

# MVP Product Orchestrator Skill

## Objetivo

Desde `mvp/`, permitir pedidos del tipo:

- "crea un sistema que implemente el recurso FHIR Condition"
- "crea un sistema que implemente Medication"

y generar un producto similar al boilerplate con estructura:

- `mvp/<productName>/<productName>-front`
- `mvp/<productName>/<productName>-back`

## Comportamiento conversacional obligatorio

Antes de crear archivos, el agente debe:

1. Pedir al usuario una ficha de configuracion copiable/pegable con valores inicializados.
2. Analizar el requerimiento funcional (recursos, alcance, supuestos).
3. Listar dudas o decisiones clave.
4. Proponer plan por fases.
5. Pedir confirmacion explicita para ejecutar.

No se debe crear ninguna carpeta hasta completar estos 5 pasos.

### Regla anti-deriva (estricta)

Despues de la confirmacion del usuario:

1. No volver a fase de discovery abierta.
2. No hacer preguntas nuevas salvo bloqueo real.
3. Ejecutar el plan confirmado de forma deterministica.

El agente no debe responder con "thinking" narrativo ni texto de auto-razonado.

### Primera pregunta obligatoria (plantilla copiable)

La primera interaccion debe ofrecer este bloque para que el usuario pueda
copiar/pegar y editar facilmente:

```txt
nombre: condition-mvp
recurso-fhir: Condition
alcance-fase-1: CRUD-minimo
puerto-back: 3003
puerto-front: 5173
usar-core-design-system: si
usar-core-fhir: si
permitir-cambios-cross-project: no
db-migrate-comando: pnpm run db:migrate
```

Reglas:

- Todos los campos deben salir inicializados por defecto.
- Si el usuario no cambia un campo, se usa ese valor por defecto.
- `puerto-back` y `puerto-front` deben sugerirse automaticamente segun la
  regla de puertos del skill.
- Si `permitir-cambios-cross-project: no`, implementar faltantes dentro de
  `mvp/<productName>/`.

## Skills que debe consultar

1. `core/templates/react-app-boilerplate/.agents/skills/react-product-scaffold/SKILL.md`
2. `core/templates/node-api-boilerplate/.agents/skills/node-api-feature-factory/SKILL.md`
3. `core/packages/design-system/.agents/skills/design-system-component-factory/SKILL.md`
4. `core/packages/fhir/.agents/skills/fhir-mapper-library/SKILL.md`

## Regla de lectura obligatoria de skills

Antes de ejecutar cambios en cada capa, el agente debe leer la skill
correspondiente y aplicar sus reglas de implementacion:

- Frontend -> `react-product-scaffold`
- Backend -> `node-api-feature-factory`
- Design System -> `design-system-component-factory`
- FHIR library -> `fhir-mapper-library`

No se permite implementar cambios directos en una capa sin haber leido primero
su skill y haber aplicado sus convenciones.

### Limite de exploracion permitido

Una vez leidas las 4 skills base, queda prohibido explorar con glob recursivo
amplio. Usar solo lecturas puntuales de archivos necesarios para ejecutar.

Prohibido despues de confirmar:

- `Glob "**/*"`
- `Glob "core/**"` o `Glob "mvp/**"` sin filtro
- Re-lectura de arboles completos ya inspeccionados

Permitido despues de confirmar:

- Paths directos de templates a copiar
- Paths directos de `package.json`, `.env`, `.gitignore`, `tailwind.config.*`
- Paths directos de archivos del recurso solicitado

## Flujo de orquestacion

1. Leer como primer paso las 4 skills base y fijar sus reglas activas:
   - `core/templates/react-app-boilerplate/.agents/skills/react-product-scaffold/SKILL.md`
   - `core/templates/node-api-boilerplate/.agents/skills/node-api-feature-factory/SKILL.md`
   - `core/packages/design-system/.agents/skills/design-system-component-factory/SKILL.md`
   - `core/packages/fhir/.agents/skills/fhir-mapper-library/SKILL.md`
2. Crear carpeta de producto en `mvp/<productName>/`.
3. Copiar template frontend a `mvp/<productName>/<productName>-front`.
4. Copiar template backend a `mvp/<productName>/<productName>-back`.
5. Crear `mvp/<productName>/package.json` para orquestar front/back.
6. Configurar dependencias a paquetes compartidos buildados:
   - `@platform/design-system`
   - `@platform/fhir`
7. Ejecutar skill backend para recurso(s) solicitado(s).
8. Ejecutar skill frontend para vistas/rutas/UI minima del recurso.
9. Si faltan componentes reutilizables de UI:
   - implementarlos en `core/packages/design-system`,
   - crear stories/tests,
   - buildear DS,
   - actualizar skill/catalogo DS,
   - consumirlos desde `<productName>-front`.
10. Si faltan helpers de mapeo FHIR:
   - implementarlos en `core/packages/fhir`,
   - exportarlos,
   - buildear paquete,
   - actualizar skill FHIR,
   - consumirlos desde `<productName>-back`.
11. Crear skill local de evolucion en `mvp/<productName>/.agents/skills/<productName>-evolution/SKILL.md`.

### Orden de ejecucion obligatorio (sin desviaciones)

1. Leer skills de cada proyecto (front, back, DS, FHIR) y registrar reglas.
2. Calcular puertos.
3. Crear estructura `mvp/<productName>/` + `*-front` + `*-back`.
4. Copiar templates (sin `node_modules`, `dist`, `.agents`).
5. Crear `mvp/<productName>/package.json` raiz con scripts requeridos.
6. Ajustar front (`name`, DS path, `dev` port, `.env`, tailwind js/ts).
7. Ajustar back (`name`, fhir path, `PORT`, `.env`).
8. Implementar recurso solicitado siguiendo skill backend/frontend.
9. Verificar `.gitignore` en front/back.
10. Crear README y skill local de evolucion.
11. Ofrecer instalacion/verificacion y luego fase 2.

Si un paso falla, resolver y continuar desde el mismo paso. No reiniciar discovery.

## Contract de aplicacion por componente

Para cada componente/capa modificada (front, back, DS, FHIR), incluir en la
ejecucion una verificacion explicita de que:

1. Se leyo la skill correspondiente.
2. Se aplicaron sus checklists obligatorios.
3. Se reflejo el resultado en archivos/salidas esperadas (rutas, migraciones,
   stories/tests, exports, build, etc.).

## Confirmacion obligatoria para cambios cross-project

Si durante la implementacion se detecta que faltan componentes/funciones
reutilizables que idealmente deberian crearse en otros proyectos de `core`
(por ejemplo `core/packages/design-system` o `core/packages/fhir`), el agente
debe:

1. Detener la ejecucion antes de modificar esos proyectos.
2. Explicar brevemente que se propone crear en el proyecto compartido y por que.
3. Pedir confirmacion explicita al usuario para realizar cambios cross-project.

Si el usuario **no confirma** o **rechaza** cambios en otros proyectos, el agente
debe continuar implementando dentro de `mvp/<productName>/` y crear ahi las
funciones/componentes faltantes para no bloquear la entrega del producto.

## Scripts obligatorios en `mvp/<productName>/package.json`

Debe crear scripts para ejecutar por separado y combinados:

- `install:front`
- `install:back`
- `install:all`
- `build:front`
- `build:back`
- `build:all`
- `dev:front`
- `dev:back`
- `db:migrate`

### Ejemplo base

```json
{
  "name": "@platform/<productName>",
  "private": true,
  "scripts": {
    "install:front": "pnpm -C ./<productName>-front install",
    "install:back": "pnpm -C ./<productName>-back install",
    "install:all": "pnpm run install:front && pnpm run install:back",
    "build:front": "pnpm -C ./<productName>-front run build",
    "build:back": "pnpm -C ./<productName>-back run build",
    "build:all": "pnpm run build:front && pnpm run build:back",
    "dev:front": "pnpm -C ./<productName>-front run dev",
    "dev:back": "pnpm -C ./<productName>-back run dev",
    "db:migrate": "node ./<productName>-back/scripts/run-migrations.mjs"
  }
}
```

Si `db:migrate` no usa script Node, puede usar comando SQL/cliente equivalente,
pero debe quedar en este alias.

## Regla de puertos por cantidad de carpetas en `mvp/`

Para evitar colisiones, calcular `n` como cantidad de carpetas de proyecto en
`mvp/` (excluyendo `.agents`).

- `FRONT_PORT = 5170 + n`
- `BACK_PORT = 3000 + n`

Donde `n` es la cantidad de directorios de producto existentes en `mvp/`
antes de crear el nuevo (excluyendo `.agents`).

Aplicar en:

- script `dev` de `<productName>-front`
- `.env` de `<productName>-front` (`VITE_API_URL=http://localhost:<BACK_PORT>`)
- `.env` de `<productName>-back` (`PORT=<BACK_PORT>`)

## Guardrails de gitignore

En ambos proyectos (`*-front`, `*-back`) asegurar presencia de `node_modules`
en `.gitignore`.

## Validacion de estilos (front)

Para evitar fallas visuales, verificar siempre:

1. `src/globals.css` importa `@platform/design-system/styles/theme.css`.
2. Dependencia `@platform/design-system` apunta al `dist` correcto.
3. `tailwind.config.ts` incluye scan de `node_modules/@platform/design-system/dist`.
4. `tailwind.config.js` (si existe) tambien incluye la ruta correcta al DS.

Si `tailwind.config.js` y `tailwind.config.ts` difieren, normalizar ambos.

## Reglas de consistencia

- Producto nuevo debe ser independiente de `core` en runtime.
- Mantener convenciones de auth/rutas/layout del boilerplate.
- Mantener convenciones de response/validation del backend template.
- Cambios de tablas siempre con SQL en `src/db/migrations` del backend generado.

## Smoke checks minimos

1. `*-back`: `pnpm run build` y `pnpm test`.
2. `*-front`: `pnpm run build`.
3. Paquetes compartidos afectados (`design-system`, `fhir`): `pnpm run build`.

## Flujo post Fase 1 (obligatorio)

Al completar la primera fase del proyecto, el agente debe ofrecer al usuario:

1. Instalar dependencias (`install:all` o por separado).
2. Ejecutar migraciones (`db:migrate`).
3. Levantar front/back (`dev:front`, `dev:back`).
4. Verificar funcionamiento basico.

Tras esa verificacion, debe ofrecer continuar con "resto de funcionalidades"
siguiendo la skill local de evolucion del proyecto.

## Formato de respuesta obligatorio

El agente debe responder con este formato corto:

1. `Preflight` (nombre, alcance, decisiones, confirmacion)
2. `Ejecucion` (acciones realizadas)
3. `Validacion` (checks y estado)
4. `Siguiente paso` (una sola pregunta o propuesta)

No usar bloques extensos de exploracion ni mensajes ambiguos.

## Salida esperada

- Producto funcional en `mvp/<productName>/`.
- README con pasos de arranque front/back.
- Registro de componentes/utilidades nuevos agregados a `core/packages`.
- Skill local de evolucion en `mvp/<productName>/.agents/skills/` con el mismo
  estandar operativo del orquestador.
