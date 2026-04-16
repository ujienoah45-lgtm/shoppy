const express = require('express');
const controller = require('../Controllers/authControllers');
const protectController = require('../MiddleWare/protect');
const userController = require('../Controllers/userControllers');

const router = express.Router();

router.route('/signup')
  .post(controller.signUp);

router.route('/signup-adm')
  .post(controller.signUpAdmin);

router.route('/login')
  .post(controller.login);

router.route("/me")
  .get(protectController.protect, userController.getMe);

router.route('/logout')
  .post(controller.logout);

module.exports = router;