const express = require('express');

const balanceController = require('../../../../controllers/global/balance/balance.controller');
const transferRouter = require('./transfer.router');

const router = express.Router();

/**
 * http://localhost:8080/me/withdrawal
 *
 * Nạp tiền từ tín dụng vào tài khoản
 */
router.route('/balance/recharge').post(balanceController.rechargeBalance);

/**
 * http://localhost:8080/me/withdrawal
 *
 * Rút tiền đang có trong ví về thẻ tín dụng
 */
router.route('/balance/withdrawal').post(balanceController.withdrawal);

/**
 * http://localhost:8080/me/balance/transfers
 *
 * Chuyển tiền giữa các tài khoản
 */
router.use('/balance/transfers', transferRouter);

module.exports = router;
