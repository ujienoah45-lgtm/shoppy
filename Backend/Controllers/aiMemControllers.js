const ChatMemory = require('../Models/chatMemoryModel');
const CustomError = require('../Utils/customError');


exports.saveMemory = async (req, res, next) => {
  const { tempUserId,content } = req.body;
  const { pemUserId } = req.user.id;

  const userId = tempUserId || pemUserId;
  const user = await  ChatMemory.find({userId});

  if(user) {
    return next( new CustomError('There is a user with this ID already', 400));
  };

  const savedUserId = await ChatMemory.create({
    userId,
    role,
    content
  });

  res.status(200).json({
    status: 'success',
    data: { savedUserId }
  })
};

exports.getMemory = async (req, res, next ) => {
  const { userId } = req.body;

  const userMemory = await ChatMemory.find({userId})
    .sort({createdAt: 1})
    .limit(6);

  if(!userMemory) {
    return next( new CustomError("Couldn't find a memory for this user", 404));
  };

  res.status(200).json({
    status: 'success',
    data: { userMemory }
  });
};