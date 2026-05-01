import Joi from "joi";
import { getLoinCodecSet } from "../utils/loincLoader";

export const componentsObservationSchema = Joi.object({
  code: Joi.string()
    .min(1)
    .max(100)
    .required()
    .custom((value, helpers) => {
      const loincSet = getLoinCodecSet();
      if (!loincSet.has(value)) return helpers.error("any.invalid");
      return value;
    })
    .messages({
      "string.base": "El código del componente debe ser un texto",
      "string.empty": "El código del componente no debe estar vacío",
      "string.min":
        "El código del componente debe tener al menos {#limit} caracteres",
      "string.max":
        "El código del componente no debe tener más de {#limit} caracteres",
      "any.required": "El código del componente es un campo requerido",
      "any.invalid":
        "El código '{#value}' del componente no fue encontrado en LOINC.",
    }),
  value: Joi.number().precision(2).min(0).required().messages({
    "number.base": "El valor debe ser un número",
    "number.min": "El valor debe ser al menos {#limit}",
    "any.required": "El valor es un campo requerido",
  }),
  unit: Joi.string().min(1).max(50).required().messages({
    "string.base": "La unidad debe ser un texto",
    "string.empty": "La unidad no debe estar vacía",
    "string.min": "La unidad debe tener al menos {#limit} caracteres",
    "string.max": "La unidad no debe tener más de {#limit} caracteres",
    "any.required": "La unidad es un campo requerido",
  }),
});

export const baseObservationSchema = Joi.object({
  code: Joi.string()
    .min(3)
    .max(100)
    .required()
    .custom((value, helpers) => {
      const loincSet = getLoinCodecSet();
      if (!loincSet.has(value)) return helpers.error("any.invalid");
      return value;
    })
    .messages({
      "string.base": "El código de la observación debe ser un texto",
      "string.empty": "El código de la observación no debe estar vacío",
      "string.min":
        "El código de la observación debe tener al menos {#limit} caracteres",
      "string.max":
        "El código de la observación no debe tener más de {#limit} caracteres",
      "any.required": "El código de la observación es un campo requerido",
      "any.invalid": "El código '{#value}' no fue encontrado en LOINC.",
    }),

  value: Joi.alternatives()
    .try(Joi.string().min(1).max(500), Joi.number().precision(2).min(0))
    .required()
    .messages({
      "string.base": "El valor de la observación debe ser un texto",
      "string.empty": "El valor de la observación no debe estar vacío",
      "string.min":
        "El valor de la observación debe tener al menos {#limit} caracteres",
      "string.max":
        "El valor de la observación no debe tener más de {#limit} caracteres",
      "number.base": "El valor de la observación debe ser un número",
      "any.required": "El valor de la observación es un campo requerido",
    }),

  date: Joi.date().iso().required().messages({
    "date.base": "La fecha de la observación debe ser una fecha válida",
    "date.empty": "La fecha de la observación no debe estar vacía",
    "date.iso":
      "La fecha de la observación debe ser una fecha en formato ISO 8601 (YYYY-MM-DD)",
    "any.required": "La fecha de la observación es un campo requerido",
  }),

  status: Joi.string().valid("final", "preliminary", "").messages({
    "string.base": "El estado de la observación debe ser un texto",
    "string.valid":
      "El estado de la observación debe ser 'final' o 'preliminary'",
  }),

  category: Joi.string()
    .valid(
      "social-history",
      "vital-signs",
      "imaging",
      "laboratory",
      "procedure",
      "survey",
      "exam",
      "therapy",
      "activity"
    )
    .required()
    .messages({
      "string.base": "La categoría de la observación debe ser un texto",
      "string.empty": "La categoría de la observación no debe estar vacía",
      "string.valid":
        "La categoría de la observación debe ser 'vital-signs' o 'laboratory'",
      "any.required": "La categoría de la observación es un campo requerido",
    }),

  components: Joi.array().items(componentsObservationSchema).messages({
    "array.base": "Los componentes deben ser un array",
    "array.includes": "Cada componente debe ser válido",
  }),
});
