const prisma = require("../model/prisma");

exports.getAllUser = async (req, res, next) => {
    try {
        const getAllUser = await prisma.user.findMany({
            where: {
                role: {
                    not: "ADMIN",
                },
            },
        });
        res.status(200).json({ getAllUser });
    } catch (error) {
        next(error);
    }
};
