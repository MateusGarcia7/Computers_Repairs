const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { User } = require("../Models/user.model");
const { AppError } = require("../Utils/appError");
const { catchAsync } = require("../Utils/catchAsync");

const userExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findOne({ where: { id } });
  if (!user) {
    return next(new AppError("No user found with the given id", 404));
  }
  req.user = user;
  next();
});

dotenv.config({ path: "./config.env" });

const protectToken = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.starsWith("Bearer")
  ) {
    token = req.headers.authorization.split("")[1];
  }

  if (!token) {
    return next(new AppError("sesion invalid, 403"));
  }

  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findOne({
    where: { id: decoded.id, status: "active" },
  });

  if (!user) {
    new AppError("Thw owner of thid token is no longer avaliable", 403);
  }
  req.sessionUser = user;
  next();
});

const protectEmployee = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  if (sessionUser.role !== "employee") {
    return next(new AppError("Acces denied", 403));
  }
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;
  if (sessionUser.id !== +id) {
    return next(new AppError("you do not own this account", 403));
  }
  next();
});

module.exports = {
  userExist,
  protectToken,
  protectEmployee,
  protectAccountOwner,
};
