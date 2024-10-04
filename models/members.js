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
    following: [{ type: mongoose.Types.ObjectId, ref: "Member" }],
    followers: [{ type: mongoose.Types.ObjectId, ref: "Member" }],
    favorites: [{ type: mongoose.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

memberSchema.pre("remove", async function (next) {
  try {
    await Post.deleteMany({ member_id: this._id });
    next();
  } catch (err) {
    next(err);
  }
}); // middleware to delete any posts using this member id

module.exports = mongoose.model("Member", memberSchema);
