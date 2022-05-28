const express = require('express');

const accountManagementController = require('../../../../controllers/admin/accounts/accounts.controller');

const router = express.Router();

// http://localhost:8080/admin/accounts/activation/unlock
// Unlock tài khoản đang bị khoá.
router
  .route('/activation/unlock')
  .post(accountManagementController.unlockAccountByUsername);

// http://localhost:8080/admin/accounts/activation/unlock
// Unlock tài khoản đang bị khoá.
router
  .route('/activation/active')
  .post(accountManagementController.activateAccountByUsername);

// http://localhost:8080/admin/accounts/activation/waiting-activation
// Danh sách tài khoản đang chờ kích hoạt: tài khoản mới tạo hoặc mới được bổ sung CMND sẽ hiển thị trước.
router
  .route('/activation/waiting-activation')
  .get(accountManagementController.showWaitingForActivationList);

// http://localhost:8080/admin/accounts/activation/locked
// Danh sách tài khoản đang bị khóa vô thời hạn (do nhập đăng nhập sai nhiều lần): sắp xếp giảm dần theo thời gian bị khóa.
router
  .route('/activation/locked')
  .get(accountManagementController.showLockedList);

// http://localhost:8080/admin/accounts/activation/disabled
// Danh sách tài khoản đã bị vô hiệu hóa (do không đồng ý kích hoạt): sắp xếp giảm dần theo ngày tạo.
router
  .route('/activation/disabled')
  .get(accountManagementController.showDisabledList);

// http://localhost:8080/admin/accounts/activation/activated
// Danh sách tài khoản đã kích hoạt: sắp xếp giảm dần theo ngày tạo.
router
  .route('/activation/activated')
  .get(accountManagementController.showActivatedList);

module.exports = router;
