const dummyData = require('../Utils/dummydata.json');
const CustomError = require('../Utils/customError');
const askLLM = require('../Utils/askLLM');
const memoryFunc = require('../Services/memoryStore');
const findProductMatch = require('../Services/aiHelpers');
const detectCallRequest = require('../Services/aiCallHelpers');



exports.ai = async (req, res, next) => {
  const { question, userId } = req.body;
  const products = findProductMatch(question);
  
  if(!products) {
    return next(new CustomError('The product you are looking for does not exist in our store at the moment would you mind checking out something else?', 404));
  };

  memoryFunc.addMessages(userId, 'user', question);

  const memory = memoryFunc.getMemory(userId);
  const response = await askLLM(products, dummyData, question, memory);
  
  const { parsedRes } = detectCallRequest(response);
  const isCallIntent = parsedRes?.intent === "call";

  if (isCallIntent) {
    return res.status(200).json({
      status: 'success',
      message: "initiating whatsApp agent",
      whatsApp: "+2349065854493",
      data: { response: parsedRes.reply || "Please click the button below to talk to our human agent" }
    });
  }

  memoryFunc.addMessages(userId, 'assistant', response);

  res.status(200).json({
    status: 'success',
    data: { response }
  });
};
