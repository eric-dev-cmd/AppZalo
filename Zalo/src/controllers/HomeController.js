const notificationService = require('../services/notificationService');
const contactService = require('../services/contactService');
const messageService = require('../services/messageService');
const sortJsonArray = require('sort-json-array');


class HomeController {

  async index(req, res) {
    let getUser = req.user.data.user;
    if (getUser.role == 'user') {
      res.locals.message = req.flash('success');
      let notifications = await notificationService.getNotifications(req.user.data.user._id);
      let contacts = await contactService.getContacts(req.user.data.user._id);
      let listContacts = await messageService.getListItemContacts(req.user.data.user._id);
      let getConversations = listContacts.allConversationMessages;

      return res.render('home', {
        user: getUser,
        notifications: notifications.getNotiContents,
        sumOfNotification: notifications.sumOfNotification,
        contacts: sortJsonArray(contacts.getContacts, 'userName', 'asc'),
        sumOfContact: contacts.sumOfContact,
        allConversationMessages: getConversations,
        allConversationMessagesJson: JSON.stringify(getConversations),
        userJson: JSON.stringify(getUser),
      });
    } else {
      return res.redirect('/admin');
    }
  }
}

module.exports = new HomeController;