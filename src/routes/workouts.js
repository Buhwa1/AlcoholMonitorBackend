const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require("../Controllers/UserController");
const router = express.Router();

router.get("/user/list", getUsers);

router.get("/user/:id", getUser);

router.post("/user/create", createUser);

router.delete("/user/delete/:id", deleteUser);

router.patch("/user/update/:id", updateUser);

module.exports = router;
