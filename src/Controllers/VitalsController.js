const Vital = require("../Models/VitalsModel");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

// Create Vitals
const createVitals = async (req, res) => {
  const { user_id, oxygen_level, bpm_reading } = req.body;

  try {
    const vital = await Vital.create({ user_id, oxygen_level, bpm_reading });

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

// Fetch Vitals from Token
const fetchVitalsFromToken = async (req, res) => {
  try {
    const { id } = req.user;
    const vital = await Vital.findOne({ user_id: id });
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

    const formattedVitals = {
      ...vital.toObject(),
      createdAt: formatDate(vital.createdAt),
      updatedAt: formatDate(vital.updatedAt),
    };

    res.status(200).json({
      message: "Vitals fetched successfully",
      status: "OK",
      details: formattedVitals,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      status: "FAIL",
      details: error.message,
    });
  }
};

const getVitalsReadings = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  // if (!token) {
  //   return res.status(401).json({
  //     message: "No token provided",
  //     status: "FAIL",
  //     details: "Authorization token is missing",
  //   });
  // }

  const timeZone = "Africa/Kampala";

  try {
    const decoded = jwt.verify(token, "monitor@userapp");
    const vitals = await Vital.find({ user_id: decoded.id });

    if (vitals.length === 0) {
      return res.status(200).json({
        message: "No readings found",
        status: "OK",
        details: [],
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

    const formattedVitals = vitals.map((vital) => ({
      ...vital.toObject(),
      createdAt: formatDate(vital.createdAt),
      updatedAt: formatDate(vital.updatedAt),
    }));

    res.status(200).json({
      message: "Readings fetched successfully",
      status: "OK",
      details: formattedVitals,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      status: "FAIL",
      details: error.message,
    });
  }
};

module.exports = { createVitals, fetchVitalsFromToken, getVitalsReadings };
