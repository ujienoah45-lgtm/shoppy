const express = require('express');
const protectController = require('../MiddleWare/protect');
const controller = require('../Controllers/paymentControllers');

const router = express.Router();

router.route('/')
  .get(protectController.protect, controller.getBankDetails);



module.exports = router;