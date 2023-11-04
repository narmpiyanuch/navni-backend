const express = require("express");

const {
    getUserProfile,
    getHistory,
    transactionIn,
    transactionOut,
} = require("../controller/userConroller");

const router = express.Router();

router.get("/", getUserProfile);
router.get("/wallet", getHistory);
router.post("/transactionIn", transactionIn);
router.post("/transactionOut", transactionOut);

module.exports = router;
