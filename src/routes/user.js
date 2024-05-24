const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  getUserFromToken,
} = require("../Controllers/UserController");
const router = express.Router();

router.get("/list", getUsers);

router.get("/:id", getUser);

router.post("/create", createUser);

router.delete("/delete/:id", deleteUser);

router.patch("/update/:id", updateUser);

router.post("/login", loginUser);

router.get("/single", getUserFromToken);

module.exports = router;
