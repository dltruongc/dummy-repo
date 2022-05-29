const conn = require('./_connector');

class TradingHistory {
  static tableName = 'tradingHistory';
}

TradingHistory.getTradingListByUsername = async (username) => {
  const sql = `SELECT * FROM ${TradingHistory.tableName} WHERE username= ?`;

  const [tradingHistoryList] = await conn.promise().query(sql, [username]);

  return tradingHistoryList;
};

module.exports = TradingHistory;
