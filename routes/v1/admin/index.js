const express = require('express');
const router = express.Router();

const adminGuardMiddleware = require('../../../middleware/admin.guard.middleware');

const accountManagementRouter = require('./accounts');

// http://localhost:8080/admin/accounts
router.use('/accounts', adminGuardMiddleware, accountManagementRouter);

module.exports = router;
