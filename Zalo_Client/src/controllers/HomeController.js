class HomeController {
    index(req, res) {
        res.locals.message = req.flash('success');
        res.render('home', { user: req.user.data.user });
    }
}
module.exports = new HomeController();
