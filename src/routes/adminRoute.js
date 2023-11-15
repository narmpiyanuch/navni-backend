const express = require("express");

const router = express.Router();

const { getAllUser } = require("../controller/adminController");

const {
  getAllRegisterDriver,
  createDriver,
  getAllDriverEmployee,
  changeDriverStatus,
} = require("../controller/driverController");

router.get("/get-all-user", getAllUser);
router.get("/all-register-driver", getAllRegisterDriver);
router.post("/create-driver", createDriver);
router.get("/all-driver-employee", getAllDriverEmployee);
router.post("/change-status", changeDriverStatus);

module.exports = router;
