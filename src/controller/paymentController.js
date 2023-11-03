const prisma = require("../model/prisma");
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const { DOMAIN } = require("../config/constant");

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

        await prisma.transactionIn.create({
            data: {},
        });

        res.status(200).json({ message: "test" });
    } catch (error) {
        next(error);
    }
};
