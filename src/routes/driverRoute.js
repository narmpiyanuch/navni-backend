const express = require("express");
const uploadMiddleware = require("../middleWare/upload");
const authenticateMiddleware = require("../middleWare/authenticateMiddleware");
const {
  registerDriver,
  getAllRegisterDriver,
  getDriverHistory,
  getDriverProfile,
  getAllDriverEmpolyee,
  getBookingItem,
  acceptBooking,
  pickupUser,
  dropOffUser,
  getBookingItemWithComing,
  getBookingItemWithPicked,
} = require("../controller/driverController");
const router = express.Router();

router.post("/register", uploadMiddleware.single("image"), registerDriver);

router.get(
  "/all-register-driver",
  authenticateMiddleware,
  getAllRegisterDriver
);

router.get("/profile", authenticateMiddleware, getDriverProfile);
router.get("/driver-history", authenticateMiddleware, getDriverHistory);
router.get("/get-booking-item", authenticateMiddleware, getBookingItem);
router.get(
  "/get-booking-item-for-driver",
  authenticateMiddleware,
  getBookingItemWithComing
);
router.get(
  "/get-picked-booking-item-for-driver",
  authenticateMiddleware,
  getBookingItemWithPicked
);
router.patch("/accept-booking", authenticateMiddleware, acceptBooking);
router.patch("/pickup-user", authenticateMiddleware, pickupUser);
router.patch("/dropoff-user", authenticateMiddleware, dropOffUser);

module.exports = router;
