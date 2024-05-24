const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String, // You can specify the type of the token field
      default: null, // You can set a default value if needed
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
