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
    let getAllItemContact = await messageService.getListItemContacts(req.user.data.user._id);
    let getAllContact = getAllItemContact.getAll;
    let getUserContact = getAllItemContact.users;
    let getGroupContact = getAllItemContact.groups;
    let getAllMessages = getAllItemContact.getAllMessages;
    //console.log(getAllMessages);

    res.render('home', {
      user: req.user.data.user,
      notifications: notifications.getNotiContents,
      sumOfNotification : notifications.sumOfNotification,
      contacts: sortJsonArray(contacts.getContacts, 'userName', 'asc'),
      sumOfContact: contacts.sumOfContact,
      allContacts: getAllContact,
      userContacts: getUserContact,
      groupContacts: getGroupContact,
      allMessages: getAllMessages
    });
  }
}
module.exports = new HomeController();