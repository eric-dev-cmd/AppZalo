const axios = require('axios');
const http = require('./http');

class ContactController {
    search(req, res, next) {
        axios.get(http + '/users/searchPhone/' + req.query.phone)
        .then(user => {
            res.render('home', {user: user.data.user})
        })
        .catch(next);
    }
}

module.exports = new ContactController();
