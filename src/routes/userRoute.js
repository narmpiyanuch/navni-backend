const express = require("express");

const {
  getUserProfile,
  getHistory,
  updateProfile,
  getServiceHistory,
} = require("../controller/userConroller");

const router = express.Router();

router.get("/", getUserProfile);
router.get("/wallet", getHistory);
router.get("/serviceHistory", getServiceHistory);
router.patch("/updateProfile", updateProfile);

module.exports = router;
