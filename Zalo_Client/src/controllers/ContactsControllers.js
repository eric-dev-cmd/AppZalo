class ContactController {
    index(req, res) {
        res.render('home');
    }
}

module.exports = new ContactController();
