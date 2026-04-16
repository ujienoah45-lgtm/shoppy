const util = require('util');
const CustomError = require('../Utils/customError');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

exports.protect = async (req, res, next) => {
  const { token } = req.cookies;

  if(!token) {
    return next( new CustomError("Invalid token", 400));
  };

  const decodedToken = await util.promisify(jwt.verify)(token, JWT_SECRET);

  const user = await User.findById(decodedToken.id);
  if(!user) {
    return next( new CustomError("The user does not exist", 400));
  };

  const isPswdChanged = user.checkPswdChange(decodedToken.iat);

  if(isPswdChanged) {
    return next( new CustomError("Sessio expired please log in again to continue", 400));
  };

  req.user = user;
  next();
};


exports.role = (...allowedRoles) => {
  return (req, res, next) => {
    if(!allowedRoles.includes(req.user.role)) {
      return next( new CustomError("You are forbidden from accessing this route", 403));
    };
    next();
  };
};