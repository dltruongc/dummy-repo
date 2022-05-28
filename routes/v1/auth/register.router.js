const router = require('express').Router();

const registerController = require('../../../controllers/auth/register/register.controller');

// http://localhost:8080/register
router
  .route('/')
  .get(registerController.show)
  .post(registerController.register);

module.exports = router;
