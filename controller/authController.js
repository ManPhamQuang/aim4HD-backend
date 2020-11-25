const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const createJWT = async id =>
  await promisify(jwt.sign)({ id }, process.env.JWT_SECRET, {
    expiresIn: 1000 * 60 * 60 * process.env.JWT_EXPIRE,
  });

const setCookieAndSendResponse = async (id, res, statusCode, data) => {
  const token = await createJWT(id);
  const option = {
    expires: new Date(
      Date.now() + 1000 * 60 * 60 * process.env.COOKIE_EXPIRES_IN
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") option.secure = true;
  res.cookie("jwt", token, option);
  res.status(statusCode).json(data);
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  return await setCookieAndSendResponse(user.id, res, 201, {
    status: "success",
    data: { user },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (!user) return next(new AppError("No user found", 404));
  return await setCookieAndSendResponse(user.id, res, 200, {
    status: "success",
    data: { user },
  });
});

exports.checkLogin = catchAsync(async (req, res, next) => {
  if (!req.cookies.jwt)
    return next(new AppError("Please login to access this route", 400));
  const decoded = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("User not found with a given ID", 400));
  req.user = user;
  next();
});
