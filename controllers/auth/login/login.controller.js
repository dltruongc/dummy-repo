const { validationResult } = require('express-validator');
const mysql = require('../../../db');
const bcrypt = require('bcrypt');
const express = require('express');

const loginValidator = require('./middleware/login.validator');

// GET - /login
const show = (req, res) => {
  let error = req.flash('error');
  let email = req.flash('email') || '';
  let password = '';
  res.render('login', { error, email, password });
};

// POST - /login
const loginHandler = (req, res) => {
  const result = validationResult(req);

  if (result.errors.length > 0) {
    const { email } = req.body;
    req.flash('error', result.errors[0].msg);

    req.flash('email', email);
    res.redirect('/login');
  } else {
    const { email, password } = req.body;

    const query = 'select * from account where email = ?';
    const params = [email];

    mysql.query(query, params, (err, result, fields) => {
      if (err) {
        throw err;
      } else if (result.length == 0) {
        req.flash('error', 'Email không tồn tại');
        req.flash('email', email);
        return res.redirect('/login');
      } else {
        const passwordHash = result[0].password;
        const checkPassword = bcrypt.compareSync(password, passwordHash);
        if (!checkPassword) {
          req.flash('error', 'Sai email hoặc mật khẩu');
          req.flash('email', email);
          return res.redirect('/login');
        } else {
          //login success
          let user = result[0];
          user.userRoot = `${req.vars.root}/users/${user.email}`;
          req.session.user = user;

          req.app.use(express.static(user.userRoot));

          return res.redirect('/');
        }
      }
    });
  }
};

module.exports = {
  show,
  login: [...loginValidator, loginHandler],
};
