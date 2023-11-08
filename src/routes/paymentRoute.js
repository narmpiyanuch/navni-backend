const express = require("express");

const {
    payment,
    createTransactionInPayment,
    createTransactionOut,
} = require("../controller/paymentController");

const router = express.Router();

router.post("/", payment);
router.post("/:transactionId", createTransactionInPayment);
router.post("/transactionOut", createTransactionOut);

module.exports = router;
