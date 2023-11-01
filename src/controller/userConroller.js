const prisma = require("../model/prisma");

exports.getUserProfile = async (req, res, next) => {
    try {
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
