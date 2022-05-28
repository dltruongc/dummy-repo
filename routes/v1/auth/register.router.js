const router = require('express').Router();

const registerController = require('../../../controllers/auth/register/register.controller');

router
  .route('/')
  .get(registerController.show)
  .post(registerController.register);

module.exports = router;
