const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
// const userService = require('../services/userService');
const http = require('./http');
const axios = require('axios');

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
  async showResetNewPassword(req, res) {
    let phone = req.query.phone;
    let phoneReset = phone.slice(phone.length - 9);
    res.render('./updatenewpassword', {
      phone: '0' + phoneReset,
    });
  }
  async updateResetNewPassword(req, res) {
    try {
      // Password new
      // Phone need update password
      let phoneReset = req.body.phoneReset;
      let userPhone = await axios.get(
        http + '/users/searchPhone/' + phoneReset
      );
      const { user } = userPhone.data;
      let userPhoneReset = await User.findById(user._id).select('+password');
      const passResetHash = await bcrypt.hash(req.body.passwordReset, 10);
      userPhoneReset.local.password = passResetHash;
      await userPhoneReset.save();
      req.flash('success', 'Đổi mật khẩu thành công');
      res.redirect('/login-register');
    } catch (err) {
      console.log(err);
      console.log('ERROR');
    }
  }

  async showHomeAdmin(req, res, next) {
    let phone = req.body.phone;
    let password = req.body.password;
    let user = await axios.get(http + '/users/searchPhone/' + phone);
    // userList.data.data.users;
    let isPassword = await bcrypt.compare(
      password,
      user.data.user.local.password
    );
    if (user.data.user.role == 'admin' && isPassword) {
      res.redirect('/home/admin');
    } else {
      next();
    }
  }
  async showPageAdmin(req, res, next) {
    let userList = await axios.get(http + '/users');
    let users = userList.data.data.users;
    let listRoleByUser = [];
    users.forEach((user) => {
      if (user.role == 'user') {
        listRoleByUser.push(user);
      }
    });
    res.render('Admin/admin', { listRoleByUser: listRoleByUser });
  }
}

module.exports = new LoginController();
