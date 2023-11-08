const express = require("express");

const {
  createBooking,
  getServiceHistory,
} = require("../controller/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/service-history", getServiceHistory);

module.exports = router;
