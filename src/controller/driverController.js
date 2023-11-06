const bcrypt = require("bcryptjs");
const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const { registerDriverSchema } = require("../validators/driverValidate");


exports.registerDiver = async (req, res, next) => {
    try {
        const { value, error } = registerDriverSchema.validate(req.body);
        if (error) {
            return next(createError("Invalid Register", 400));
        }
        const { password, ...information } = value;
        const hashPassword = await bcrypt.hash(password, 12);

        if (!req.file) {
            const input_driver = await prisma.RegisterEmployeeInformation.create({
                data: {
                    ...information,
                    password: hashPassword,

                }
            });
            return res.status(201).json({ input_driver, message: "Register Driver Successful!" })
        }
        else {
            const response = {};
            const url = await upload(req.file.path);
            response.image = url;
            const input_driver = await prisma.RegisterEmployeeInformation.create({
                data: {
                    ...information,
                    password: hashPassword,
                    image: url
                },
            })
            return res.status(201).json({ input_driver, message: "Register Driver Successful!" })
        }
    } catch (error) {
        next(error);
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