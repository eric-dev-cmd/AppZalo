class HomeController {
    index(req, res) {
        res.locals.message = req.flash('success');
        console.log(res.locals.message)
        res.render('home', { user: req.user.data.user });
    }
}
module.exports = new HomeController();
