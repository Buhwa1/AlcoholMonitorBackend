const express = require("express");
const {
  createVitals,
  fetchVitalsFromToken,
  getVitalsReadings,
} = require("../Controllers/VitalsController");
const authenticateToken = require("../Middleware/authenticationToken");

const router = express.Router();

router.post("/create", createVitals);
router.get("/get", authenticateToken, fetchVitalsFromToken);
router.get("/list", authenticateToken, getVitalsReadings);

module.exports = router;
