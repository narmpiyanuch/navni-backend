const express = require("express");

const { payment } = require("../controller/stripeController");

const router = express.Router();

router.post("/", payment);

module.exports = router;
