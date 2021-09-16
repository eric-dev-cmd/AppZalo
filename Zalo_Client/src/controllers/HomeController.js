const User = require('../models/UserModel');
const http = require('./http');
const axios = require('axios');
const upload = require('express-fileupload');


class HomeController {
    index(req, res) {
        res.render('home', { user: req.user.data.user });
    }

    updateProfile(req, res, next) {
        if (req.files) {
            var file = req.files.avatar;
            var fileName = file.name;     
            if (file.mimetype.split('/')[0] === 'image' && file.size < 1048576) {                
                file.mv('./src/public/images/' + fileName, function (error) {
                    if (error) {
                        res.send(error);
                    } else {
                        let user = req.body;
                        user.avatar = fileName;
                        axios.put(http + '/users/' + req.body.id, user)
                            .then(res.redirect('/home'))
                            .catch(next);
                    }
                })
            } else {
                axios.put(http + '/users/' + req.body.id, req.body)
                    .then(res.redirect('/home'))
                    .catch(next);
            }
        }
        else {
            axios.put(http + '/users/' + req.body.id, req.body)
                .then(res.redirect('/home'))
                .catch(next);
        }
    }
}
module.exports = new HomeController();
