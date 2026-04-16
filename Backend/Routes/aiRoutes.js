const express = require('express');
const controller = require('../Controllers/aiControllers');
const router = express.Router();

router.route('/')
  .post(controller.ai);


module.exports = router;