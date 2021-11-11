const contactsRouter = require('./contactRouter');
const homeRouter = require('./homeRouter');
const userRouter = require('./userRouter');
const authRouter = require('./Authentication/authRouter');
const messageRouter = require('./messageRouter');
const accountRouter = require('./accountRouter');
const groupRouter = require('./groupRouter');

const initSockets = require('../sockets/index');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const session = require('..//config/session');

function route(app, io, user) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
  });

  app.use('/accounts', accountRouter);
  app.use('/login-register', authRouter);
  app.use('/contact', contactsRouter);
  app.use('/home', homeRouter);
  app.use('/updateProfile', userRouter);
  app.use('/message', messageRouter);
  app.use('/group', groupRouter);

  // app.use((req, res, next) => {
  //   let user = req.user.data.user;
  //   io.use(passportSocketIo.authorize({
  //     cookieParser: cookieParser,
  //     key: 'express.sid',
  //     secret: 'mySecret',
  //     store: session.sessionStore,
  //   }));
  //   initSockets(io, user)
  //   next();
  // });
}

module.exports = route;