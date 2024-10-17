const mongoose = require("mongoose");
// const Member = require("../models/members");

const messagesSchema = mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      ref: "Member",
    },
    receiver: {
      type: String,
      required: true,
      ref: "Member",
    },
    content: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messagesSchema);
