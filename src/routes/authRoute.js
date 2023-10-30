const express = require("express");

const authenticateMiddleware = require("../middleWare/authenticateMiddleware");
const authController = require("../controller/authController");
const router = express.Router();

router.post("/user/login", authenticateMiddleware, authController.login);

module.exports = router;
