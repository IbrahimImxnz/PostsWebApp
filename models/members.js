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
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    code: {
      type: Number,
    },
    codeExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);
