const express = require("express");

const { createBooking } = require("../controller/bookingController");

const router = express.Router();

router.post("/", createBooking);

module.exports = router;
