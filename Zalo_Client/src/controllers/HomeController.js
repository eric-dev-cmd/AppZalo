const notificationService = require('../services/notificationService');
const contactService = require('../services/contactService');
const messageService = require('../services/messageService');
const homeService = require('../services/homeService');
const sortJsonArray = require('sort-json-array');


class HomeController {

  async index(req, res) {
    let getUser = req.user.data.user;
    if (getUser.role == 'user') {
      res.locals.message = req.flash('success');
      let notifications = await notificationService.getNotifications(req.user.data.user._id);
      let contacts = await contactService.getContacts(req.user.data.user._id);
      let getAllConversationItem = await messageService.getListItemContacts(req.user.data.user._id);
      let getAllConversationMessages = getAllConversationItem.allConversationMessages;
      let IceList = await homeService.getListICE();

      return res.render('home', {
        user: getUser,
        notifications: notifications.getNotiContents,
        sumOfNotification: notifications.sumOfNotification,
        contacts: sortJsonArray(contacts.getContacts, 'userName', 'asc'),
        sumOfContact: contacts.sumOfContact,
        allConversationMessages: getAllConversationMessages,
        allConversationMessagesJson: JSON.stringify(getAllConversationMessages),
        userJson: JSON.stringify(req.user.data.user),
        IceList: JSON.stringify(IceList),
      });
    } else {
      return res.redirect('/admin');
    }
  }
}

module.exports = new HomeController;