const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
} = require("../Controllers/UserController");
const router = express.Router();

router.get("/list", getUsers);

router.get("/:id", getUser);

router.post("/create", createUser);

router.delete("/delete/:id", deleteUser);

router.patch("/update/:id", updateUser);

module.exports = router;
