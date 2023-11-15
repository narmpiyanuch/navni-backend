const { object } = require("joi");
const prisma = require("../model/prisma");

exports.getAllUser = async (req, res, next) => {
    try {
        const allUser = await prisma.user.findMany({
            where: {
                role: {
                    not: "ADMIN",
                },
            },
            select: {
                id: true,
                email: true,
                role: true,
                memberInformation: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                employeeInformation: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
        // const data = {
        //   id: allUser[0].id,
        //   firstName: allUser[0].memberInformation,
        //   lastName: allUser[0].memberInformation,
        // };
        // console.log(allUser[0].id);
        res.status(200).json(allUser);
    } catch (error) {
        next(error);
    }
};
