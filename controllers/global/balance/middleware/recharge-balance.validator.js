const createHttpError = require('http-errors');

/**
 * Form validation for rechargeBalance
 */
module.exports = function rechargeBalanceValidatorMiddleware(req, res, next) {
  const { cardnumber, amount } = req.body;

  if (parseInt(amount, 10) <= 0)
    return next(createHttpError(400, 'Số tiền nạp > 0'));

  if (cardnumber.length !== 6)
    return next(createHttpError(400, 'Thẻ này không được hỗ trợ'));

  req.body.amount = parseInt(amount);

  return next();
};
