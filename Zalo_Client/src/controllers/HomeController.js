const notificationService = require('../services/notificationService');
class HomeController {
  async index(req, res) {
    let notifications = await notificationService.getNotifications(req.user.data.user._id);
    res.locals.message = req.flash('success');
    res.render('home', {
      user: req.user.data.user,
      notifications: notifications
    });
  }
}
module.exports = new HomeController();