const createHttpError = require('http-errors');
/**
 * Kiểm tra thông thẻ tín dụng và khả năng rút tiền của thẻ
 */
module.exports = async function withdrawalCheckCreditCardMiddleware(
  req,
  res,
  next
) {
  const { cardnumber, exp, cvv } = req.body;

  if (cardnumber.length !== 6)
    return next(createHttpError(400, 'Thẻ này không được hỗ trợ'));

  if (cardnumber !== '111111')
    return next(createHttpError(400, 'Thẻ này không được hỗ trợ để rút tiền'));

  if (Date.parse(exp) !== Date.parse('2022-10-10') || cvv !== '411')
    return next(createHttpError(400, 'Thông tin thẻ không hợp lệ'));

  return next();
};
