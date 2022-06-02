const { User } = require("../Models/user.model");
const { catchAsync } = require("../Utils/catchAsync");
const bcrypt = require("bcryptjs");
const { AppError } = require("../Utils/appError");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Email } = require("../utils/email");

dotenv.config({ path: "./dotenv.config.env" });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll();
  res.status(200).json({
    users,
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const salt = await bcrypt.genSalt(12);
  const hashPassword = await bcrypt.hash(password, salt);
  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
    role,
  });
  await new Email(newUser.email).sendWelcome(newUser.name);
  newUser.password = undefined;
  res.status(201).json({ newUser });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { user } = req;
  res.status(200).json({
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const { user } = req;
  await user.update({ name, email, password, role });

  res.status(200).json({ status: "succes" });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });
  res.status(200).json({
    status: "succes",
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, status: "active" } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Credentials invalid, 400"));
  }

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});
module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  login,
};
