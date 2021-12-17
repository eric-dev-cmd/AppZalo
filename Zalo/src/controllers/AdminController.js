const http = require('./http');
const axios = require('axios');
const adminService = require('../services/adminService');
const bcrypt = require('bcryptjs');

class AdminController {
  async updateIsActiveAdmin(req, res) {
    let userId = req.body.userId;
    let isActive = await adminService.updateIsActiveAdmin(userId);
    return res.send({
      success: !!isActive,
    });
  }

  async updateIsBlockAdmin(req, res) {
    let userId = req.body.userId;
    let isActive = await adminService.updateIsBlockAdmin(userId);
    return res.send({
      success: !!isActive,
    });
  }

  async showPageAdmin(req, res, next) {
    let getUser = req.user.data.user;
    if (getUser.role == 'admin') {
      let userSize = await axios.get(http + `/users`);
      let userList = await axios.get(http + `/users/page?startFrom=0`);
      let users = userList.data.data.users;
      let listRoleByUser = [];
      users.forEach((user) => {
        if (user.role == 'user') {
          listRoleByUser.push(user);
        }
      });
      return res.render('Admin/admin', {
        listRoleByUser: listRoleByUser,
        listRoleByUserJson: JSON.stringify(listRoleByUser),
        userSize: JSON.stringify(userSize.data.result),
      });
    }
    if (getUser.role == 'user') {
      return res.redirect('/home');
    }
  }

  async addAccount(req, res) {
    const { adminUsername, adminPhone, adminBirthDay, adminPassword, gender } =
      req.body;
    let fullBirthDay = adminBirthDay.split('-');
    let day = fullBirthDay[2];
    let month = fullBirthDay[1];
    let year = fullBirthDay[0];
    let birthDay = day + '/' + month + '/' + year;
    const passResetHash = await bcrypt.hash(adminPassword, 10);
    let localInfo = {
      phone: adminPhone,
      password: passResetHash,
    };
    let newUser = {
      userName: adminUsername,
      local: localInfo,
      birthday: birthDay,
      gender: gender,
    };
    let user = await axios.post(http + '/users', newUser);
    req.flash('success', 'Tạo tài khoản thành công');
    res.redirect('/admin');
  }
}
module.exports = new AdminController();
