const prisma = require("../model/prisma");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { DOMAIN } = require("../config/constant");
const { memberFunction } = require("../controller/userConroller");

exports.payment = async (req, res, next) => {
    try {
        const { price } = req.body;

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: "auto",
            line_items: [
                {
                    price: price,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${DOMAIN}/successtopup?success=true&transactionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/failtopup`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        next(error);
    }
};

exports.createTransactionPayment = async (req, res, next) => {
    try {
        const { transactionId } = req.params;

        const session = await stripe.checkout.sessions.retrieve(transactionId);

        const price = session.amount_total / 100;

        const memberInformation = await memberFunction(req, res);
        const wallet = await prisma.wallet.findFirst({
            where: {
                memberInformationId: memberInformation.memberInformation[0].id,
            },
        });
        const transactionIn = await prisma.transactionIn.create({
            data: {
                price,
                transactionId: session.id,
                walletId: wallet.id,
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
