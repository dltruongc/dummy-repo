const express = require('express');

const loginController = require('../../../controllers/auth/login/login.controller');

const router = express.Router();

// http://localhost:8080/login
router.route('/').get(loginController.show).post(loginController.login);

module.exports = router;
