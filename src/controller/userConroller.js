const prisma = require("../model/prisma");

const memberFunction = async (req, res) => {
  const userInformation = await prisma.user.findMany({
    where: {
      id: req.user.id,
    },
    include: {
      memberInformation: true,
    },
  });
  if (!userInformation) {
    return res.status(400).json({ message: "user not found" });
  }

  const [allMemberInformation] = userInformation;

  return allMemberInformation;
};

exports.memberFunction = memberFunction;

exports.getUserProfile = async (req, res, next) => {
  try {
    const allMemberInformation = await memberFunction(req, res);
    const wallet = await prisma.wallet.findFirst({
      where: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
      },
    });
    const userProfile = [
      {
        email: allMemberInformation.email,
        firstName: allMemberInformation.memberInformation[0].firstName,
        lastName: allMemberInformation.memberInformation[0].lastName,
        phoneNumber: allMemberInformation.memberInformation[0].phoneNumber,
        wallet: wallet.amount,
      },
    ];

    res.status(200).json(userProfile);
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const allMemberInformation = await memberFunction(req, res);
    const history = await prisma.wallet.findFirst({
      where: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
      },
      select: {
        id: true,
        amount: true,
        transactionIn: {
          select: {
            price: true,
            transactionId: true,
            createdAt: true,
          },
        },
        transactionOut: {
          select: {
            price: true,
            createdAt: true,
          },
        },
      },
    });
    const data = {
      id: history.id,
      amount: history.amount,
      allTransaction: [
        ...history.transactionIn,
        ...history.transactionOut,
      ].sort((a, b) => b.createdAt - a.createdAt),
    };
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNumber } = req.body;
    const allMemberInformation = await memberFunction(req, res);
    const profile = await prisma.memberInformation.update({
      where: {
        id: +allMemberInformation.memberInformation[0].id,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
      },
    });
    res.status(201).json({ message: "Updated Successfully" });
  } catch (error) {
    next(error);
  }
};

exports.getServiceHistory = async (req, res, next) => {
  try {
    const allMemberInformation = await memberFunction(req, res);
    const bookingInformation = await prisma.booking.findFirst({
      where: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
      },
    });
    res.status(200).json({ bookingInformation });
  } catch (error) {
    next(error);
  }
};
