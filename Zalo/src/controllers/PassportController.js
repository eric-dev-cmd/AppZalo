const passport = require('passport');
const passportLocal = require('passport-local');
const axios = require('axios');
const http = require('./http');
const { transErrors, transSuccess } = require('../../lang/vi');
const chatGroupService = require('../services/chatGroupService');
const bcrypt = require('bcryptjs');

const LocalStrategy = passportLocal.Strategy;

/**
 * Kiem tra tai khoan
 */
function initPassportLocal() {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'phone',
        passwordField: 'password',
        passReqToCallback: true,
      },
      async (req, phone, password, done) => {
        try {
          const user = await axios.get(http + '/users/searchPhone/' + phone);
          if (!user.data.user) {
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            );
          }
          if (
            user.data.user.isActive == 'false' ||
            user.data.user.isActive == false
          ) {
            return done(
              null,
              false,
              req.flash('errors', 'Tài khoản của bạn đã bị khoá.')
            );
          }
          let isPassword = await bcrypt.compare(
            password,
            user.data.user.local.password
          );
          if (isPassword == false) {
            return done(
              null,
              false,
              req.flash('errors', transErrors.login_failed)
            );
          }
          return done(null, user);
        } catch (error) {
          return done(null, false);
        }
      }
    )
  );

  //đc gọi khi đăng nhập thành công để lưu thông tin user vào session
  passport.serializeUser((user, done) => {
    done(null, user.data.user._id);
  });

  //lấy dữ liệu user gắn vào req.user
  passport.deserializeUser(async (id, done) => {
    try {
      let user = await axios.get(http + '/users/' + id);
      let getChatGroups = await chatGroupService.getChatGroups(id);
      let chatGroupIds = [];
      getChatGroups.forEach((group) => {
        chatGroupIds.push(group._id);
      });
      user.data.user.chatGroupIds = chatGroupIds;
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  });

}

module.exports = initPassportLocal;
