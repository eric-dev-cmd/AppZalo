const express = require("express");
const router = express.Router();
const userController = require("../controllers/UsersController");

router.get("/", userController.getAPI);
router.get("/searchPhone/:phone", userController.getAPIByPhone);
router.get("/:id", userController.getAPIById);
router.post("/", userController.postAPI);
router.put("/:id", userController.putAPI);
router.delete("/:id", userController.deleteAPI);

module.exports = router;
