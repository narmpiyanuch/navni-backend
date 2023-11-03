const express = require("express");

const {
    payment,
    createTransactionPayment,
} = require("../controller/paymentController");

const router = express.Router();

router.post("/", payment);
router.post("/:transactionId", createTransactionPayment);

module.exports = router;
