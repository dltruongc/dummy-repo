const { check } = require('express-validator');

const registerValidator = [
  check('name').notEmpty().withMessage('Vui lòng nhập tên'),
  check('email')
    .notEmpty()
    .withMessage('Vui lòng nhập email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  // check("password")
  // .notEmpty()
  // .withMessage("Vui lòng nhập mật khẩu")
  // .isLength({ min: 6 })
  // .withMessage("Mật khẩu ít nhất 6 ký tự"),

  // check("confirm-password")
  // .notEmpty()
  // .withMessage("Vui lòng xác nhận mật khẩu")
  // .custom((value, { req }) => {
  //     if (value != req.body.password) {
  //         throw new Error("Mật khẩu không trùng khớp");
  //     } else {
  //         return true;
  //     }
  // }),
];

module.exports = registerValidator;
