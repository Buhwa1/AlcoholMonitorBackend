const Vital = require("../Models/VitalsModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//SIGN UP USER
const createVitals = async (req, res) => {
  const { user_id, oxygen_level, bpm_reading } = req.body;

  try {
    // Hash the password
    // const saltRounds = 10; // You can adjust the number of salt rounds as needed
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    const vital = await Vital.create({
      user_id,
      oxygen_level,
      bpm_reading,
    });

    if (vital) {
      return res.status(200).json({
        message: "Readings created successfully",
        status: "OK",
        details: vital,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Vital creation failed",
      status: "FAIL",
      details: error.message,
    });
  }
};

// FETCH SINGLE USER FROM TOKEN
const fetchVitalsFromToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      status: "FAIL",
      details: "Authorization token is missing",
    });
  }

  try {
    const decoded = jwt.verify(token, "monitor@userapp");
    const vital = await Vital.findOne({ user_id: decoded.id });

    if (!vital) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found with the provided token",
      });
    }

    res.status(200).json({
      message: "Vitals fetched successfully",
      status: "OK",
      details: vital,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      status: "FAIL",
      details: error.message,
    });
  }
};

module.exports = {
  createVitals,
  fetchVitalsFromToken,
};
