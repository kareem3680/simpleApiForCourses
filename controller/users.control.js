const asyncWrapper = require("../middleware/asyncWrapper.js");
const User = require("../models/user.model.js");
const { validationResult } = require("express-validator");
const appError = require("../Utilities/appError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Error } = require("mongoose");
require("dotenv").config();

const getAllUsers = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  const users = await User.find(
    {},
    { __v: false, password: false, token: false }
  )
    .limit(limit)
    .skip(skip);
  res.json({ status: "success", data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    const error = appError.create(
      "THE EMAIL IS ALREADY EXISTS",
      400,
      "TRY AGAIN!"
    );
    return next(error);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename
  });
  const token = await jwt.sign(
    { email: newUser.email, id: newUser._id, role: newUser.role },
    process.env.jwt_secret,
    { expiresIn: "1d" }
  );
  newUser.token = token;
  await newUser.save();
  res.status(201).json({ status: "success", data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email && !password) {
    const error = appError.create(
      "Email and password required",
      400,
      "Failed",
      null
    );
    return next(error);
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    const error = appError.create("user not found", 400, "Failed", null);
    return next(error);
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  const token = await jwt.sign(
    { email: user.email, id: user._id, role: user.role },
    process.env.jwt_secret,
    { expiresIn: "1d" }
  );
  if (user && matchedPassword) {
    return res.status(200).json({ status: "success log in", data: { token } });
  } else {
    const error = appError.create("pass is wrong", 404, "Failed", null);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login
};
