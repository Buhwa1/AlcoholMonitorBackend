const express = require("express");
const {
  createAlcoholReading,
  fetchAlcoholReadingFromToken,
} = require("../Controllers/AlcoholController");

const authenticateToken = require("../Middleware/authenticationToken");

const router = express.Router();

router.post("/create", createAlcoholReading);
router.get("/get", authenticateToken, fetchAlcoholReadingFromToken);

module.exports = router;
