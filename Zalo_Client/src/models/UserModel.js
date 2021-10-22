const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
// const validator = require('validator');

const User = new Schema({
  userName: String,
  gender: {
    type: String,
    default: 'male',
  },
  birthday: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  avatar: {
    type: String,
    default: 'avatar-default.jpg',
  },
  role: {
    type: String,
    default: 'user',
  },
  local: {
    phone: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    // passwordConfirm: {
    //   type: String,
    //   required: [true, 'Please confirm your password'],
    //   validate: {
    //     // This only works on CREATE and SAVE!!!
    //     validator: function (el) {
    //       return el === this.password;
    //     },
    //     message: 'Passwords are not the same!',
    //   },
    // },
  },
  createAt: {
    type: Number,
    default: Date.now,
  },
  updateAt: {
    type: Number,
    default: null,
  },
  deleteAt: {
    type: Number,
    default: null,
  },
});
User.pre('save', async function (next) {
  // Nếu pass thay đổi -> thì thằng này mới chạy
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 10);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
User.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('user', User);
