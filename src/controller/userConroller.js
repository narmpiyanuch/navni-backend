const { date } = require("joi");
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
    const wallet = await prisma.wallet.findFirst({
      where: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
      },
      select: {
        amount: true,
        transactionIn: {
          select: {
            price: true,
            method: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        transactionOut: {
          select: {
            price: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    console.log(wallet);
    //console.log("history", history);
    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
};

exports.transactionIn = async (req, res, next) => {
  try {
    const { price, method, transactionId } = req.body;
    const allMemberInformation = await memberFunction(req, res);
    const wallet = await prisma.wallet.findFirst({
      where: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
      },
    });
    const transactionIn = await prisma.transactionIn.create({
      data: {
        walletId: wallet.id,
        price,
        method,
        transactionId,
      },
    });
    let totalAmount;
    if (wallet) {
      totalAmount = await prisma.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          amount: +transactionIn.price + +wallet.amount,
        },
      });
    }
    res.status(201).json({ transactionIn });
  } catch (error) {
    next(error);
  }
};

exports.transactionOut = async (req, res, next) => {
  try {
    const { price } = req.body;
    const allMemberInformation = await memberFunction(req, res);
    const wallet = await prisma.wallet.findFirst({
      where: {
        memberInformationId: allMemberInformation.memberInformation[0].id,
      },
    });
    const transactionOut = await prisma.transactionOut.create({
      data: {
        walletId: wallet.id,
        price,
      },
    });
    let totalAmount;
    if (wallet) {
      totalAmount = await prisma.wallet.update({
        where: {
          id: wallet.id,
        },
        data: {
          amount: +wallet.amount - +transactionOut.price,
        },
      });
    }
    res.status(201).json({ transactionOut });
  } catch (error) {
    next(error);
  }
};
