const createError = require("../utils/createError");

module.exports = async (req, res, next) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(401).json({ message: "ACCESS DENIED" });
    }
    next();
};
