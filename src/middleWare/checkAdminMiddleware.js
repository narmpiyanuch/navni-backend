module.exports = async (req, res, next) => {
    try {
        if (req.user.role !== "ADMIN") {
            res.status(401).json({ message: "ACCESS DENINED" });
        }
        next();
    } catch (error) {
        next(error);
    }
};
