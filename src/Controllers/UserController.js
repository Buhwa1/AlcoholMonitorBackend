const User = require("../Models/UserModel");
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
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
      details: "No user found with the provided ID",
    });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found with the provided ID",
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
      const user = await User.create({ email, phoneNumber, password });
      if (user) {
        return res.status(201).json({
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

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid user ID",
      status: "FAIL",
      details: "No user found with the provided ID",
    });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found with the provided ID",
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
      details: "No user found with the provided ID",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: "FAIL",
        details: "No user found with the provided ID",
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

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};
