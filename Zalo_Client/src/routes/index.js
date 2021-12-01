const contactsRouter = require('./contactRouter');
const homeRouter = require('./homeRouter');
const userRouter = require('./userRouter');
const authRouter = require('./Authentication/authRouter');
const messageRouter = require('./messageRouter');
const accountRouter = require('./accountRouter');
const groupRouter = require('./groupRouter');
const adminRouter = require('./adminRouter');
const authController = require('../controllers/AuthController');

function route(app) {
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
  app.use('/admin', adminRouter)
  app.use('/user', userRouter);
  app.use('/message', messageRouter);
  app.use('/group', groupRouter);
  app.use('/', authController.checkRole);
}

module.exports = route;