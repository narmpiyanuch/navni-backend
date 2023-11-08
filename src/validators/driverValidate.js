const Joi = require("joi");

const registerDriverSchema = Joi.object({
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
    lastName: Joi.string().trim().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
    idCard: Joi.string().pattern(/^[0-9]{13}$/),
    gender: Joi.string().required(),

}).options({ allowUnknown: true });

exports.registerDriverSchema = registerDriverSchema;

