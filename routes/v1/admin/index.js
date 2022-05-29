const express = require('express');
const router = express.Router();

const adminGuardMiddleware = require('../../../middleware/admin.guard.middleware');

const accountManagementRouter = require('./accounts');
const tradesManagementRouter = require('./trades');

// http://localhost:8080/admin/accounts
router.use('/accounts', adminGuardMiddleware, accountManagementRouter);

// http://localhost:8080/admin/trades
router.use('/trades', adminGuardMiddleware, tradesManagementRouter);

module.exports = router;
