const bcrypt = require("bcryptjs");
const prisma = require("../model/prisma");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { registerSchema } = require("../validators/authValidate");

exports.register = async (req, res, next) => {
    try {
        const { value, error } = registerSchema.validate(req.body);
        if (error) {
            return next(createError("Invalid Register", 400));
        }
        const { email, password, role, ...infomation } = value;

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                role,
            },
        });

        infomation.userId = user.id;
        if (role === "USER") {
            await prisma.memberInfomation.create({
                data: infomation,
            });
        }

        if (role === "ADMIN" || role === "DRIVER") {
            return res.status(400).json({ message: "Invalid access" });
        }
        const playload = { userId: user.id };
        const accessToken = jwt.sign(
            playload,
            process.env.JWT_SECRET_KEY || "vwe5b32523mrlkqmblkerre",
            { expiresIn: process.env.JWT_EXPIRE }
        );

        delete user.password;

        res.status(200).json({ user, accessToken });
    } catch (error) {
        next(error);
    }
};
