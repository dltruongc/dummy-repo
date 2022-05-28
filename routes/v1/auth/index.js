const express = require('express');
const router = express.Router();

const loginRouter = require('./login.router');
const registerRouter = require('./register.router');

// http://localhost:8080/register
router.use('/register', registerRouter);

// http://localhost:8080/login
router.use('/login', loginRouter);

module.exports = router;
