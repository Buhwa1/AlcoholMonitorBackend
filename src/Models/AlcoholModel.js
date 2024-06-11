const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const alcoholSchema = new Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    alcohol_level: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Alcohol", alcoholSchema);
