const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{8,30}$/)
        .trim()
        .required(),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .trim()
        .required()
        .strip(),
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
    idCard: Joi.string().pattern(/^[0-9]{13}$/),
}).options({ allowUnknown: true });

exports.registerSchema = registerSchema;

const loginSchema = Joi.object({
    email: Joi.string().trim(),
    password: Joi.string().trim(),
}).options({ allowUnknown: true });

exports.loginSchema = loginSchema;
