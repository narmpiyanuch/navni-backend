// const { date } = require("joi");
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
                memberInformationId:
                    allMemberInformation.memberInformation[0].id,
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
        const history = await prisma.wallet.findFirst({
            where: {
                memberInformationId:
                    allMemberInformation.memberInformation[0].id,
            },
            select: {
                id: true,
                amount: true,
                transactionIn: {
                    select: {
                        price: true,
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
