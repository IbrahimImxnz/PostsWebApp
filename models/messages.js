const mongoose = require("mongoose");
const Member = require("../models/members");

const messagesSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: Member,
    },
    receiver: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: Member,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Messages", messagesSchema);
