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

## Activacion por prompt simple

Si el usuario escribe algo como `crear un mvp que implemente ips de pacientes en fhir`:

1. Iniciar wizard/orquestador (`npm run new`) y completar pasos con el usuario.
2. Ejecutar `new:mvp` para provisioning agnostico.
3. Si el requerimiento menciona implementar/IPS/FHIR/pacientes, ejecutar luego `implement:mvp`.
4. Mostrar resumen de estructura creada y ruta de `IMPLEMENTATION_PLAN.md`.

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

## Protocolo conversacional obligatorio

Para prompts simples como `crear un mvp que implemente ips de pacientes en fhir`, seguir siempre este orden:

1. Hacer preguntas minimas obligatorias (si faltan):
   - nombre MVP
   - scope (`front`, `back`, `ambos`)
   - template front
   - template back
   - DB provider + DB name
   - crear DB ahora (`si/no`)
   - activar implementacion por fases (`si/no`)
2. Mostrar preview completo antes de ejecutar:
   - estructura de carpetas
   - scripts que se van a crear
   - comandos post-creacion
3. Pedir confirmacion explicita textual (`confirmo ejecutar`).
4. Solo despues de confirmar, ejecutar con `--confirm`.

Regla dura: nunca crear archivos sin confirmacion explicita del usuario.

## Comandos soportados

1. `new:mvp`
2. `new:db`
3. `new:package`
4. `new:template`
5. `new:p2t`
6. `implement:mvp`

## Modo obligatorio

- Solo `headless`.
- Solo salida JSON estructurada.
- Sin preguntas abiertas durante ejecucion.

## Entrada obligatoria

- `--action <new:*>`
- `--config <path>` recomendado para reproducibilidad.

## Contrato de ejecucion

1. Normalizar input.
2. Validar input con schema de `ops/schemas`.
3. Ejecutar preflight.
4. Delegar en skill correspondiente.
5. Emitir reporte canónico con: `preflight`, `execution`, `validation`, `next`.

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

## Definition of Done

1. Reporte JSON guardado en `ops/plans/`.
2. Ruta de skill delegada explicitamente en el reporte.
3. Resultado reproducible con el mismo `--config`.
