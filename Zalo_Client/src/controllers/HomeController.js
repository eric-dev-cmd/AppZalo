const notificationService = require('../services/notificationService');
const contactService = require('../services/contactService');
const messageService = require('../services/messageService');
const sortJsonArray = require('sort-json-array');

class HomeController {
  async index(req, res) {
    res.locals.message = req.flash('success');
    let notifications = await notificationService.getNotifications(req.user.data.user._id);
    let contacts = await contactService.getContacts(req.user.data.user._id);
    let getAllConversationItem = await messageService.getListItemContacts(req.user.data.user._id);
    let getAllConversation = getAllConversationItem.allConversation;
    let getUserConversation = getAllConversationItem.userConversation;
    let getGroupConversation = getAllConversationItem.groupConversation;
    let getAllConversationMessages = getAllConversationItem.allConversationMessages;
    console.log(getAllConversation);

    res.render('home', {
      user: req.user.data.user,
      notifications: notifications.getNotiContents,
      sumOfNotification : notifications.sumOfNotification,
      contacts: sortJsonArray(contacts.getContacts, 'userName', 'asc'),
      sumOfContact: contacts.sumOfContact,
      allConversation: getAllConversation,
      userConversation: getUserConversation,
      groupConversation: getGroupConversation,
      allConversationMessages: getAllConversationMessages
    });
  }
}
module.exports = new HomeController();