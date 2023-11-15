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
    res.status(200).json(allUser);
  } catch (error) {
    next(error);
  }
};
