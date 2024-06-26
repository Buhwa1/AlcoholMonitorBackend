const express = require("express");
const {
  createVitals,
  fetchVitalsFromToken,
} = require("../Controllers/VitalsController");
const authenticateToken = require("../Middleware/authenticationToken");

const router = express.Router();

router.post("/create", createVitals);
router.get("/get", authenticateToken, fetchVitalsFromToken);

module.exports = router;
