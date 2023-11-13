const express = require("express");

const { getAllUser } = require("../controller/adminController");

const router = express.Router();

router.get("/get-all-user", getAllUser);

module.exports = router;
