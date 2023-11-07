const express = require("express");
const { registerDiver, getAllRegisterDiver } = require("../controller/driverController");
const router = express.Router();
const uploadMiddleware = require("../middleWare/upload")

router.post("/register",
    uploadMiddleware.single('image'),
    registerDiver);

router.get("/allregisterdiver", getAllRegisterDiver);

module.exports = router;
