const conn = require('./_connector');

class Account {
  static tableName = 'account';
}

Account.findById = async (id) => {
  const sql = 'SELECT * FROM account WHERE id=?';

  const [list] = await conn.promise().query(sql, [id]);

  return list[0];
};

Account.findByUsername = async (username) => {
  const sql = 'SELECT * FROM account WHERE username=?';

  const [list] = await conn.promise().query(sql, [username]);

  return list[0];
};

module.exports = Account;
