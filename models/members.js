const mongoose = require("mongoose");

const memberSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      // todo encrypt password with bcrypt
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
