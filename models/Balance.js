const conn = require('./_connector');

class Balance {
  static tableName = 'balance';
}

/**
 * Tìm thông tin số dư theo ID
 * @param {number | string} id
 * @returns
 */
Balance.findById = async (id) => {
  const sql = `SELECT * FROM ${Balance.tableName} WHERE id=?`;

  const [list] = await conn.promise().query(sql, [id]);

  return list[0];
};

/**
 * Tìm thông tin số dư theo username
 * @param {string} username
 * @returns
 */
Balance.findByUsername = async (username) => {
  const sql = `SELECT * FROM ${Balance.tableName} WHERE username=?`;

  const [list] = await conn.promise().query(sql, [username]);

  return list[0];
};

/**
 * Cập nhật số dư theo ID
 * @param {number} amount nếu `amount` < 0, thực hiện trừ tiền trong tài khoản
 * @returns
 */
Balance.updateBalanceById = async (id, amount) => {
  const sql = `UPDATE ${Balance.tableName} SET balance=balance + ? WHERE id=?`;

  const [list] = await conn.promise().query(sql, [amount, id]);

  return list[0];
};

module.exports = Balance;
