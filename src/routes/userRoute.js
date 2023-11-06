const express = require("express");

const { getUserProfile, getHistory } = require("../controller/userConroller");

const router = express.Router();

router.get("/", getUserProfile);
router.get("/wallet", getHistory);

module.exports = router;
