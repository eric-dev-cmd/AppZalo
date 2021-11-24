const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const http = require('./http');

class LoginController {
  showLogin(req, res) {
    res.locals.message = req.flash('errors');
    res.render('login');
  }

  getLogout(req, res) {
    req.logout();
    req.flash('success', 'Đăng xuất thành công');
    return res.redirect('/login-register');
  }

  checkLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect('/login-register');
    }
    next();
  }

  checkLoggedOut(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/home');
    }
    next();
  }
  showRegister(req, res) {
    res.render('register');
  }
  showResetPassword(req, res) {
    res.render('resetpassword');
  }
  showUpdatePassword(req, res) {
    let phone = req.query.phone;
    let phoneRegister = phone.slice(phone.length - 9);
    res.render('updatepassword', {
      phone: '0' + phoneRegister,
    });
  }
  async createInDatabase(req, res) {
    if (req.body.password == req.body.passwordConfirm) {
      const passHash = await bcrypt.hash(req.body.password, 10);
      let newUser = await User.create({
        userName: req.body.userName,
        local: {
          phone: req.body.phone,
          password: passHash,
        },
      });
      req.flash('success', 'Tài khoản đăng ký thành công ');
      res.redirect('/login-register');
    }
  }
}

module.exports = new LoginController();
