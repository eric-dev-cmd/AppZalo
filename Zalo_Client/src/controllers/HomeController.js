const notificationService = require('../services/notificationService');
const contactService = require('../services/contactService');
const sortJsonArray = require('sort-json-array');

class HomeController {
  async index(req, res) {
    let notifications = await notificationService.getNotifications(req.user.data.user._id);
    let contacts = await contactService.getContacts(req.user.data.user._id);
    let sumOfContact = 0;
    for (let i = 0; i < contacts.length; i++) {
      sumOfContact += 1;
    }
    res.locals.message = req.flash('success');
    res.render('home', {
      user: req.user.data.user,
      notifications: notifications,
      contacts: sortJsonArray(contacts, 'userName', 'asc'),
      sumOfContact: sumOfContact
    });
  }
}
module.exports = new HomeController();