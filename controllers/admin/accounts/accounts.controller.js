/**
 * Admin quan ly danh sach tai khoan
 */

const debug = require('debug')('app:controller:account');
const createError = require('http-errors');

const AccountStatus = require('../../../models/AccountStatus');
const Account = require('../../../models/Account');
const TradingHistory = require('../../../models/TradingHistory');

// GET - http://localhost:8080/admin/accounts/activation/waiting-activation
// Danh sách tài khoản đang chờ kích hoạt:
// tài khoản mới tạo hoặc mới được bổ sung CMND sẽ hiển thị trước.
module.exports.showWaitingForActivationList = async (req, res, next) => {
  try {
    const accountsList = await AccountStatus.adminQueryByAccountStatus('0');

    // accountsList = [{"id":1,"username":"Ernest","tel":"01460 1869","accountStatus":"0","loginStatus":"0","message":"hihi","password":"$2b$10","name":"Ernest","email":"Ernest","birth":"2022-05-10T17:00:00.000Z","address":"Ernest","fontid":"Ernest","backid":"Ernest"}]
    return res.json(accountsList);
  } catch (e) {
    debug.extend('showWaitingForActivationList')(e.message);

    // Nếu có lỗi xảy ra mặc định gửi về danh sách rỗng
    // accountsList = []
    return res.json([]);
  }
};

// GET - http://localhost:8080/admin/accounts/activation/activated
// Danh sách tài khoản đã kích hoạt: sắp xếp giảm dần theo ngày tạo.
module.exports.showActivatedList = async (req, res, next) => {
  try {
    const accountsList = await AccountStatus.adminQueryByAccountStatus(
      '1',
      'createdAt DESC'
    );

    // accountsList = [{"id":0,"username":"1234567890","tel":"0868084080","accountStatus":"1","loginStatus":"0","message":"","password":"$2b$10","name":"Nguyễn Văn Điểm","email":"nguyenvandiem@gmail.com","birth":"2001-01-08T17:00:00.000Z","address":"HCM","fontid":"abc12345","backid":"abc67890"}]
    return res.json(accountsList);
  } catch (e) {
    debug.extend('showActivatedList')(e.message);

    // Nếu có lỗi xảy ra mặc định gửi về danh sách rỗng
    // accountsList = []
    return res.json([]);
  }
};

// GET - http://localhost:8080/admin/accounts/activation/disabled
// Danh sách tài khoản đã bị vô hiệu hóa (do không đồng ý kích hoạt): sắp xếp giảm dần theo ngày tạo.
module.exports.showDisabledList = async (req, res, next) => {
  try {
    const accountsList = await AccountStatus.adminQueryByAccountStatus(
      '2',
      'createdAt DESC'
    );

    // accountsList = [{"id":2,"username":"JesusCook","tel":"01384 7919","accountStatus":"2","loginStatus":"0","message":"KUJBRjTYuVerGzqOthqo","password":"JesusC","name":"JesusCook","email":"JesusCook","birth":"2022-05-10T17:00:00.000Z","address":"JesusCook","fontid":"JesusCook","backid":"JesusCook"}]
    return res.json(accountsList);
  } catch (e) {
    debug.extend('showDisabledList')(e.message);
    return res.json([]);
  }
};

// GET - http://localhost:8080/admin/accounts/activation/locked
// Danh sách tài khoản đang bị khóa vô thời hạn (do nhập đăng nhập sai nhiều lần): sắp xếp giảm dần theo thời gian bị khóa.
module.exports.showLockedList = async (req, res, next) => {
  try {
    const accountsList = await AccountStatus.adminQueryByAccountStatus(
      '3',
      'updatedAt DESC'
    );

    // accountsList = [{"id":3,"username":"Hulda","tel":"023 8112 4","accountStatus":"3","loginStatus":"0","message":"ANVHWGcXkrllcNgM","password":"Hulda","name":"Hulda","email":"Hulda","birth":"2022-05-10T17:00:00.000Z","address":"Hulda","fontid":"Hulda","backid":"Hulda"}]
    return res.json(accountsList);
  } catch (e) {
    debug.extend('showLockedList')(e.message);
    return res.json([]);
  }
};

// POST - http://localhost:8080/admin/accounts/activation/active
// admin xác minh tài khoản
module.exports.activateAccountByUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    const accountStatusInfo = await AccountStatus.getAccountStatusByUsername(
      username
    );

    if (!accountStatusInfo) {
      return next(
        new Error(
          'Không tìm thấy thông tin kích hoạt theo username: ' + username
        )
      );
    }

    if (accountStatusInfo.accountStatus !== '0') {
      return next(
        new Error('Thao tác không hợp lệ, tài khoản không yêu cầu xác minh.')
      );
    }

    const updated = await AccountStatus.adminUpdateAccountActivationStatus(
      username,
      '1'
    );

    return res.json({ updated });
  } catch (e) {
    debug.extend('activateAccountByUsername')(e.message);
    return next(createError(422, 'Xác minh tài khoản thất bại.'));
  }
};

// POST - http://localhost:8080/admin/accounts/activation/unlock
// admin unlock tài khoản
module.exports.unlockAccountByUsername = async (req, res, next) => {
  try {
    const { username } = req.body;

    const accountStatusInfo = await AccountStatus.getAccountStatusByUsername(
      username
    );

    if (!accountStatusInfo) {
      return next(
        new Error(
          'Không tìm thấy thông tin kích hoạt theo username: ' + username
        )
      );
    }

    if (accountStatusInfo.accountStatus !== '3') {
      return next(
        new Error('Thao tác không hợp lệ, tài khoản không bị vô hiệu hoá')
      );
    }

    const updated = await AccountStatus.adminUpdateAccountActivationStatus(
      username,
      '1'
    );

    return res.json({ updated });
  } catch (e) {
    debug.extend('unlockAccountByUsername')(e.message);
    return next(422, 'Mở khoá tài khoản thất bại.');
  }
};

// GET - http://localhost:8080/admin/accounts/activation/{accountId}
// xem thông tin chi tiết của tài khoản
module.exports.showAccountDetail = async (req, res, next) => {
  try {
    const { accountId } = req.params;

    const accountInfo = await Account.findById(accountId);

    if (!accountInfo)
      return next(createError(404, 'Không tìm thấy thông tin tài khoản'));

    const accountStatus = await AccountStatus.getAccountStatusByUsername(
      accountInfo.username
    );

    const tradingHistory = await TradingHistory.getTradingListByUsername(
      accountInfo.username
    );

    /**
     *  DATA:
     *   "accountStatus": {
     *     "id": 2,
     *     "username": "Ernest",
     *     "tel": "01460 1869",
     *     "accountStatus": "0",
     *     "loginStatus": "0",
     *     "message": "hihi",
     *     "createdAt": "2022-05-28T11:55:05.000Z",
     *     "updatedAt": "2022-05-28T11:55:05.000Z"
     *   },
     *   "account": {
     *     "id": 1,
     *     "username": "Ernest",
     *     "password": "$2b$10",
     *     "name": "Ernest",
     *     "email": "Ernest",
     *     "tel": "01460 1869",
     *     "birth": "2022-05-10T17:00:00.000Z",
     *     "address": "Ernest",
     *     "fontid": "Ernest",
     *     "backid": "Ernest",
     *     "createdAt": "2022-05-28T11:55:05.000Z",
     *     "updatedAt": "2022-05-28T11:55:05.000Z"
     *   },
     *   "tradingHistory": [
     *     {
     *       "id": 2,
     *       "username": "Ernest",
     *       "tel": "01460 1869",
     *       "type": "0",
     *       "tradingCode": "01460 1869",
     *       "quantity": null,
     *       "amountMoney": 150000,
     *       "tradingFee": 0,
     *       "time": "2017-07-28T05:25:38.000Z",
     *       "status": "-",
     *       "message": "Nạp tiền từ thẻ vào ví",
     *       "phoneCardCode": null,
     *       "ticketCode": null,
     *       "createdAt": "2022-05-28T22:26:11.000Z",
     *       "updatedAt": "2022-05-28T22:26:11.000Z"
     *     }
     *   ]
     * }
     */
    // return res.render('bla bla', { accountStatus, account: accountInfo, tradingHistory })
    return res.json({ accountStatus, account: accountInfo, tradingHistory });
  } catch (e) {
    debug.extend('showAccountDetail')(e.message);
    return next(500, 'Không thể thực hiện yêu cầu lúc này!');
  }
};
