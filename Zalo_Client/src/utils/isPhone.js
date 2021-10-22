const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const http = require('./http');
module.exports = {
  isPhone(req, res, next) {
    const post = Post.findById(req.params.id);
    if (post.author._id === currentUser._id) {
      res.locals.post = post;
      next();
    } else {
      req.session.error = 'Must be author of post to edit!';
      return res.redirect('/');
    }
  },
};
