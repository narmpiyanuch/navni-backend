const express = require("express");

const { getUserProfile } = require("../controller/userConroller");

const router = express.Router();

router.get("/", getUserProfile);

module.exports = router;
