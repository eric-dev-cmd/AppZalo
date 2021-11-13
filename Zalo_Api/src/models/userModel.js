const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  userName: {
    type: String,
    default: "username",
  },
  gender: {
    type: String,
    default: "male",
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
    //default: "https://i.stack.imgur.com/dr5qp.jpg",
     default: "user-avatar.png",
  },
  role: {
    type: String,
    default: "user",
  },

  local: {
    phone: {
      type: String,
      default: null,
    },
    password: String,
  },
  // Tai khoan co oln hay k
  isOnline: {
    type: String,
    default: false,
  },
  // Tai khoan co bi khoa hay k
  isActive: {
    type: String,
    default: false,
  },
  // Anh bia ben trang ca nhan
  background: {
    type: String,
    default: "background-default.jpg",
  },
  description: {
    type: String,
    default: "This is my description",
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: {
    type: Number,
    default: null,
  },
  deletedAt: {
    type: Number,
    default: null,
  },
});

module.exports = mongoose.model("user", User);
