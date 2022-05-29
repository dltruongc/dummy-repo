const debug = require('debug')('app:controller:global:balance');

const createHttpError = require('http-errors');
const Balance = require('../../../models/Balance');
const TradingHistory = require('../../../models/TradingHistory');

const rechargeCheckCreditCardMiddleware = require('./middleware/recharge-check-credit-card.middleware');
const rechargeBalanceValidatorMiddleware = require('./middleware/recharge-balance.validator');
const withdrawalLimitPerDateMiddleware = require('./middleware/withdrawal-limit-per-date.middleware');
const withdrawalCheckCreditCardMiddleware = require('./middleware/withdrawal-check-credit-card.middleware');
const withdrawalValidatorMiddleware = require('./middleware/withdrawal-validator.middleware');

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

    await Balance.updateBalanceById(balanceInfo.id, +amount);

    await TradingHistory.create({
      type: 0,
      status: 0,
      username: req.user.username,
      time: new Date(),
      message: 'Nạp tiền từ thẻ tín dụng',
      quantity: 1,
      amountMoney: +amount,
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
  rechargeCheckCreditCardMiddleware,
  rechargeBalanceHandler,
];

const withdrawalHandler = async (req, res, next) => {
  const { note, amount } = req.body;

  try {
    const fee = (amount * 5) / 100;
    const totalFee = amount + fee;

    const balanceInfo = await Balance.findByUsername(req.user.username);

    if (totalFee > balanceInfo.balance)
      return next(
        createHttpError(400, 'Không đủ tiền trong tài khoản, phí rút 5%')
      );

    await TradingHistory.create({
      type: 1,
      status: totalFee > 5 * 10e5 ? 2 : 0,
      username: req.user.username,
      time: new Date(),
      message: note,
      quantity: 1,
      amountMoney: amount,
      tel: req.user.tel,
      tradingFee: fee,
    });

    await Balance.updateBalanceById(balanceInfo.id, -totalFee);

    return res.json({
      message:
        totalFee > 5 * 10e5
          ? 'Thao tác thành công, vui lòng chờ Admin phê duyệt'
          : 'Rút tiền thành công',
    });
  } catch (error) {
    debug.extend('withdrawal')(error.message);
    return next(new Error('Rút tiền thất bại. Vui lòng thử lại sau.'));
  }
};

/**
 * POST - http://localhost:8080/me/withdrawal
 *
 * User thực hiện rút số tiền đang có trong ví về thẻ tín dụng
 */
module.exports.withdrawal = [
  withdrawalValidatorMiddleware,
  withdrawalCheckCreditCardMiddleware,
  withdrawalLimitPerDateMiddleware,
  withdrawalHandler,
];
