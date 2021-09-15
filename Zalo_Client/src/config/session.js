const session = require('express-session');
const MongoStore = require('connect-mongo');

function configSession(app) {
    app.use(session({
        key: 'express.sid',
        secret: 'mySecret',
        store: MongoStore.create({
            mongoUrl: 'mongodb://localhost:27017/appzalo',
            //mongoUrl: 'mongodb+srv://admin:DHKTPM14@cluster0.lxnwb.mongodb.net/appzalo?retryWrites=true&w=majority',
            autoRemove: 'native'
        }),
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 //1 ngay
        }
    }));
}

module.exports = configSession;