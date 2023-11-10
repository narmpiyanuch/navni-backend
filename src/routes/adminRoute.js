const express = require("express");
const {
  getAllRegisterDriver,
  createDriver,
  getAllDriverEmployee,
  changeDriverStatus
} = require("../controller/driverController");

const router = express.Router();

router.get("/all-register-driver", getAllRegisterDriver);
router.post("/create-driver", createDriver);
router.get("/all-driver-employee",getAllDriverEmployee)
router.post("/change-status",changeDriverStatus)

module.exports = router;
