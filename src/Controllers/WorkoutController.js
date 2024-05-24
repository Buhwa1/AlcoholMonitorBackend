const Workout = require("../Models/WorkoutModel");
const mongoose = require("mongoose");

const getWorkOuts = async (req, res) => {
  const workout = await Workout.find({});
  res.status(200).json(workout);
};

const getWorkOut = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "No workout found" });
  }

  const workout = await Workout.findById(id);

  if (!workout) {
    return res.status(404).json({ error: "No workout found" });
  }

  res.status(200).json(workout);
};

const createWorkOut = async (req, res) => {
  const { title, reps, load } = req.body;

  try {
    const workout = await Workout.create({ title, reps, load });
    res.status(200).json({ message: "Workout created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "No workout found" });
  }

  const workout = await Workout.findByIdAndDelete({ _id: id });

  if (!workout) {
    return res.status(404).json({ error: "No workout found" });
  }

  res.status(200).json({ message: "Workout deleted successfully" });
};

const updateWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ msg: "No workout found" });
  }

  const workout = await Workout.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!workout) {
    return res.status(404).json({ error: "No workout found" });
  }

  res.status(200).json({ message: "Workout updated successfully" });
};

module.exports = {
  getWorkOuts,
  getWorkOut,
  createWorkOut,
  deleteWorkout,
  updateWorkout,
};
