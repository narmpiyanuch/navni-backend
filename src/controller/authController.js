const bcrypt = require("bcryptjs");
const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const { registerSchema, loginSchema } = require("../validators/authValidate");
const createAccessToken = require("../utils/createAccessToken");

exports.login = async (req, res, next) => {
    try {
        const { value, error } = loginSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        if (value.sub) {
            const googleUser = await prisma.user.findFirst({
                where: {
                    googleId: value.sub,
                },
            });
            if (!googleUser) {
                const user = await prisma.user.create({
                    data: {
                        googleId: value.sub,
                        email: value.email,
                    },
                });
                const newUser = await prisma.memberInformation.create({
                    data: {
                        firstName: value.given_name,
                        lastName: value.family_name,
                        userId: user.id,
                    },
                });

                await prisma.wallet.create({
                    data: {
                        memberInformationId: newUser.id,
                    },
                });

                const accessToken = createAccessToken(user.id);
                return res.status(200).json({ user, accessToken });
            }
            if (googleUser) {
                const accessToken = createAccessToken(googleUser.id);
                return res.status(200).json({ accessToken, googleUser });
            }
        }

        const user = await prisma.user.findFirst({
            where: {
                email: value.email,
            },
        });
        if (!user) {
            return next(createError("Invalid Credential", 400));
        }

        const matched = bcrypt.compare(value.password, user.password);
        if (!matched) {
            return next(createError("Invalid Credential", 400));
        }

        const accessToken = createAccessToken(user.id);
        delete user.password;

        res.status(201).json({
            accessToken,
            user,
        });
    } catch (error) {
        next(error);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { value, error } = registerSchema.validate(req.body);
        if (error) {
            return next(createError("Invalid Register", 400));
        }
        const { email, password, role, ...information } = value;

        const hashPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
                role,
            },
        });
        information.userId = user.id;

        if (role === "ADMIN" || role === "DRIVER") {
            return res.status(400).json({ message: "Invalid access" });
        }

        if (role === "USER") {
            const newUser = await prisma.memberInformation.create({
                data: information,
            });

            await prisma.wallet.create({
                data: {
                    memberInformationId: newUser.id,
                },
            });
        }

        const accessToken = createAccessToken(user.id);
        delete user.password;

        res.status(200).json({ user, accessToken });
    } catch (error) {
        next(error);
    }
};

exports.getMe = (req, res) => {
    res.status(200).json({ user: req.user });
};
