const { check } = require('express-validator');

module.exports = [
  check('email')
    .notEmpty()
    .withMessage('Vui lòng nhập email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  check('password')
    .notEmpty()
    .withMessage('Vui lòng nhập mật khẩu')
    .isLength({ min: 6 })
    .withMessage('Mật khẩu ít nhất 6 ký tự'),
];
