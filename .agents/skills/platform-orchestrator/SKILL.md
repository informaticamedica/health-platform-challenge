---
name: platform-orchestrator
description: >
  Orquestador general headless con entrada unica por comandos new:*.
  Resuelve rutas de ejecucion, aplica preflight determinista y delega a skills
  especializadas segun contrato.
---

# Platform Orchestrator

## Objetivo

Centralizar la creacion de artefactos del monorepo con un contrato estable y
reproducible.

## Fuente de verdad (obligatoria)

Para evitar ambiguedad, todo valor operativo debe salir del repo local:

1. Comandos: `package.json` (scripts `new`, `new:*`, `implement:mvp`).
2. Templates: `core/templates/` y `core/templates/README.md`.
3. Runtime del orquestador: `tools/platform-orchestrator/*`.

Regla dura: prohibido inventar nombres de templates, stacks o comandos que no
existan en esas rutas.

## Activacion por prompt simple

Si el usuario escribe algo como `crear un mvp que implemente ips de pacientes en fhir`:

1. Ejecutar inmediatamente `npm run new` (wizard/orquestador del repo).
2. Ejecutar `new:mvp` para provisioning agnostico.
3. Si el requerimiento menciona implementar/IPS/FHIR/pacientes, ejecutar luego `implement:mvp`.
4. Mostrar resumen de estructura creada y ruta de `IMPLEMENTATION_PLAN.md`.

Regla dura: para prompts simples, no usar UI de checklist generica del agente.
El flujo interactivo debe ser el wizard del repo (`npm run new`) o modo
headless (`new:mvp --config ...`).

Regla dura adicional: no reemplazar `npm run new` por `question tool`, formularios
de tabs ni cuestionarios multi-step del agente.

## Activacion automatica (obligatoria)

Cuando el prompt del usuario contenga patrones como:

- `crear un mvp`
- `nuevo mvp`
- `implemente ... en fhir`

esta skill debe activarse como primera opcion sin discovery previa.

Reglas de enrutamiento obligatorias:

1. Ejecutar primero `npm run new` (wizard) o `new:mvp` headless si el usuario lo pide explicitamente.
2. No explorar el repo antes de intentar orquestacion, salvo error de ejecucion.
3. Si el texto incluye `implementar`, `fhir`, `ips` o `pacientes`, ejecutar `implement:mvp` despues de `new:mvp`.
4. Si el entorno esta en modo read-only/plan, informar bloqueo y pedir salir de ese modo antes de ejecutar.
5. Para `new:mvp` + `implement:mvp` Fase 1, la validacion de cierre debe ejecutarse solo con `pnpm`.
6. Si el wizard falla, fallback obligatorio a `new:mvp --config <tmp.json> --confirm`.
7. Si no existe una skill delegada del mapeo, fallback obligatorio a
   `tools/platform-orchestrator/cli.js` (no improvisar flujo alternativo).

## Precedencia obligatoria de ejecucion

Para eliminar ambiguedad, este orden tiene prioridad absoluta:

1. Si el usuario no pidio `headless`, primer intento obligatorio: `npm run new`.
2. Solo si `npm run new` falla por error tecnico verificable, usar fallback
   `new:mvp --config <tmp.json> --confirm`.
3. Si el entorno no permite ejecutar comandos, responder bloqueo explicito y
   pedir habilitar ejecucion; no abrir wizard alternativo en chat.

Regla dura: el primer tool call operativo debe ser shell (`npm run new` o
`new:*` headless). Cualquier flujo de preguntas del agente queda prohibido como
sustituto del wizard del repo.

## Protocolo conversacional obligatorio

Para prompts simples como `crear un mvp que implemente ips de pacientes en fhir`, seguir siempre este orden:

1. Hacer preguntas minimas obligatorias (si faltan), pero dentro del wizard del
   repo o en payload `--config` headless (no en UI alternativa del agente):
   - nombre MVP
   - scope (`front`, `back`, `ambos`)
   - template front
   - template back
   - DB provider + DB name
   - crear DB ahora (`si/no`)
   - activar implementacion por fases (`si/no`)
   - origen de templates (mostrar solo opciones reales de `core/templates/`)
2. Mostrar preview completo antes de ejecutar:
   - estructura de carpetas
   - scripts que se van a crear
   - comandos post-creacion
3. Pedir confirmacion explicita textual (`confirmo ejecutar`) solo si el flujo
   es headless armado por config.
4. Solo despues de confirmar, ejecutar con `--confirm`.

Regla dura: nunca crear archivos sin confirmacion explicita del usuario.

Regla dura: preguntas y defaults deben ser deterministas.

- No usar valores genericos (ej: `nextjs`, `node-express`) si no existen en
  `core/templates/`.
- Si hay duda entre multiples defaults validos, usar el primer template del
  README de `core/templates` para la capa correspondiente y reportarlo.

## Comandos soportados

1. `new:mvp`
2. `new:db`
3. `new:package`
4. `new:template`
5. `new:p2t`
6. `implement:mvp`

## Modo obligatorio

Definir modo de forma explicita para eliminar contradicciones:

1. Modo `interactive`: ejecutar `npm run new` (wizard del repo).
2. Modo `headless`: ejecutar `new:*`/`implement:*` por CLI con `--config`.

Reglas:

- Si el usuario no pide headless, preferir `interactive`.
- Si el usuario pide reproducibilidad o CI, usar `headless`.
- En `headless`, salida JSON estructurada y sin preguntas abiertas.

## Entrada obligatoria

- `--action <new:*>`
- `--config <path>` recomendado para reproducibilidad.

Para `implement:mvp` tambien aplicar:

- `--name <mvp>` obligatorio.
- `--phase` o `--approve-phase` segun operacion.

## Contrato de ejecucion

1. Normalizar input.
2. Validar input con schema de `ops/schemas`.
3. Ejecutar preflight.
4. Delegar en skill correspondiente.
5. Emitir reporte canónico con: `preflight`, `execution`, `validation`, `next`.

Extension obligatoria del preflight para `new:mvp`:

6. Listar templates disponibles en `core/templates/`.
7. Verificar que `templateFront`/`templateBack` pertenezcan a esa lista.
8. Si no pertenecen, abortar con error bloqueante (sin fallback inventado).

## Mapeo comando -> skill

- `new:mvp` -> `mvp-product-orchestrator`
- `new:db` -> `infra-local-bootstrapper`
- `new:package` -> `packages-integration-bridge`
- `new:template` -> `react-product-scaffold` y/o `node-api-feature-factory`
- `new:p2t` -> `template-promoter`
- `implement:mvp` -> `mvp-delivery-orchestrator`

## Guardrails

1. Prohibido ejecutar acciones fuera de `new:*` e `implement:*`.
2. Prohibido aplicar cambios si preflight falla.
3. Prohibido inventar rutas de destino fuera del monorepo.
4. Prohibido saltar validaciones de contratos de skills.
5. Fase 1 de `implement:mvp` solo puede marcarse OK si se cumplieron ambos:
   - `pnpm install` ejecutado efectivamente en `mvp/<name>` (o via script `install` equivalente con pnpm).
   - `pnpm run dev` ejecutado en `mvp/<name>` y con evidencia de front y back levantados.
6. Si `pnpm --filter` no matchea proyectos, aplicar fallback automatico a `pnpm -C ../.. install` y reportarlo.
7. En Windows, no usar validacion de `dev` basada solo en timeout de `execSync`; usar ejecucion que capture logs de ambos procesos.
8. Prohibido renderizar UI alternativa (checkbox/select-all/tabs de
   cuestionario) para sustituir el wizard del repo en prompts simples de
   creacion de MVP.
9. Prohibido usar o sugerir templates fuera de `core/templates/`.
10. Si existe discrepancia entre instrucciones de skill y codigo ejecutable,
    prevalece el codigo del repo y se reporta warning explicito.
11. Todo default aplicado debe quedar trazado en el reporte final (`defaultsApplied`).
12. Toda seleccion de template debe incluir trazabilidad de origen
    (`templateSource: core/templates`).

## Definition of Done

1. Reporte JSON guardado en `ops/plans/`.
2. Ruta de skill delegada explicitamente en el reporte.
3. Resultado reproducible con el mismo `--config`.
4. Evidencia de que front/back se generaron desde templates existentes del repo.
5. Cero valores inventados fuera de `package.json`, `core/templates/` y
   `tools/platform-orchestrator/*`.
