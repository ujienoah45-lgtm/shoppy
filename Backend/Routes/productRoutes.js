const express = require('express');
const controller = require('../Controllers/productControllers');
const protectController = require('../MiddleWare/protect');
const upload = require('../MiddleWare/multer');

const router = express.Router();

router.route('/')
  .get(controller.getProducts)
  .post(protectController.protect, protectController.role('admin', 'super-admin'),upload.array('images', 3), controller.addProduct)


router.route('/:productId')
  .patch(protectController.protect, protectController.role("admin", "super-admin"),upload.array('images', 3), controller.updateProduct)
  .delete(protectController.protect, protectController.role("admin", "super-admin"), controller.deleteProduct);

module.exports = router;