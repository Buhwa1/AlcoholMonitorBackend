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
router.get("/single", authenticateToken, fetchSingleUserFromToken);
router.post("/create", createUser);
router.get("/list", authenticateToken, getUsers);

// General routes last
router.get("/:id", authenticateToken, getUser);
router.delete("/delete/:id", authenticateToken, deleteUser);
router.patch("/update/:id", authenticateToken, updateUser);

module.exports = router;
