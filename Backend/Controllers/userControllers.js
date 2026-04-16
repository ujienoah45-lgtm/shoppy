const CustomError = require('../Utils/customError');
const ApiFeatures = require("../Utils/apiFeatures");
const sanitizeFields = require('../Services/sanitizeUpdate');
const User = require('../Models/userModel');

exports.getUsers = async ( req, res, next) => {
  const user = await User.findOne({_id: req.user.id, role: "admin"});
  if(!user) {
    return next( new CustomError("User not found or you do not have permission to perform this action", 404))
  };

  const findUser = User.find();
  const users = await new ApiFeatures(findUser, req.query).execute();

  res.status(200).json({
    status: "success",
    message: "users fetched successfully",
    length: users.length,
    data: { users }
  });
};

exports.getMe = async (req, res, next) => {
  const user = await User.findOne({_id: req.user.id});
  if(!user) {
    return next(new CustomError("User not found", 404));
  };

  res.status(200).json({
    status: "success",
    message: "user fetch successful",
    data: { user }
  });
};

exports.updateMe = async (req, res, next) => {
  if(req.body.password || req.body.confirmPassword) {
    return next(new CustomError("You are not allowed to update your password using this endpoint", 400));
  };
  const updates = sanitizeFields(req, "email", "name", "photo", "phone", "address");

  const user = await User.findByIdAndUpdate(req.user.id, updates, {runValidators: true, new: true});
  if(!user) {
    return next(new CustomError('This User does not exist', 404));
  };

  user.password = undefined;
  res.status(200).json({
    status: "success",
    data: { user }
  });
};

