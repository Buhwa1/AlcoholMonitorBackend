const User = require("../Models/UserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");

//SIGN UP USER

const createUser = async (req, res) => {
  const { firstname, lastname, email, phoneNumber, password } = req.body;
  const timeZone = "Africa/Kampala";
  const missingFields = [];

  if (!firstname || firstname.length === 0) missingFields.push("firstname");
  if (!lastname || lastname.length === 0) missingFields.push("lastname");
  if (!email || email.length === 0) missingFields.push("email");
  if (!phoneNumber || phoneNumber.length === 0)
    missingFields.push("phoneNumber");
  if (!password || password.length === 0) missingFields.push("password");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Complete all fields and try again",
      status: "FAIL",
      details: `Missing or empty fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    // Hash the password
    const saltRounds = 10; // You can adjust the number of salt rounds as needed
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      firstname,
      lastname,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    if (user) {
      // Adjust timestamps to the specified time zone
      const createdAt = moment.tz(user.createdAt, timeZone).format();
      const updatedAt = moment.tz(user.updatedAt, timeZone).format();

      return res.status(200).json({
        message: "User created successfully",
        status: "OK",
        details: {
          ...user.toObject(),
          createdAt,
          updatedAt,
        },
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "User creation failed",
      status: "FAIL",
      details: error.message,
    });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const missingFields = [];
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: "Email and password are required",
      status: "FAIL",
      details: `Missing fields: ${missingFields.join(", ")}`,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Wrong username or email!",
        status: "FAIL",
        details: "Wrong username or email!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({
        message: "Wrong password!",
        status: "FAIL",
        details: "Wrong password!",
      });
    }

    const token = jwt.sign({ id: user._id }, "monitor@userapp", {
      expiresIn: "7d",
    });

    user.token = token;
    await user.save();

    res.status(200).json({
      message: "Login successful",
      status: "OK",
      details: {
        userId: user._id,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Login failed",
      status: "FAIL",
      details: error.message,
    });
  }
};

// GET USERS
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found",
        status: "OK",
        details: [],
      });
    }
    res.status(200).json({
      message: "Users fetched successfully",
      status: "OK",
      details: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      status: "FAIL",
      details: error.message,
    });
  }
};

// GET USER
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
      status: "FAIL",
      details: "No user found",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found",
      });
    }
    res.status(200).json({
      message: "User fetched successfully",
      status: "OK",
      details: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      status: "FAIL",
      details: error.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
      status: "FAIL",
      details: "No user found",
    });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      status: "OK",
      details: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      status: "FAIL",
      details: error.message,
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
      status: "FAIL",
      details: "No user found",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
      status: "OK",
      details: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      status: "FAIL",
      details: error.message,
    });
  }
};

// FETCH SINGLE USER FROM TOKEN
const fetchSingleUserFromToken = async (req, res) => {
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
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found with the provided token",
      });
    }

    res.status(200).json({
      message: "User fetched successfully",
      status: "OK",
      details: user,
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
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  loginUser,
  fetchSingleUserFromToken,
};
