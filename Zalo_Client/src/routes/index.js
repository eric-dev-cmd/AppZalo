const contactsRouter = require('./contactRouter');
const homeRouter = require('./homeRouter');
const userRouter = require('./userRouter');
const authRouter = require('./Authentication/authRouter');
const messageRouter = require('./messageRouter');
const accountRouter = require('./accountRouter');

function route(app) {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
  app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.error = req.flash('error');
    next();
  });
  app.use('/accounts', accountRouter);

  app.use('/login-register', authRouter);
  app.use('/contact', contactsRouter);
  app.use('/home', homeRouter);
  app.use('/updateProfile', userRouter);
  app.use('/message', messageRouter);
}

module.exports = route;
