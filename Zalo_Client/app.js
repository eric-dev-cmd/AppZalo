const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const route = require('./src/routes/index');
const passport = require('passport');
const connectFlash = require('connect-flash');
const dotenv = require('dotenv')
const port = 4002;
const db = require('./src/config/db');
const session = require('./src/config/session');
const upload = require('express-fileupload');
const http = require('http');
const socketIo = require('socket.io');
const initSockets = require('./src/sockets/index');
const cookieParser = require('cookie-parser');
const passportSocketIo = require('passport.socketio');
const events = require('events');
const {
  fail
} = require('assert');
const AWS = require('aws-sdk');

//init app
const app = express();

events.EventEmitter.defaultMaxListeners = 200;

//init server with socket.io and http
const server = http.createServer(app);
const io = socketIo(server);

dotenv.config({
  path: './config.env'
});
db.connect();

session.configSession(app);

//init S3 AWS
const S3 = new AWS.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACESSKEY
})


/**
 * TODO: HTTP logger
 */
app.use(morgan('dev'));
/**
 * TODO: Template Engine
 */
app.use(express.static(path.join(__dirname, 'src/public')));
app.engine('hbs',
  exphbs({
    extname: '.hbs',
    helpers: {
      id_notification: (a, b) => a + b,
      ifImage: function (image, options) {
        if (image === 'image') {
          return options.fn(this);
        }
      },
      ifFile: function (file, options) {
        if (file === 'file') {
          return options.fn(this);
        }
      },
      ifText: function (text, options) {
        if (text === 'text') {
          return options.fn(this);
        }
      },
    }
  })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'src/resources/views'));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

/**
 * Enable flash messages
 */
app.use(connectFlash());

// user cookie parser
app.use(cookieParser());

/**
 * Config passport
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * TODO: Route init
 */

app.use(upload());

//init route
route(app, io);

initSockets(io);

server.listen(port, () => {
  console.log(`App running on http://localhost:${port}...`);
});