const v1Router = require('express').Router();

const globalRouter = require('./global');
const adminRouter = require('./admin');
const authRouter = require('./auth');

// http://localhost:8080/admin
v1Router.use('/admin', adminRouter);

// http://localhost:8080/
v1Router.use('/', globalRouter);

// http://localhost:8080/
v1Router.use('/', authRouter);

module.exports = v1Router;
