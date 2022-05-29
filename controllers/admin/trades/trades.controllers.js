/**
 * Quản lí giao dịch
 */

const createHttpError = require('http-errors');
const debug = require('debug')('app:controller:trade');

const Account = require('../../../models/Account');
const Balance = require('../../../models/Balance');
const TradingHistory = require('../../../models/TradingHistory');

/**
 * GET - http://localhost:8080/admin/trades
 *
 * Xem danh sách các giao dịch rút tiền/chuyển tiền trên 5 triệu đang chờ để được duyệt sắp xếp giảm dần theo thời gian
 */
module.exports.showTradingHistoriesList = async (req, res, next) => {
  try {
    const tradesList = await TradingHistory.getTradingListByAmount(5000000);

    // return res.render('erewrwer', { tradesList })
    return res.json(tradesList);
  } catch (error) {
    debug.extend('showTradesList')(error.message);
    return next(createHttpError('Không thể thực hiện yêu cầu lúc này.'));
  }
};

/**
 * GET - http://localhost:8080/admin/trades/{tradeId}
 *
 * xem thông tin chi tiết của 1 giao dịch
 */
module.exports.showTradingHistoryDetail = async (req, res, next) => {
  const { tradeId } = req.params;

  try {
    const tradeInfo = await TradingHistory.findById(tradeId);

    if (!tradeInfo)
      return next(createHttpError(404, 'Không tìm thấy thông tin giao dịch'));

    // nguoi giao dich
    const account = await Account.findByUsername(tradeInfo.username);

    // return res.render('erewrwer', { tradeInfo, account })
    return res.json({ tradeInfo, account });
  } catch (error) {
    debug.extend('showTradesList')(error.message);
    return next(createHttpError('Không thể thực hiện yêu cầu lúc này.'));
  }
};

/** POST - http://localhost:8080/admin/trades/confirmation/confirm
 * admin đồng ý phê duyệt giao dịch
 * -- status: 0 là thành công, 1 là thất bại, 2 là chờ duyệt
 */
module.exports.confirmTrade = async (req, res, next) => {
  const { id: tradeId } = req.body;

  try {
    const tradeInfo = await TradingHistory.findById(tradeId);

    if (!tradeInfo)
      return next(createHttpError('Không tìm thấy thông tin giao dịch'));

    if (tradeInfo.status !== '2')
      return next(createHttpError(400, 'Giao dịch này đã được xử lí trước đó'));

    // >>> đảm bảo số dư đủ để thực hiện giao dịch
    const balanceInfo = await Balance.findByUsername(tradeInfo.username);

    if (!balanceInfo)
      return next(
        createHttpError(404, 'Không tìm thấy thông tin số dư của tài khoản')
      );

    const totalFee = tradeInfo.amountMoney + tradeInfo.tradingFee;
    if (balanceInfo.balance < totalFee)
      return next(
        createHttpError(
          400,
          'Phê duyệt thất bại, số dư của tài khoản không đủ để thực hiện giao dịch'
        )
      );
    // <<< đảm bảo số dư đủ để thực hiện giao dịch

    // cập nhật số dư tài khoản
    const balanceUpdated = await Balance.updateBalanceById(
      balanceInfo.id,
      -totalFee
    );

    // cập nhật thông tin giao dịch
    const tradeUpdated = await TradingHistory.updateTradeStatus(tradeId, '0');

    return res.json({ tradeUpdated, balanceUpdated });
  } catch (error) {
    debug.extend('confirmTrade')(error.message);
    return next(createHttpError('Không thể thực hiện yêu cầu lúc này.'));
  }
};

/** POST - http://localhost:8080/admin/trades/confirmation/cancel
 * admin KHÔNG đồng ý phê duyệt giao dịch
 * -- status: 0 là thành công, 1 là thất bại, 2 là chờ duyệt
 */
module.exports.cancelTrade = async (req, res, next) => {
  const { id: tradeId } = req.body;

  try {
    const tradeInfo = await TradingHistory.findById(tradeId);

    if (!tradeInfo)
      return next(createHttpError('Không tìm thấy thông tin giao dịch'));

    if (tradeInfo.status !== '2')
      return next(createHttpError(400, 'Giao dịch này đã được xử lí trước đó'));

    const updated = await TradingHistory.updateTradeStatus(tradeId, '1');

    return res.json({ updated });
  } catch (error) {
    debug.extend('cancelTrade')(error.message);
    return next(createHttpError('Không thể thực hiện yêu cầu lúc này.'));
  }
};
