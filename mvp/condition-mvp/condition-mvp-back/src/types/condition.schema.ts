import Joi from "joi";

export const conditionSchema = Joi.object({
  patient_id: Joi.number().integer().positive().required(),
  clinical_status: Joi.string()
    .valid("active", "inactive", "resolved")
    .required(),
  verification_status: Joi.string()
    .valid("provisional", "confirmed", "refuted")
    .required(),
  code: Joi.string().min(2).max(120).required(),
  recorded_date: Joi.date().iso().required(),
  notes: Joi.string().allow("").max(2000),
});

export const conditionIdSchema = Joi.object({
  id: Joi.alternatives()
    .try(Joi.string().uuid(), Joi.number().integer().positive())
    .required(),
});
