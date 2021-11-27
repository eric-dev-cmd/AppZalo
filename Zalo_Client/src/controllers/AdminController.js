const http = require('./http');
const axios = require('axios');
const adminService = require('../services/adminService');

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
}
module.exports = new AdminController();
