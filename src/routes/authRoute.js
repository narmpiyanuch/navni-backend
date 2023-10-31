const express = require("express");

const authenticateMiddleware = require("../middleWare/authenticateMiddleware");
const { register, login, getMe } = require("../controller/authController");
const router = express.Router();

router.post("/user/login", login);
router.post("/register", register);

router.get("/me", authenticateMiddleware, getMe);

module.exports = router;
