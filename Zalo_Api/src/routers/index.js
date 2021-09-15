const contactsRouter = require('./contactsRouter');
const userRouter = require('./usersRouter');
const messageRouter = require('./messagesRouter');
const notificationRouter = require('./notificationsRouter');
const chatGroupRouter = require('./chatGroupsRouter');
function route(app){
    app.use('/contacts', contactsRouter);
    app.use('/users', userRouter);
    app.use('/messages', messageRouter);
    app.use('/notifications', notificationRouter);
    app.use('/chatGroups', chatGroupRouter);
}

module.exports = route;