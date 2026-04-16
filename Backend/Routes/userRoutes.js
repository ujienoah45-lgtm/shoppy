const express = require('express');
const controller = require('../Controllers/userControllers');
const protectController = require('../MiddleWare/protect');

const router = express.Router();

router.route('/update-me')
  .patch(protectController.protect, controller.updateMe);

router.route('/admin/users')
  .get(protectController.protect, protectController.role('admin', 'super-admin'), controller.getUsers);



module.exports = router;
