const mongoose = require('mongoose');
const crypto = require("crypto");

const orderSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    trim: true,
    required: [true, "A tracking Id is required"],
    unique: true
  },
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  date: Date,
  status: {
    type: String,
    enum: ["failed", "pending", "delivered"],
    default: "pending",
    required: [true, "Indicate the order status"]
  },
  items: [{
    product: {type: mongoose.Schema.Types.ObjectId, ref: "Product", required: [true, "Please provide the name of the product"]},
    quantity: {type: Number, required: [true, "Please provide the quantity of the item bought"]},
  }],
  deliveryFee: Number,
  paymentMethod: String,
  total: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Please attach a user to this order"]
  }
},
{timestamps: true});

orderSchema.methods.genTrackingId = function() {
  const TID = crypto.randomUUID(10).toString("hex");

  this.trackingId = crypto.createHash("sha256").update(TID).digest("hex");
  return TID;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;