const Order = require("../Models/orderModel");
const Cart = require("../Models/cartModel");
const User = require("../Models/userModel");
const Product = require("../Models/productModel");
const CustomError = require("../Utils/customError");
const ApiFeatures = require('../Utils/apiFeatures');
const sanitizeFields = require("../Services/sanitizeUpdate");
const crypto = require("crypto");

const DELIVERYFEE = Number(process.env.DELIVERYFEE);

const genTrackingId = () => {
  const trackingId = crypto.randomBytes(5).toString("hex").toUpperCase();

  return {
    trackingId
  };
};
exports.saveOrder = async (req, res, next) => {
  //after checkout, reduce the quantity of the products bought by the customer 
  // or remove the product entirely if the quantity the user bought is equal to the quantity that was in the store.
  const {customerName, customerPhone, customerAddress, paymentMethod } = req.body;
  if(!customerName || !customerPhone || !customerAddress || !paymentMethod) {
    return next( new CustomError("Please provide the necessary order details", 400));
  };

  const cart = await Cart.findOne({user: req.user.id}).populate({
    path: "items.product",
    select: "_id name price stock isActive"
  });
  
  if(!cart) {
    return next( new CustomError("Cart not found", 404));
  };

  const { trackingId } = genTrackingId();
  const total = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const order = await Order.create({
    trackingId,
    customerAddress,
    customerName,
    customerPhone,
    date: new Date().toISOString(),
    items: cart.items,
    deliveryFee: DELIVERYFEE,
    paymentMethod,
    total: Number(total + DELIVERYFEE),
    user: req.user.id
  });

  // cart.items = [];
  // await cart.save();


  res.status(200).json({
    status: 'success',
    message: 'Order submitted successfully',
    data: { order }
  });
};

exports.getOrders = async (req, res, next) => {
  const findOrder = Order.find({user: req.user.id}).populate({
    path: "items.product",
    select: "name price"
  });
  const orders = await new ApiFeatures(findOrder, req.query).execute();
  
  res.status(200).json({
    status: 'success',
    message: 'Orders fetched successfully',
    data: { orders }
  });
};

exports.getAllOrders = async (req, res, next) => {
  const user = await User.findOne({_id: req.user.id, role: "admin"});
  if(!user) {
    return next( new CustomError("User not found or you do not have permission to perform this action", 401));
  };

  const findOrders = Order.find();
  const orders = await new ApiFeatures(findOrders, req.query).execute();

  res.status(200).json({
    status: 'success',
    message: "Orders fetched successfully",
    data: { orders }
  });
};


exports.updateOrderStatus = async ( req, res, next) => {
  const { trackingId } = req.params;
  if(!trackingId) {
    return next( new CustomError("Order not found", 404));
  };

  const user = await User.findOne({_id: req.user.id, role: "admin"});
  if(!user) {
    return next( new CustomError("User not found or you do not have permission to perform this action", 401));
  };

  const update = sanitizeFields(req, "status");

  const updatedOrder = await Order.findOneAndUpdate({trackingId}, update, {runValidators: true, new: true});

  res.status(200).json({
    status: 'success',
    message: "Order updated successfully",
    data: { updatedOrder }
  });
};
