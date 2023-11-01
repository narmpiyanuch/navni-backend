const express = require("express");

const { getUserProfile } = require("../controller/userConroller");

const router = express.Router();

router.use("/", getUserProfile);

module.exports = router;
