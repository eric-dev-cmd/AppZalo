class LoginController {
    showLogin(req, res) {
        res.render('login');
    }

    getLogout(req, res) {
        req.logout();
        //req.flash()
        return res.redirect('/login-register');

    }

    checkLoggedIn(req, res, next) {
        if(!req.isAuthenticated()){
            return res.redirect('/login-register');
        }
        next();
    }

    checkLoggedOut(req, res, next) {
        if(req.isAuthenticated()){
            return res.redirect('/home');
        }
        next();
    }
}
module.exports = new LoginController();
