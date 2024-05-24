const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  fetchSingleUserFromToken,
} = require("../Controllers/UserController");

const authenticateToken = require("../Middleware/authenticationToken");

const router = express.Router();

router.get("/list", authenticateToken, getUsers);

router.get("/:id", authenticateToken, getUser);

router.post("/create", createUser);

router.delete("/delete/:id", authenticateToken, deleteUser);

router.patch("/update/:id", authenticateToken, updateUser);

router.post("/login", loginUser);

router.get("/single", authenticateToken, fetchSingleUserFromToken);

module.exports = router;
