const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
// const validator = require('validator');

const User = new Schema({
  userName: {
    type: String,
    default: 'username',
  },
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
    default: 'user-avatar.png',
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
      select: false,
    },
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
