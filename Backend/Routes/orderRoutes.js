const express = require('express');
const controller = require('../Controllers/orderControllers');
const protectController = require('../MiddleWare/protect');

const router = express.Router();

router.route('/')
  .get(protectController.protect, controller.getOrders)
  .post(protectController.protect, controller.saveOrder);

router.route('/admin')
  .get(protectController.protect, protectController.role('admin', 'super-admin'), controller.getAllOrders);

router.route('/admin/:trackingId')
  .patch(protectController.protect, protectController.role('admin', 'super-admin'), controller.updateOrderStatus);

module.exports = router;
