const User = require("../Models/UserModel");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      return res.status(200).json({
        message: "User not found",
        status: "OK",
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

//SIGN UP USER
const createUser = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  if (
    email &&
    email.length > 0 &&
    phoneNumber &&
    phoneNumber.length > 0 &&
    password &&
    password.length > 0
  ) {
    try {
      // Hash the password
      const saltRounds = 10; // You can adjust the number of salt rounds as needed
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User.create({
        email,
        phoneNumber,
        password: hashedPassword,
      });
      if (user) {
        return res.status(200).json({
          message: "User created successfully",
          status: "OK",
          details: user,
        });
      }
    } catch (error) {
      return res.status(400).json({
        message: "User creation failed",
        status: "FAIL",
        details: error.message,
      });
    }
  } else {
    return res.status(400).json({
      message: "Complete all fields and try again",
      status: "FAIL",
      details: "Missing or empty fields",
    });
  }
};

//LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
      status: "FAIL",
      details: "Missing email or password",
    });
  }

  try {
    const user = await User.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user && !isPasswordValid) {
      return res.status(404).json({
        message: "Wrong username or email!",
        status: "FAIL",
        details: "Wrong username or email!",
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
