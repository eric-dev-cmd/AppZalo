const User = require('../models/userModel');

class UsersController {
    getAPI(req, res, next) {
        User.find({})
            .then(users => {
                res.status(200).json({
                    status: 'Success',
                    result: users.length,
                    data: {
                        users,
                    }
                });
            })
            .catch(next);
    }

    getAPIByPhone(req, res, next) {
        User.findOne({"local.phone": req.params.phone})
            .then(user => {
                res.status(200).json({user});
            })
            .catch(next);
    }

    getAPIById(req, res, next) {
        User.findById(req.params.id)
            .then(user => {
                res.status(200).json({user});
            })
            .catch(next);
    }

    postAPI(req, res, next) {
        const user = new User(req.body);
        user.save()
            .then(user => {
                res.status(200).json({
                    status: 'Success',
                    result: user.length,
                    data: {
                        user,
                    }
                });
            })
            .catch(next);

    }

    putAPI(req, res, next) {
        const data = req.body;
        User.findByIdAndUpdate(req.params.id, data)
            .then(user => {
                res.status(200).json({
                    status: 'Success',
                    result: user.length,
                    data: {
                        user,
                    }
                });
            })
            .catch(next)
    }

    deleteAPI(req, res, next) {
        User.findByIdAndRemove(req.params.id)
            .then(users => {
                res.status(200).json({
                    status: 'Success',
                    result: users.length,
                    data: {
                        users,
                    }
                });
            })
            .catch(next);
    }
}

module.exports = new UsersController;