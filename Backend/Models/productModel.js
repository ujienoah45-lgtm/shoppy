const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide the name of your product"],
    trim: true,
    lowercase: true,
    minLength: 4,
    maxLength: 50
  },
  description: {
    type: String,
    trim: true,
    lowercase: true,
    minLength: 4,
    maxLength: 200
  },
  category: {
    type: String,
    trim: true,
    lowercase: true,
    enum: ["watches","wallets","belts","sunglasses","bracelets","caps","necklaces","rings","perfumes","cufflinks","tie clips","t-shirts","shirts","shorts","trousers","hoodies","jackets","shoes"
],
  },
  sizes: [String],
  colors: [String],
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    trim: true,
    lowercase: true,
  },
  stock: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  rating: Number,
  numReviews: Number,
  isActive: {type: Boolean, default: true}
},{
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;