const express = require("express");

const router = express.Router();

const { getAllUser } = require("../controller/adminController");

router.get("/get-all-user", getAllUser);

module.exports = router;
