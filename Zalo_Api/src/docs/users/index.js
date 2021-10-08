const deleteUser = require("./delete-user");
const getUser = require("./get-user");
const getUsers = require("./get-users");
const createUser = require("./create-user");
const updateUser = require("./update-user");

module.exports = {
  paths: {
    "/users": {
      ...getUsers,
      ...createUser,
    },
    "/users/{id}": {
      ...getUser,
      ...deleteUser,
      ...updateUser,
    },
  },
};
