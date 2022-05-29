const debug = require('debug')('app:controller:global:balance');

const Balance = require('../../../models/Balance');
const TradingHistory = require('../../../models/TradingHistory');

const checkCreditCardMiddleware = require('./middleware/check-credit-card.middleware');
const rechargeBalanceValidatorMiddleware = require('./middleware/recharge-balance.validator');

const rechargeBalanceHandler = async (req, res, next) => {
  try {
    const { amount } = req.body;

    let balanceInfo = await Balance.findAndSelectByUsername(
      req.user.username,
      'id'
    );

    if (!balanceInfo) {
      // create one if not exists
      const newBalanceId = await Balance.create({
        username: req.user.username,
        balance: 0,
      });

      balanceInfo = { id: newBalanceId };
    }

    await Balance.updateBalanceById(balanceInfo.id, amount);

    await TradingHistory.create({
      type: 0,
      status: 0,
      username: req.user.username,
      time: new Date(),
      message: 'Nạp tiền từ thẻ tín dụng',
      quantity: 1,
      amountMoney: amount,
      tel: req.user.tel,
    });

    return res.json({ message: 'Nạp tiền thành công' });
  } catch (error) {
    debug.extend('rechargeBalanceHandler')(error.message);
    return next(new Error('Nạp tiền thất bại. Vui lòng thử lại sau.'));
  }
};

/**
 * POST - http://localhost:8080/me/recharge
 *
 * Nạp tiền từ thẻ tín dụng vào tài khoản
 */
module.exports.rechargeBalance = [
  rechargeBalanceValidatorMiddleware,
  checkCreditCardMiddleware,
  rechargeBalanceHandler,
];
