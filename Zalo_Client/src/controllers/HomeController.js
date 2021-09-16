const { json } = require('express');
const User = require('../models/UserModel');
const http = require('./http');
const axios = require('axios');

class HomeController {
     index(req, res) {
        res.render('home', {user: req.user.data.user});
    }

    updateProfile(req,res, next) {
        const user = req.body;
        console.log(user);

        axios.put(http + '/users/' + req.body.id, user)
            .then(res.redirect('/home'))
            .catch(next);
    }
}
module.exports = new HomeController();
