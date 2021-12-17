const User = require("../models/userModel");

class UsersController {
  getAPI(req, res, next) {
    User.find({})
      .sort({ createAt: -1 })
      .then((users) => {
        res.status(200).json({
          status: "Success",
          result: users.length,
          data: {
            users,
          },
        });
      })
      .catch(next);
  }

  getAPIByPage(req, res, next) {
    let limit = 4;
    let startFrom = req.query.startFrom;
    let start = Number(startFrom);
    User.find({'role': 'user'}).limit(limit).skip(start)
      .then((users) => {
        res.status(200).json({
          status: "Success",
          result: users.length,
          data: {
            users,
          },
        });
      })
      .catch(next);
  }

  getAPIByPhone(req, res, next) {
    User.findOne({ "local.phone": req.params.phone })
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch(() => {
        res.status(404).json({ message: "Failed" });
      });
  }

  getAPIByUserName(req, res, next) {
    User.findOne({ userName: req.params.username })
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch(next);
  }

  getAPIById(req, res, next) {
    User.findById(req.params.id)
      .then((user) => {
        res.status(200).json({ user });
      })
      .catch(next);
  }

  postAPI(req, res, next) {
    const user = new User(req.body);
    user
      .save()
      .then((user) => {
        res.status(200).json({
          status: "Success",
          result: user.length,
          data: {
            user,
          },
        });
      })
      .catch(next);
  }

  putAPI(req, res, next) {
    const data = req.body;
    User.findByIdAndUpdate(req.params.id, data)
      .then((user) => {
        res.status(200).json({
          status: "Success Updated",
          result: user.length,
          data: {
            user,
          },
        });
      })
      .catch(next);
  }

  deleteAPI(req, res, next) {
    const password = req.body;
    console.log(password);
    User.findByIdAndRemove(req.params.id)
      .then((users) => {
        res.status(200).json({
          status: "Delete Success",
          result: users.length,
          data: {
            users,
          },
        });
      })
      .catch(next);
  }
}

module.exports = new UsersController();
