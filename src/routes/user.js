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

router.post("/login", loginUser);
router.post("/create", createUser);
router.get("/list", authenticateToken, getUsers);
router.post("/single", authenticateToken, fetchSingleUserFromToken);

// General routes last
router.delete("/delete/:id", authenticateToken, deleteUser);
router.patch("/update/:id", authenticateToken, updateUser);
router.get("/single/:id", authenticateToken, getUser);

module.exports = router;
