const notificationService = require('../services/notificationService');
const contactService = require('../services/contactService');
const messageService = require('../services/messageService');
const sortJsonArray = require('sort-json-array');
const { getListItemContacts } = require('../services/messageService');

class HomeController {
  async index(req, res) {
    res.locals.message = req.flash('success');
    let notifications = await notificationService.getNotifications(req.user.data.user._id);
    let contacts = await contactService.getContacts(req.user.data.user._id);
    let sumOfContact = 0;
    for (let i = 0; i < contacts.length; i++) {
      sumOfContact += 1;
    }
    let getAllItemContact = await messageService.getListItemContacts(req.user.data.user._id);
    let getAllContact = getAllItemContact.getAll;
    let getUserContact = getAllItemContact.users;
    let getGroupContact = getAllItemContact.groups;
    console.log(sortJsonArray(getAllContact, 'updatedAt', 'des'));
    res.render('home', {
      user: req.user.data.user,
      notifications: notifications,
      contacts: sortJsonArray(contacts, 'userName', 'asc'),
      sumOfContact: sumOfContact,
      allContacts: getAllContact,
      userContacts: getUserContact,
      groupContacts: getGroupContact
    });
  }
}
module.exports = new HomeController();