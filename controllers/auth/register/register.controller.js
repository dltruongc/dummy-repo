const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const mysql = require('../../../db');
const fs = require('fs');

const registerValidator = require('./middleware/register.validator');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nguyenvandiemhcmue@gmail.com',
    pass: 'Nvd09012001',
  },
});

const show = (req, res) => {
  let error = req.flash('error');
  let name = req.flash('name') || '';
  let email = req.flash('email') || '';
  let tel = req.flash('tel') || '';
  let birth = req.flash('birth') || '';
  let address = req.flash('address') || '';
  let fontid = req.flash('fontid') || '';
  let backid = req.flash('backid') || '';
  res.render('register', { error, name, email, tel, birth, address });
};

const registerHandler = (req, res) => {
  const result = validationResult(req);

  if (result.errors.length > 0) {
    const { name, email, tel, birth, address } = req.body;
    req.flash('error', result.errors[0].msg);
    req.flash('name', name);
    req.flash('email', email);
    req.flash('tel', tel);
    req.flash('birth', birth);
    req.flash('address', address);
    res.redirect('/register');
  } else {
    var mailOptions = {
      from: '"Ví điện tử TDTUPay" nguyenvandiemhcmue@gmail.com',
      to: 'nguyenvandiemhcmus@gmail.com',
      subject: 'Xác thực tạo tài khoản ví điện tử DemoPay thành công',
      text: `Bạn đã tạo tài khoản ví điện tử DemoPay thành công\n Thông tin tìa khoản của bạn:\n Username:${username}}\n Password: ${password}\n Xin vui lòng thay đổi mật khẩu để đảm bảo an toàn cho tài khoản của mình.\n DemoPay chân thành cảm ơn bạn đã đồng hành cùng chúng tôi\n Chúc bạn có những trải nghiệm tốt nhất.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    const { name, email, tel, birth, address, fontid, backid } = req.body;

    const passwordHash = bcrypt.hashSync(password, 10);

    const query =
      'insert into account (username, password, name, email, tel, birth, address, fontid, backid) value(?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const params = [
      username,
      passwordHash,
      name,
      email,
      tel,
      birth,
      address,
      fontid,
      backid,
    ];

    mysql.query(query, params, (err, result, fields) => {
      if (err) {
        const messageError =
          "ER_DUP_ENTRY: Duplicate entry '" + email + "' for key 'PRIMARY'";
        if (err.message == messageError) {
          req.flash('error', 'Email đã được sử dụng!');
          req.flash('name', name);
          req.flash('email', email);
          req.flash('tel', tel);
          req.flash('birth', birth);
          req.flash('address', address);
        } else {
          throw err;
        }

        return res.redirect('/register');
      } else if (result.affectedRows == 1) {
        const { root } = req.vars;
        const userDir = `${root}/users/${email}`;

        fs.mkdir(userDir, () => {
          return res.redirect('/login');
        });
      } else {
        req.flash('error', result.message);
        req.flash('name', name);
        req.flash('email', email);
        req.flash('tel', tel);
        req.flash('birth', birth);
        req.flash('address', address);
        return res.redirect('/register');
      }
    });
  }
};

module.exports = {
  show,
  register: [...registerValidator, registerHandler],
};
