const Product = require('../Models/productModel');
const User = require('../Models/userModel');
const ApiFeatures = require('../Utils/apiFeatures');
const sanitizeFields = require('../Services/sanitizeUpdate');
const CustomError = require('../Utils/customError');


exports.getProducts = async (req, res, next) => {
  const findProducts = Product.find({isActive: true});
  const products = await new ApiFeatures(findProducts, req.query).execute();
  
  res.status(200).json({
    status: 'success',
    length: products.length,
    data: { products }
  });
};


exports.addProduct = async (req, res, next) => {
  const { name, description,category, sizes, colors, price, brand,stock} = req.body;
  const imageUrls = [];

  const images = req.files;
  for(const image of images) {
    imageUrls.push(image.filename);
  };
  
  if(!name || !category || !sizes || !colors || !price || !brand || !stock) {
    return next( new CustomError("Please provide the necessary details needed to add a product", 400));
  };

  const user = await User.findOne({_id: req.user?.id, role: "admin"});
  if(!user) {
    return next( new CustomError("User not found OR you do not have permission to access this route", 401));
  };

  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    price,
    brand,
    stock,
    images: imageUrls,
  });

  res.status(201).json({
    status: 'success',
    message: "Product created successfully",
    data: { product }
  });
};

exports.updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  if(!productId) {
    return next( new CustomError("Please provide the product ID", 400));
  };

  const user = await User.findOne({_id: req.user.id, role: "admin"});
  if(!user) {
    return next( new CustomError('User not found or you do not have permission to perform this action', 401));
  };

  const { updateFields, imageUrls } = sanitizeFields(req, "name", "description", "category", "sizes", "colors", "price", "brand", "stock", "images", "rating", "numReviews");
  if (imageUrls.length > 0) {
    updateFields.images = imageUrls;
  }


  const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, {runValidators: true, new: true});
  if(!updatedProduct) {
    return next( new CustomError("Product not found please confirm the ID and try again", 404));
  };

  res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: { updatedProduct}
  });
};

exports.deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  if(!productId) {
    return next( new CustomError("Please provide the product ID", 400));
  };

  const deletedProduct = await Product.findByIdAndDelete(productId);
  if(!deletedProduct) {
    return next( new CustomError("Product not found please confirm the ID and try again", 404));
  };

  res.status(204).json({
    status: 'success',
    message: 'Product deleted successfully',
    data: null
  });
};

