const session = require('express-session');
const MongoStore = require('connect-mongo');

let sessionStore = MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/appzalo',
    autoRemove: 'native'
})


function configSession(app) {
    app.use(session({
        key: 'express.sid',
        secret: 'mySecret',
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24, //1 ngay
            httpOnly: false,
        }
    }));
}


module.exports = {
    configSession: configSession,
    sessionStore: sessionStore
}