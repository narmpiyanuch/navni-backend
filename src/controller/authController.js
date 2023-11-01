const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const { registerSchema, loginSchema } = require("../validators/authValidate");

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    console.log(value);
    if (error) {
      return next(error);
    }
    if (value.sub) {
      const googleUser = await prisma.user.findFirst({
        where: {
          googleId: value.sub,
        },
      });
      console.log(googleUser);
      if (!googleUser) {
        const user = await prisma.user.create({
          data: {
            googleId: value.sub,
            email: value.email,
          },
        });
        await prisma.memberInfomation.create({
          data: {
            firstName: value.given_name,
            lastName: value.family_name,
            userId: user.id,
          },
        });
        const payload = { userId: user.id };
        const accessToken = jwt.sign(
          payload,
          process.env.JWT_SECRET_KEY || "aasdfghjkswjkffkkfkvjnekk",
          { expiresIn: process.env.JWT_EXPIRE }
        );
        return res.status(200).json({ user, accessToken });
      }
      if (googleUser) {
        const payload = { userId: googleUser.id };
        const accessToken = jwt.sign(
          payload,
          process.env.JWT_SECRET_KEY || "aasdfghjkswjkffkkfkvjnekk",
          { expiresIn: process.env.JWT_EXPIRE }
        );
        return res.status(200).json({ accessToken, googleUser });
      }
    }
    const user = await prisma.user.findFirst({
      where: {
        email: value.email,
      },
    });
    console.log("user", user);
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
    res.status(201).json({
      message: "LOGIN SUCCESSFULLY",
      accessToken,
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = (req, res) => {
  res.status(200).json({ user: req.user });
};

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(createError("Invalid Register", 400));
    }
    const { email, password, role, ...infomation } = value;

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
        role,
      },
    });

    infomation.userId = user.id;
    if (role === "USER") {
      await prisma.memberInfomation.create({
        data: infomation,
      });
    }

    if (role === "ADMIN" || role === "DRIVER") {
      return res.status(400).json({ message: "Invalid access" });
    }
    const playload = { userId: user.id };
    const accessToken = jwt.sign(
      playload,
      process.env.JWT_SECRET_KEY || "vwe5b32523mrlkqmblkerre",
      { expiresIn: process.env.JWT_EXPIRE }
    );

    delete user.password;

    res.status(200).json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};
