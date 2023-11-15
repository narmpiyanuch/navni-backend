const express = require("express");

const {
  createBooking,
  getServiceHistory,
  cancelBooking,
  getBookingForUser,
} = require("../controller/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/service-history", getServiceHistory);
router.patch("/cancel-booking", cancelBooking);
router.get("/get-booking-item-for-user", getBookingForUser);

module.exports = router;
