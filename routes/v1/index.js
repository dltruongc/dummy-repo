const v1Router = require('express').Router();

const globalRouter = require('./global');
const authRouter = require('./auth');

// global and auth have same root point
v1Router.use('/', globalRouter);
v1Router.use('/', authRouter);

module.exports = v1Router;
