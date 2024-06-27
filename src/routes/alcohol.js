const express = require("express");
const {
  createAlcoholReading,
  fetchAlcoholReadingFromToken,
  getReadings,
} = require("../Controllers/AlcoholController");

const authenticateToken = require("../Middleware/authenticationToken");

const router = express.Router();

router.post("/create", createAlcoholReading);
router.get("/get", authenticateToken, fetchAlcoholReadingFromToken);
router.get("/list", authenticateToken, getReadings);

module.exports = router;
