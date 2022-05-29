const express = require('express');

const balanceController = require('../../../../controllers/global/balance/balance.controller');

const router = express.Router();

router.route('/balance/recharge').post(balanceController.rechargeBalance);

module.exports = router;
