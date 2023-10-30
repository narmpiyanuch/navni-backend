const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const { loginSchema } = require("../../validators/auth-validator");

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    console.log(value);
    if (error) {
      return next(error);
    }
    const user = await prisma.user.findFirst({
      where: {
        email: value.email,
        password: value.password,
      },
    });
    console.log(user);
    if (!user) {
      return next(createError("Invalid Credential", 400));
    }
    const matched = await bcrypt.compare(value.password, user.password);
    if (!matched) {
      return next(createError("Invalid Credential", 400));
    }
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "aasdfghjkswjkffkkfkvjnekk",
      { expiresIn: process.env.JWT_EXPIRE }
    );
    delete user.password;
    res.status(201).json({ message: "LOGIN SUCCESSFULLY", accessToken, user });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};
