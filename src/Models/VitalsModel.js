const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const vitalsSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    oxygen_level: {
      type: String,
      required: true,
    },
    bpm_reading: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vitals", vitalsSchema);
