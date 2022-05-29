const createHttpError = require('http-errors');
/**
 * Kiểm tra dữ liệu nhập cho rút tiền
 */
module.exports = async function withdrawalValidatorMiddleware(req, res, next) {
  const { amount } = req.body;

  if (!amount || amount < 0)
    return next(createHttpError(400, 'Số tiền không hợp lệ.'));

  if (amount % 50000 !== 0)
    return next(
      createHttpError(400, 'Số tiền rút phải là bội số của 50.000VND')
    );

  req.body.amount = parseInt(amount, 10);

  return next();
};
