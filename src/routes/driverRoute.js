const express = require("express");
const { registerDriver, getAllRegisterDriver } = require("../controller/driverController");
const router = express.Router();
const uploadMiddleware = require("../middleWare/upload")

router.post("/register",
    uploadMiddleware.single('image'),
    registerDriver);

router.get("/allregisterdriver", getAllRegisterDriver);

module.exports = router;
