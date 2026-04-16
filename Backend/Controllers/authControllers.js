const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const CustomError = require('../Utils/customError');

const JWT_SECRET = process.env.JWT_SECRET;

const sendJwt = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {expiresIn: "5d"});
};

const sendRes = (res,user,message) => {
  const token = sendJwt(user.id);
  res.cookie("token", token,{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 5 * 24 * 60 * 60 * 1000
  });

  user.updatedAt = undefined;
  user.__v = undefined;

  res.status(200).json({
    status: "success",
    message,
    data: { user }
  });
};

exports.signUp = async (req, res, next) => {
  const { name, email, phone, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return next(new CustomError('Please provide the neccessary details for signing up', 400));
  };

  if(password !== confirmPassword) {
    return next( new CustomError("Password and confirm password do not match", 401));
  };

  const user = await User.findOne({ email });

  if (user) {
    const err = new CustomError('A user with the email you submitted already exists try using another email', 400);
    return next(err);
  };

  const createdUser = await User.create({
    name, email, phone, password, confirmPassword
  });

  createdUser.password = undefined;

  sendRes(res, createdUser, "Sign up successful");
};


exports.signUpAdmin = async (req, res, next) => {
  const { name, email,phone, password, confirmPassword} = req.body;
  if(!name || !email || !password || !confirmPassword) {
    return next( new CustomError("Please provide the necessary details needed for signing up", 401));
  };

  if(password !== confirmPassword) {
    return next( new CustomError("Password and confirm password do not match", 401));
  };

  const user = await User.findOne({email});
  if(user) {
    return next( new CustomError('A user with the email you submitted exists already please try another email', 401));
  };

  const createdAdmin = await User.create({
    name,
    email,
    phone,
    role: "admin",
    password,
    confirmPassword
  });

  createdAdmin.password = undefined;

  sendRes(res, createdAdmin, "Welcome onboard admin");
};


exports.login = async (req, res, next) => {
  const { password, email } = req.body;

  if (!password || !email) {
    return next(new CustomError('Please enter an email and a valid password', 400));
  };

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.validatePassword(password, user.password))) {
    return next(new CustomError('Wrong login credentials.', 400));
  };

  user.password = undefined;
  user.name = undefined;

  sendRes(res, user, "Login successful");
};

exports.logout = async (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === "production"
  });

  res.status(200).json({
    status: 'success',
    message: 'Logout successful'
  });
};
