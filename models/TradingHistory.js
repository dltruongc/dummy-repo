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

/**
 * Tạo và lưu một record mới
 * @param {{
  username: string,
  type: 0 | 1 | 2 | 3,
  amountMoney: number,
  time: string | Date,
  status: 0 | 1 | 2,
  tel?: string,
  tradingCode?: string,
  quantity?: number,
  message?: string,
  phoneCardCode?: string,
  ticketCode?: string,
 }}
 * @returns {Promise<number>}  insert id
 */
TradingHistory.create = async ({
  username,
  tel,
  type,
  tradingCode,
  quantity,
  amountMoney,
  time,
  status,
  message,
  phoneCardCode,
  ticketCode,
}) => {
  const sql = `INSERT INTO ${TradingHistory.tableName} SET ? `;

  const [list] = await conn.promise().query(sql, {
    username,
    tel,
    type,
    tradingCode,
    quantity,
    amountMoney,
    time,
    status,
    message,
    phoneCardCode,
    ticketCode,
  });

  return list.insertId;
};

module.exports = TradingHistory;
