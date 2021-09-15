const contactsRouter = require('./contactRouter');
const homeRouter = require('./homeRouter');
const authRouter = require('./Authentication/authRouter');


function route(app) {
    app.use('/login-register', authRouter);
    app.use('/contact', contactsRouter);
    app.use('/home', homeRouter);
}

module.exports = route;
