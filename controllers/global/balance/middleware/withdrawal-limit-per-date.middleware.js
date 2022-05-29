const TradingHistory = require('../../../../models/TradingHistory');
const createHttpError = require('http-errors');
/**
 * Tối đa thực hiện 2 giao dịch rút tiền mỗi ngày
 */
module.exports = async function withdrawalLimitPerDateMiddleware(
  req,
  res,
  next
) {
  const withdrawalCount = await TradingHistory.countWithdrawalByDate(
    new Date()
  );

  if (withdrawalCount >= 2)
    return next(createHttpError(400, 'Đã hết số lần rút tiền hôm nay'));

  return next();
};
