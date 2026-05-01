import Joi from "joi";

const baseSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
};

export const loginSchema = Joi.object(baseSchema);

export const registerSchema = Joi.object({
  ...baseSchema,
  name: Joi.string().min(3).max(30).required(),
});
