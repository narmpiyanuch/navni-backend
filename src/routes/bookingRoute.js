const express = require("express");

const {
    createBooking,
    getServiceHistory,
    cancelBooking,
} = require("../controller/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/service-history", getServiceHistory);
router.patch("/cancel-booking", cancelBooking);

module.exports = router;
