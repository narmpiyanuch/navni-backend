const prisma = require("../model/prisma");

const stripe = require("stripe")(
    "pk_live_51O5h38AhP1thyDAwSYunixdd8ZBIvBGWtTgPYawTiPEyPK3614RGOk9vBGMWerFyg57QQQYF9FexJP80eAWUPhNF002x5jcNmB"
);
const YOUR_DOMAIN = "http://localhost:5173";
exports.payment = async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: "price_1O7urNAhP1thyDAwFUpRSpNP",
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${YOUR_DOMAIN}?success=true`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        next(error);
    }
};
