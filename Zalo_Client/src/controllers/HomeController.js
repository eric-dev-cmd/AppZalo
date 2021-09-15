const { json } = require('express');
const User = require('../models/UserModel');
class HomeController {
     index(req, res) {
        res.render('home', {user: req.user.data.user});
    }
}
module.exports = new HomeController();
