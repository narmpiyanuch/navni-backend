const express = require("express");
const { registerDiver, getAllRegisterDiver } = require("../controller/driverController");
const router = express.Router();

router.post("/diver/register", registerDiver);

router.get("/allregisterdiver", getAllRegisterDiver);

module.exports = router;
