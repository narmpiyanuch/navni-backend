const express = require("express");

const {
  getUserProfile,
  getHistory,
  transactionIn,
  transactionOut,
} = require("../controller/userConroller");

const router = express.Router();

router.get("/", getUserProfile);
<<<<<<< HEAD
=======
router.get("/wallet", getHistory);
router.post("/transactionIn", transactionIn);
router.post("/transactionOut", transactionOut);
>>>>>>> f31b77adca1f482e1970652f1b0f3bfc6fe39048

module.exports = router;
