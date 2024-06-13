const Alcohol = require("../Models/AlcoholModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

//SIGN UP USER
const createAlcoholReading = async (req, res) => {
  const { user_id, alcohol_level } = req.body;

  try {
    // Hash the password
    // const saltRounds = 10; // You can adjust the number of salt rounds as needed
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    const alcohol = await Alcohol.create({
      user_id,
      alcohol_level,
    });

    if (alcohol) {
      return res.status(200).json({
        message: "Reading created successfully",
        status: "OK",
        details: alcohol,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Reading creation failed",
      status: "FAIL",
      details: error.message,
    });
  }
};

// FETCH SINGLE USER FROM TOKEN
const fetchAlcoholReadingFromToken = async (req, res) => {
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
    const alcohol = await Alcohol.findOne({ user_id: decoded.id });
    const timeZone = "Africa/Kampala";

    if (!vital) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found with the provided token",
      });
    }

    const formatDate = (date) => {
      const momentDate = moment.tz(date, timeZone);
      const today = moment().tz(timeZone).startOf("day");
      const yesterday = moment()
        .tz(timeZone)
        .subtract(1, "days")
        .startOf("day");

      if (momentDate.isSame(today, "d")) {
        return "Today, " + momentDate.format("h:mm A");
      } else if (momentDate.isSame(yesterday, "d")) {
        return "Yesterday, " + momentDate.format("h:mm A");
      } else {
        return momentDate.format("MMMM D, YYYY, h:mm A");
      }
    };

    const formattedAlcohol = alcohol.map((alc) => ({
      ...alc.toObject(),
      createdAt: formatDate(alc.createdAt),
      updatedAt: formatDate(alc.updatedAt),
    }));

    res.status(200).json({
      message: "Alcohol reading fetched successfully",
      status: "OK",
      details: formattedAlcohol,
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
  createAlcoholReading,
  fetchAlcoholReadingFromToken,
};
