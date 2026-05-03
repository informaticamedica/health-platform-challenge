import Joi from "joi";

export const patientSchema = Joi.object({
  name: Joi.string().required(),
  birth_date: Joi.date().required(),
  gender: Joi.string().valid("male", "female", "other").required(),
  address: Joi.string(),
});

export const idSchema = Joi.object({
  id: Joi.alternatives()
    .try(Joi.string().uuid(), Joi.number().integer().positive())
    .required(),
});
