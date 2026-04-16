const express = require('express');
const controller = require('../Controllers/cartControllers');
const protectController = require('../MiddleWare/protect');


const router = express.Router();

router.route('/')
  .get(protectController.protect, controller.getCart)
  .delete(protectController.protect, controller.clearCart);

router.route('/add')
  .post(protectController.protect, controller.addToCart);

router.route('/remove/:productId')
  .delete(protectController.protect, controller.removeFromCart);

router.route('/:productId')
  .patch(protectController.protect, controller.increaseQty)
  .delete(protectController.protect, controller.reduceQty);
module.exports = router;