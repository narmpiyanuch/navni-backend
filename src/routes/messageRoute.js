const express = require("express");
const {
  getMessage,
  createMessage,
} = require("../controller/messageController");

const router = express.Router();

router.post("/messages", createMessage);

router.get("/messages/:userId", getMessage);

module.exports = router;
