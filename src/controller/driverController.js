const bcrypt = require("bcryptjs");
const { upload } = require('../utils/cloudinary_service');
const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const fs = require('fs/promises')
const { registerDriverSchema } = require("../validators/driverValidate");


exports.registerDiver = async (req, res, next) => {
    try {

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


exports.getAllRegisterDiver = async (req, res, next) => {

    try {
        const AllDriver = await prisma.RegisterEmployeeInformation.findMany({})
        res.status(200).json({ AllDriver })
    } catch (err) {
        next(err)
    }
}