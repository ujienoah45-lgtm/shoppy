const Bank = require('../Models/bankDetails');
const CustomError = require('../Utils/customError');

exports.getBankDetails = async (req, res, next) => {
  const bankDetails = await Bank.findOne({});
  if(!bankDetails) {
    return next( new CustomError("Something went wrong please wait...........", 400));
  };

  res.status(200).json({
    status: 'success',
    message: 'Please make the payment within the first 15 minutes of receiving the details',
    data: { bankDetails }
  });
};