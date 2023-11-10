const express = require("express");
const {
  getAllRegisterDriver,
  createDriver,
} = require("../controller/driverController");

const router = express.Router();

router.get("/all-register-driver", getAllRegisterDriver);
router.post("/create-driver", createDriver);

module.exports = router;
