const createError = require("../utils/createError");

module.exports = async (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    res.status(401).json({ message: "ACCESS DENIED" });
  }
  next();
};
