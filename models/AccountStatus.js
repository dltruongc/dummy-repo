const conn = require('./_connector');

class AccountStatus {
  static tableName = 'accountStatus';
}

/**
 * Lấy thông tin kích hoạt theo username
 * @param {string} username
 * @returns {Promise<Object | null>}
 */
AccountStatus.getAccountStatusByUsername = async function (username) {
  const [accountStatusInfo] = await conn
    .promise()
    .query('SELECT * FROM accountStatus WHERE username = ?', [username]);

  return accountStatusInfo[0];
};

/**
 * Danh sách tài khoản theo trạng thái kích hoạt
 * [tài khoản mới tạo hoặc mới được bổ sung CMND sẽ hiển thị trước.]
 *
 * @param {'0' | '1' | '2' | '3'} status 0 là chờ, 1 là đã xác thực, 2 là chờ cập nhật thông tin, 3 là không hợp lệ
 * @param {string} orderBy (chỉ sort trên bảng chính accountStatus) EX: "updatedAt DESC"
 */
AccountStatus.adminQueryByAccountStatus = async function (
  status,
  orderBy = 'updatedAt DESC'
) {
  const sql =
    'SELECT * FROM accountStatus ' +
    'JOIN account on account.username = accountStatus.username ' +
    'WHERE accountStatus.accountStatus = ? ORDER BY accountStatus.' +
    orderBy;

  const [list] = await conn.promise().query(sql, [status]);

  return list;
};

/**
 * admin cập nhật trạng thái kích hoạt trên 1 tài khoản
 * @param {string} username tên tài khoản được cập nhật
 * @param {'0' | '1' | '2' | '3'} status 0 là chờ, 1 là đã xác thực, 2 là chờ cập nhật thông tin, 3 là không hợp lệ
 * @returns {Promise<boolean>}
 */
AccountStatus.adminUpdateAccountActivationStatus = async function (
  username,
  status
) {
  const sql = 'UPDATE accountStatus SET accountStatus = ? WHERE username = ?';

  const [list] = await conn.promise().query(sql, [status, username]);

  return list.affectedRows === 1;
};

module.exports = AccountStatus;
