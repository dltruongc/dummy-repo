const appRouter = require('express').Router();

const v1Router = require('./v1');

// http://localhost:8080/
appRouter.use('/', v1Router);

module.exports = appRouter;
