module.exports = (error, req, res, next) => {
  console.log(error);
  if (error.name === "ValidationError") {
    error.statusCode = 400;
  }
  res.status(error.statusCode || 500).json({ message: error.message });
};
