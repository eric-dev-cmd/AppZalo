const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
const route = require('./src/routes/index');
const passport = require('passport');
const connectFlash = require('connect-flash');
const dotenv = require('dotenv')
const port = process.env.PORT || 3017
const db = require('./src/config/db')
const configSession = require('./src/config/session');

dotenv.config({
    path: './config.env'
})


db.connect();

configSession(app);

/**
 * TODO: HTTP logger
 */
app.use(morgan('dev'));
/**
 * TODO: Template Engine
 */
app.use(express.static(path.join(__dirname, 'src/public')));
app.engine('hbs', exphbs({
    extname: '.hbs',
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/resources/views'));
app.use(
    express.urlencoded({
        extended: true,
    }),
);
app.use(express.json());

/**
 * Enable flash messages
 */
app.use(connectFlash());


/**
 * Config passport
 */
app.use(passport.initialize());
app.use(passport.session());
/**
 * TODO: Route init
 */
route(app);

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}...`)
});