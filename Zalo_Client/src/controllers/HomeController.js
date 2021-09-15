const { json } = require('express');
const User = require('../models/UserModel');
class HomeController {
     index(req, res) {
        res.render('home');
    }
}
module.exports = new HomeController();
