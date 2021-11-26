const http = require('./http');
const axios = require('axios');
const { transErrors, transSuccess } = require('../../lang/vi');
const FilesUtil = require('../utils/uploadAndDeleteFiles');
const userService = require('../services/userService');
const { v4: uuidv4 } = require('uuid');

class UserController {
  async updateProfile(req, res, next) {
    if (req.files) {
      var file = req.files.avatar; //file {avatar: {object}}
      var fileName = file.name;
      if (file.mimetype.split('/')[0] === 'image' && file.size < 10485760) {
        let uuid = uuidv4();
        let newFiles = await FilesUtil.uploadFiles(file, uuid);
        let user = req.body;
        user.avatar = `${uuid}.${fileName}`; //gan user.avatar
        axios
          .put(http + '/users/' + req.body.id, user)
          .then(
            req.flash('success', transSuccess.update_profile_success),
            res.redirect('/home')
          )
          .catch(next);
      } else {
        axios
          .put(http + '/users/' + req.body.id, req.body)
          .then(
            req.flash('success', transSuccess.update_profile_success),
            res.redirect('/home')
          )
          .catch(next);
      }
    } else {
      axios
        .put(http + '/users/' + req.body.id, req.body)
        .then(
          req.flash('success', transSuccess.update_profile_success),
          res.redirect('/home')
        )
        .catch(next);
    }
  }

  async updateOnline(req, res) {
    let user = req.body.user;
    let request = await userService.updateOnline(user);
    return res.send({
      success: !!request,
    });
  }

  async updateBusy(req, res) {
    let user = req.body.user;
    let request = await userService.updateBusy(user);
    return res.send({
      success: !!request,
    });
  }

}
module.exports = new UserController();
