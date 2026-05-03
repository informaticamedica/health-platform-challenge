import Joi from "joi";

export const observationSchema = Joi.object({
  code: Joi.string().required().messages({
    "string.empty": "Code is required",
  }),
  value: Joi.string().required().messages({
    "string.empty": "Value is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Date is required",
  }),
});
