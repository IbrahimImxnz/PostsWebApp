const mongoose = require("mongoose");
const Member = require("../models/members");

const sectionSchema = mongoose.Schema({
  name: {
    type: String,
    required: true, // todo remove enum
    /*
    enum: {
      values: ["Sport", "Entertainment", "Food", "Politics"],
      message:
        "Please only choose from following options: (Sport, Entertainment, Food, Politics)",
    },*/
    unique: true,
  },
  created_by: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: Member, // todo change to string (collection name)
  },
});

// ? i want names to be unique to each member but not all members (mongoose index)

module.exports = mongoose.model("Section", sectionSchema);
