const passport = require('passport');
const passportLocal = require('passport-local');
const axios = require('axios');
const {
    transErrors,
    transSuccess
} = require('../../lang/vi');

const LocalStrategy = passportLocal.Strategy;

const http = "http://localhost:3018";

/**
 * Kiem tra tai khoan
 */
function initPassportLocal() {
    passport.use(new LocalStrategy({
        usernameField: 'phone',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, phone, password, done) => {
        try {
            const user = await axios.get(http + '/users/searchPhone/' + phone);
            console.log(user);
            if (!user.data.user) {
                return done(null, false, {
                    message: 'The email you entered is incorrect'
                });
            }
            if (!(user.data.user.local.password === password)) {
                return done(null, false, req.flash('errors', transErrors.login_failed));
            }
            return done(null, user, req.flash('success', transSuccess.login_success));
        } catch (error) {
            console.log(error);
            return done(null, false);
        }
    }));

    //Luu UserId cho session
    passport.serializeUser((user, done) => {
        done(null, user.data.user._id);
    });
    //Luu UserId cho session
    passport.deserializeUser((id, done) => {
        axios.get(http + '/users/' + id)
            .then(user => {
                return done(null, user);
            })
            .catch(error => {
                return done(error, null);
            })
    });
}

module.exports = initPassportLocal;