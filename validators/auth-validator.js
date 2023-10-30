const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});

exports.loginSchema = loginSchema;
