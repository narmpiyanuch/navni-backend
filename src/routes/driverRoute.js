const express = require("express");
const uploadMiddleware = require("../middleWare/upload");
const authenticateMiddleware = require("../middleWare/authenticateMiddleware");
const {
  registerDriver,
  getAllRegisterDriver,
  getDriverHistory,
  getDriverProfile,
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

module.exports = router;
