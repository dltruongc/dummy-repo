const conn = require('./_connector');

class TradingHistory {
  static tableName = 'tradingHistory';
}

/**
 * Xem Danh Sách giao dịch của một user theo username
 */
TradingHistory.getTradingListByUsername = async (username) => {
  const sql = `SELECT * FROM ${TradingHistory.tableName} WHERE username= ?`;

  const [tradingHistoryList] = await conn.promise().query(sql, [username]);

  return tradingHistoryList;
};

/**
 *  Xem danh sách các giao dịch rút tiền/chuyển tiền theo số tiền tối thiểu
 * @param {number} amount số tiền giao dịch tối thiểu (1000 = 1000 đồng)
 * @param {string} orderBy
 */
TradingHistory.getTradingListByAmount = async (
  amount,
  orderBy = 'createdAt DESC'
) => {
  const sql =
    `SELECT * FROM ${TradingHistory.tableName} WHERE amountMoney >= ? ORDER BY ` +
    orderBy;

  const [tradingHistoryList] = await conn
    .promise()
    .query(sql, [Math.abs(amount)]);

  return tradingHistoryList;
};

/**
 * Tìm thông tin giao dịch theo id
 * @param {string | number} id
 */
TradingHistory.findById = async (id) => {
  const sql = `SELECT * FROM ${TradingHistory.tableName} WHERE id = ? `;

  const [tradingHistoryList] = await conn.promise().query(sql, [id]);

  return tradingHistoryList[0];
};

/**
 * Cập nhật trạng thái giao dịch theo ID
 * @param {string | number} id
 * @param { '0' | '1' | '2' } status trạng thái giao dịch: 0 là thành công, 1 là thất bại, 2 là chờ duyệt
 */
TradingHistory.updateTradeStatus = async (id, status) => {
  const sql = `UPDATE ${TradingHistory.tableName} SET status = ? WHERE id = ?`;

  const [list] = await conn.promise().query(sql, [status, id]);

  return list.affectedRows === 1;
};

module.exports = TradingHistory;
