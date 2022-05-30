const express = require('express');

const transferController = require('../../../../controllers/global/balance/transfers/transfer.controller');

const router = express.Router();

/**
 * http://localhost:8080/me/balance/transfers
 *
 * Chuyển tiền giữa các tài khoản
 */
router
  .route('/')
  // GET - Hiển thị trang chuyển tiền
  .get(transferController.showTransfer)
  // POST - User điền form chuyển tiền (chưa confirm chuyển tiền)
  .post(transferController.submitTransferForm);

/**
 * POST - http://localhost:8080/me/balance/transfers/confirm
 */
router
  .route('/confirm')
  // POST - user xác nhận chuyển tiền, gửi OTP và chờ user nhập OTP
  .post(transferController.otpProcess);

/**
 * POST - http://localhost:8080/me/balance/transfers/transfer/{OTP_CODE}
 */
router.route('/transfer/:otp').post(transferController.transfer);

module.exports = router;
