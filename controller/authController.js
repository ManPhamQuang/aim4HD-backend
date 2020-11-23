const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const createJWT = async id => {
  const token = await promisify(jwt.sign)({ id }, process.env.JWT_SECRET, {
    expiresIn: 1000 * 60 * 60 * process.env.JWT_EXPIRE,
  });
  return token;
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = await createJWT(user.id);
  return res.status(201).json({ status: "success", data: { user, token } });
});
