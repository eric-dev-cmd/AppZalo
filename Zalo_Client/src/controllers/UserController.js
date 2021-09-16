const http = require('./http');
const axios = require('axios');
const {
    transErrors,
    transSuccess
} = require('../../lang/vi');

class UserController {
    updateProfile(req, res, next) {
        if (req.files) {
            var file = req.files.avatar; //name view
            var fileName = file.name;     
            if (file.mimetype.split('/')[0] === 'image' && file.size < 1048576) {                
                file.mv('./src/public/images/' + fileName, function (error) {
                    if (error) {
                        res.send(error);
                    } else {
                        let user = req.body;
                        user.avatar = fileName; //gan user.avatar
                        axios.put(http + '/users/' + req.body.id, user)
                            .then(req.flash('success', transSuccess.update_profile_success), res.redirect('/home'))
                            .catch(next);
                    }
                })
            } else {
                axios.put(http + '/users/' + req.body.id, req.body)
                    .then(req.flash('success', transSuccess.update_profile_success), res.redirect('/home'))
                    .catch(next);
            }
        }
        else {
            axios.put(http + '/users/' + req.body.id, req.body)
                .then(req.flash('success', transSuccess.update_profile_success), res.redirect('/home'))
                .catch(next);
        }
    }
}
module.exports = new UserController();
