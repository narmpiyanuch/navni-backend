const bcrypt = require("bcryptjs");
const { upload } = require('../utils/cloudinary_service');
const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const fs = require('fs/promises')
const { registerDriverSchema } = require("../validators/driverValidate");
const confirmRegisterDriverEmail = require('../config/confirmRegister')


exports.registerDriver = async (req, res, next) => {
    try {

        // const newData = JSON.parse(req.body.driverData)

        // const { value, error } = registerDriverSchema.validate(newData);

        const { value, error } = registerDriverSchema.validate(req.body);
        if (error) {
            console.log(error)
            return next(createError("Invalid Register", 400));
        }

        const { password, ...information } = value;
        const hashPassword = await bcrypt.hash(password, 12);

        if (!req.file) {
            const driver = await prisma.RegisterEmployeeInformation.create({
                data: {
                    ...information,
                    password: hashPassword,
                }
            });
            const emailDriver = driver.email
            console.log(emailDriver)
            confirmRegisterDriverEmail(emailDriver)
            delete driver.password;

            return res.status(201).json({ driver, message: "Register Driver Successful!" })
        }
        else {
            const response = {};
            const url = await upload(req.file.path);
            response.image = url;
            const driver = await prisma.RegisterEmployeeInformation.create({
                data: {
                    ...information,
                    password: hashPassword,
                    image: url
                },
            })
            const emailDriver = driver.email
            confirmRegisterDriverEmail(emailDriver)
            delete driver.password;
            return res.status(201).json({ driver, message: "Register Driver Successful!" })
        }
    } catch (error) {
        next(error);
    } finally {
        if (req.file) {
            fs.unlink(req.file.path)
        }
    }
};


exports.getAllRegisterDriver = async (req, res, next) => {

    try {
        const AllDriver = await prisma.RegisterEmployeeInformation.findMany({})
        res.status(200).json({ AllDriver })
    } catch (err) {
        next(err)
    }
}