const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const userService = require('../services/userService');
const axios = require('axios');
const http = require('./http');

class LoginController {
  showLogin(req, res) {
    res.locals.message = req.flash('errors');
    res.render('login');
  }

  getLogout(req, res) {
    req.logout();
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
  async showRegister(req, res) {
    res.render('register');
  }
  async showVerify(req, res) {
    try {
      const { phoneNumber } = req.body;
      const user = await axios.get(http + '/users/searchPhone/' + phoneNumber);
      // let phone = user.data.user.local.phone;

      // req.flash('error', 'Số điện thoại đã được đăng ký');
      // res.locals.message = req.flash('errors');
      // req.flash('error', 'Số điện thoại đã được đăng ký');
      console.log('That bai');
      res.render('verify', {
        phoneNumber,
      });
    } catch (err) {
      console.log(err);
    }
  }
  showResetPassword(req, res) {
    res.render('resetpassword');
  }
  showUpdatePassword(req, res) {
    const { phoneNumber } = req.body;
    res.render('updatepassword', {
      phoneNumber,
    });
  }
  async createInDatabase(req, res) {
    console.log(req.body.password == req.body.passwordConfirm);
    if (req.body.password == req.body.passwordConfirm) {
      console.log('Success');
      const passHash = await bcrypt.hash(req.body.password, 10);
      console.log(passHash);
      let newUser = await User.create({
        local: {
          phone: req.body.phoneNumber,
          password: passHash,
        },
      });
      console.log(newUser);
      res.redirect('/login-register');
    } else {
      console.log('Failure');
      res.render('updatepassword', {
        error: 'Mật khẩu không trùng khớp 😮. Vui lòng nhập lại',
      });
    }
  }
}
module.exports = new LoginController();
