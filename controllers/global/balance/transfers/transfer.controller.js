// Chức năng này được sử dụng để chuyển tiền giữa các tài khoản trong cùng hệ thống.
//   Tương tự như rút tiền, nếu chuyển tiền nhiều hơn 5,000,000 đồng thì giao dịch cũng cần phải được duyệt bởi admin.
//   Trong giao diện chuyển tiền, user cần nhập số điện thoại của người nhận, số tiền muốn chuyển và ghi chú.
//   Giao diện sẽ tự động hiển thị thêm các thông tin cần thiết ví dụ như tên người nhận tiền để xác nhận trước khi chuyển.
//   Phí chuyển tiền là 5% số tiền cần chuyển, user có thể chọn bên gửi hoặc bên nhận chịu phí này.
//   Ở bước tiếp theo hệ thống sẽ gửi mã OTP 6 chữ số về email hoặc số điện thoại của user,
//   cần phải nhập đúng mã OTP trong khoảng thời gian 1 phút thì giao dịch chuyển tiền mới được thực hiện thành công.
//   Sau khi giao dịch chuyển tiền được xác nhận là thành công thì người nhận tiền sẽ nhận được một email tự động thông báo
//   về giao dịch nhận tiền và biến động số dư.
//   Sau mỗi lần chuyển/nhận tiền thành công cần ghi lại lịch sử giao dịch với đầy đủ các thông tin cần thiết.

const createHttpError = require('http-errors');
const randomString = require('randomstring');

const MailPlug = require('../../../../plugins/mail.plug');
const TradingHistory = require('../../../../models/TradingHistory');
const Account = require('../../../../models/Account');
const Balance = require('../../../../models/Balance');

/**
 * GET - http://localhost:8080/me/balance/transfers
 *
 * user truy cap page chuyển tiền
 */
module.exports.showTransfer = async (_req, _res, _next) => {
  // res.render(transferPage);
};

/**
 * POST - http://localhost:8080/me/balance/transfers
 *
 * (1) user submit form, trả dữ liệu về cho user so khớp và chờ user confirm giao dịch.
 * lưu thông tin form vào session để phục vụ bước 2
 */
module.exports.submitTransferForm = [
  (req, res, next) => {
    const { amountMoney, receiverPhone, feeBearer } = req.body;

    if (!amountMoney || +amountMoney <= 0)
      return next(createHttpError(400, 'Số tiền giao dịch không hợp lệ'));

    if (!receiverPhone)
      return next(
        createHttpError(400, 'Không được để trống số điện thoại người nhận')
      );

    if (feeBearer !== '0' && feeBearer !== '1')
      return next(
        createHttpError(
          400,
          'Vui lòng cho biết người chịu phí giao dịch (người gửi hoặc người nhận)'
        )
      );

    return next();
  },
  async (req, res, next) => {
    const { amountMoney, message, receiverPhone, feeBearer } = req.body;

    const receiverInfo = await Account.findByPhone(receiverPhone);

    if (!receiverInfo)
      return next(createHttpError(404, 'Không tìm thấy thông tin người nhận'));

    const transferFee = (+amountMoney * 5) / 100;

    req.session.transferData = {
      amountMoney: +amountMoney,
      message,
      receiverPhone,
      feeBearer,
      receiverInfo,
      transferFee,
    };

    // return res.render(confirmTransferPage, transferData);
    return res.json({ message: 'OK' });
  },
];

/**
 * POST - http://localhost:8080/me/balance/transfers/confirm
 *
 * (2) user đồng ý giao dịch (confirm), gửi OTP
 */
module.exports.otpProcess = async (req, res, next) => {
  const { receiverPhone } = req.session.transferData;

  const receiverInfo = await Account.findByPhone(receiverPhone);

  if (!req.session?.transferData)
    return next(
      createHttpError(404, 'Form mất dữ liệu, vui lòng thực hiện lại thao tác.')
    );

  // sent OTP and validate OTP in a minute
  // random OTP
  const OTP = randomString.generate({ length: 6 });
  // send OTP via e-mail
  MailPlug.sendEmail(
    receiverInfo,
    'Mã xác thực OTP',
    'Mã xác thực OTP (khả dụng trong 1 phút): ' + OTP + '.'
  );

  // create a time schedule in a minute
  const otpExpireTime = new Date(Date.now() + 60 * 1000);

  req.session.otp = OTP;
  req.session.otpExpireTime = otpExpireTime;

  // hien thi thong bao cho user nhap OTP
  return res.json({
    message:
      'Chúng tôi đã gửi mã OTP thông qua email cho bạn, vui lòng kiểm tra hộp thư và điền vào đây',
    otp: OTP,
    otpExp: otpExpireTime,
  });
};

/**
 * POST - http://localhost:8080/me/balance/transfers/transfer/{OTP_CODE}
 *
 * { otp } = req.params;
 * (3) Chuyển tiền giữa các tài khoản (thực hiện chuyển tiền)
 */
module.exports.transfer = [
  // kiem tra OTP
  async (req, res, next) => {
    const { otp: enteredOtp } = req.params;

    const otp = req.session?.otp;

    if (!otp) return next(createHttpError(404, 'OTP không tồn tại'));

    if (req.session.otpExpireTime < new Date())
      return next(createHttpError(422, 'OTP đã hết hạn'));

    if (otp !== enteredOtp)
      return next(createHttpError(400, 'Mã OTP không hợp lệ.'));

    return next();
  },
  // thuc hien chuyen tien
  async (req, res, next) => {
    if (!req.session?.transferData)
      return next(
        createHttpError(
          404,
          'Form mất dữ liệu, vui lòng thực hiện lại thao tác.'
        )
      );

    const { amountMoney, message, receiverPhone, feeBearer } =
      req.session.transferData;

    // if true: cần phải được duyệt bởi admin.
    const isBigTransferMoney = amountMoney > 5 * 10e5;
    const transferFee = (amountMoney * 5) / 100;

    const receiverInfo = await Account.findByPhone(receiverPhone);

    // create Trading History for sender
    await TradingHistory.create({
      type: 4,
      status: isBigTransferMoney ? 2 : 0,
      username: req.user.username,
      tel: req.user.tel,
      receiverUsername: receiverInfo.username,
      receiverPhone: receiverInfo.tel,
      feeBearer,
      time: new Date(),
      message,
      quantity: 1,
      amountMoney,
      tradingFee: transferFee,
    });

    // create Trading History for receiver
    await TradingHistory.create({
      type: 4,
      status: isBigTransferMoney ? 2 : 0,
      username: receiverInfo.username,
      tel: receiverInfo.tel,
      receiverUsername: req.user.username,
      receiverPhone: req.user.tel,
      feeBearer: feeBearer === '0' ? '1' : '0',
      time: new Date(),
      message,
      quantity: 1,
      amountMoney,
      tradingFee: transferFee,
    });

    // update receiver balance
    const receiverBalanceInfo = await Balance.findByUsername(
      receiverInfo.username
    );
    await Balance.updateBalanceById(
      receiverBalanceInfo.id,
      feeBearer === '0' ? amountMoney - transferFee : amountMoney
    );

    // update owner balance
    const ownerBalanceInfo = await Balance.findByUsername(req.user.username);
    if (
      ownerBalanceInfo.balance < (feeBearer === '0')
        ? -(transferFee + amountMoney)
        : -amountMoney
    )
      return next(
        createHttpError('Tài khoản của bạn không đủ để thực hiện giao dịch')
      );

    await Balance.updateBalanceById(
      ownerBalanceInfo.id,
      feeBearer === '0' ? -(transferFee + amountMoney) : -amountMoney
    );

    // Sau khi giao dịch chuyển tiền được xác nhận là thành công thì người nhận tiền sẽ nhận được một email tự động thông báo
    // về giao dịch nhận tiền và biến động số dư.
    MailPlug.sendEmail(
      receiverInfo.email,
      'Thông báo số dư',
      'Bạn vừa nhận được ' + amountMoney + 'VND từ' + req.user.name + '.'
    );

    return res.json({
      message: isBigTransferMoney
        ? 'Thao tác thành công, vui lòng chờ Admin phê duyệt'
        : 'Chuyển tiền thành công.',
    });
  },
];
