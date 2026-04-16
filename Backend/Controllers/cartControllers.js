const Cart = require('../Models/cartModel');
const Product = require('../Models/productModel');
const CustomError = require('../Utils/customError');

exports.getCart = async (req, res, next) => {
  const id = req.user.id;
  const cart = await Cart.findOne({ user: id }).populate("items.product");
  if(!cart) {
    return next(new CustomError("Cart not found or might have been deleted.", 404));
  };

  res.status(200).json({
    status: 'success',
    length: cart?.length,
    data: { cart }
  });
};


exports.addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return next(new CustomError("Please provide the product ID and quantity you wish to add to your cart", 400));
  };

  const product = await Product.findById(productId);
  if (!product) {
    return next(new CustomError("Sorry we are out of stock", 404));
  };

  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user.id,
      items: [
        {
          product: productId,
          quantity
        }
      ]
    });
  } else {
    const item = cart.items.find(i => i.product.equals(productId));
    if (item) item.quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();
  };
  await cart.populate("items.product");

  res.status(200).json({
    status: 'success',
    message: 'Product added to cart sucessfully',
    data: { cart }
  });
};

exports.removeFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  if (!cart) {
    return next(new CustomError("Cart not found", 404));
  };

  cart.items = cart.items.filter(i => !i.product.equals(productId));
  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    status: 'success',
    message: 'Cart Updated',
    data: { cart }
  });
};


exports.increaseQty = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!productId || !quantity) {
    return next(new CustomError("Please provide the ID of the product you want to update and the quantity", 400));
  };

  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

  if (!cart) {
    return next(new CustomError('Cart not found', 404));
  };

  const product = await Product.findById(productId);
  if (!product || product.stock < quantity) {
    return next(new CustomError(`Sorry we are out of stock we only have ${product.stock} left`, 400));
  };

  const item = cart.items.find(i => i.product.equals(productId));
  if (!item) {
    return next(new CustomError('Item does not exist or might have been recently deleted', 404))
  };
  if (quantity <= 1) {
    return next(new CustomError('Quantity must be greater than 1', 400));
  };

  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    status: 'success',
    message: 'Quantity increased successfully',
    data: { cart }
  });
};

exports.reduceQty = async (req, res, next) => {
  const { productId } = req.params;
  let { quantity } = req.body;
  quantity = quantity.toString();

  if (!productId || !quantity) {
    return next(new CustomError("Please provide the product ID and quantity", 400));
  };

  const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
  if (!cart) {
    return next(new CustomError("Cart not found", 404));
  };

  const item = cart.items.find(i => i.product.equals(productId));
  if (!item) {
    return next(new CustomError("Item does not exist or might have been recently deleted", 404));
  };

  const product = await Product.findById(productId);
  if (!product || product.stock < quantity) {
    return next(new CustomError("Product not found or quantity is greater than stock"));
  };

  if (item.quantity < quantity) {
    return next(new CustomError("quantity must be less than existing quantity if you are trying to increase quantity then use the increment button", 400));
  };

  if (quantity <= 0) {
    cart.items = cart.items.filter(i => !i.product.equals(productId));
  } else {
    item.quantity = quantity;
  }
  await cart.save();
  await cart.populate("items.product");

  res.status(200).json({
    status: 'success',
    message: 'Item quantity reduced successfully',
    data: { cart }
  });
};

exports.clearCart = async (req, res, next) => {
  const cart = await Cart.findOne({user: req.user.id});
  if(!cart) {
    return next(new CustomError("Cart not found", 404));
  };

  cart.items = [];
  await cart.save();

  res.status(200).json({
    status: 'success',
    data: { cart }
  });
};