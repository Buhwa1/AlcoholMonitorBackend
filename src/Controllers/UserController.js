const User = require("../Models/UserModel");
const mongoose = require("mongoose");

const getUsers = async (req, res) => {
  const user = await User.find({});
  res.status(200).json(user);
};

const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "No user found" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }

  res.status(200).json(user);
};

const createUser = async (req, res) => {
  const { email, phoneNumber, password } = req.body;

  try {
    const user = await User.create({ email, phoneNumber, password });
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "No user found" });
  }

  const user = await User.findByIdAndDelete({ _id: id });

  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }

  res.status(200).json({ message: "user deleted successfully" });
};

const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "No user found" });
  }

  const user = await User.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!user) {
    return res.status(404).json({ error: "No user found" });
  }

  res.status(200).json({ message: "user updated successfully" });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};
