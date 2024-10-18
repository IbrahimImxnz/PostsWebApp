const asyncHandler = require("express-async-handler");
const Member = require("../models/members");
const Post = require("../models/posts");
const Section = require("../models/sections");
const { generateAccessToken } = require("../jwtAuthenticator");
// const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { blacklistToken } = require("../redisBlacklist");
const sendMail = require("../sendEmail");
require("dotenv").config();

const getMember = asyncHandler(async (req, res) => {
  /*const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }*/
  const member = await Member.findById(req.userid);
  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "Could not find user" });
  res.json({ success: true, data: member, message: "Member found" });
});

const getMemberByUsername = asyncHandler(async (req, res) => {
  const { username } = req.query;
  let query = {};

  query.username = username;

  const member = await Member.findOne(query);
  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "Could not find user" });
  res.json({ success: true, data: member, message: "Member found" });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const member2 = await Member.findOne({ email: email });

  if (member2)
    return res
      .status(400)
      .json({ success: false, message: "Email already in use" });

  const randomCode = Math.floor(10000000 + Math.random() * 90000000); // 8 digit code

  /*const member = await Member.create({
    code: randomCode,
    codeExpires: Date.now() + 1800000,
  });*/

  await Member.updateOne(
    // bypasses requirement validation of username and password
    { email },
    {
      code: randomCode,
      codeExpires: Date.now() + 1800000, // Code valid for 30 minutes
    },
    { upsert: true } // Create new document if not found
  );

  sendMail(email, randomCode);
  res.json({ success: true, message: "Email sent successfully" });
});

const setMember = asyncHandler(async (req, res) => {
  const salt = 5;
  const { username, password, email, code } = req.body;
  // todo move to middleware
  /*const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }*/
  const hashedPassword = await bcrypt.hash(password, salt);
  /*
  const member = await Member.create({
    username: username,
    password: hashedPassword,
    email: email,
  });*/
  const member = await Member.findOne({ email: email });

  if (!member)
    return res.status(404).json({ success: false, message: "Email not found" });

  if (code != member.code || member.codeExpires < Date.now())
    return res
      .status(400)
      .json({ success: false, message: "Code expired or invalid" });

  member.username = username;
  member.password = hashedPassword;

  await member.save();
  // todo encrypt password
  // todo return jwt token
  const accessToken = generateAccessToken({ id: member._id });

  res.status(201).json({ member, accessToken });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  // const salt = 5
  /*const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }*/
  const member = await Member.findOne({ username: username });
  // console.log("plainpassword", password, "encrypted password", member.password);
  // only in register we hash password : const hashedPassword = bcrypt.hash(password, salt)
  if (!member)
    return res.status(404).json({
      success: false,
      message: "Unsuccessful login because of incorrect username or password",
    });
  const compare = await bcrypt.compare(password, member.password);

  if (compare) {
    const accessToken = generateAccessToken({ id: member._id });
    res.json({
      success: true,
      message: `Login successful`,
      access_token: accessToken,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Unsuccessful login because of incorrect username or password",
    });
  }
});

// const onlineMembers = new Map();

const isOnline = asyncHandler(async (req, res) => {
  onlineMembers.set(req.body.username, new Set());
  res.send({ success: true, message: "user adeed to map" });
});

const updateMember = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const salt = 5;

  const member = await Member.findById(req.userid);
  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "member not found" });
  // could use findByIdAndUpdate
  if (username) member.username = username;
  if (password) {
    const hashedPassword = await bcrypt.hash(password, salt);
    member.password = hashedPassword;
  }
  // if (email) member.email = email;

  await member.save();

  res.json({
    success: true,
    data: member,
    message: "Member updated successfully",
  });
});

const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndDelete(req.userid);
  // const member = await Member.findById(req.userid);
  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "Member not found" });

  // await member.remove();
  // const posts = await Post.deleteMany({ member_id: req.userid });
  // const sections = await Section.deleteMany({ member_id: req.userid });

  res.json({
    success: true,
    data: member,
    /*
    data: posts,
    data: sections,*/
    message: "Member deleted successfully",
  });
});

const logout = asyncHandler(async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  const member = await Member.findById(req.userid);

  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "Member could not be found" });

  blacklistToken(token);
  res.json({ success: true, message: "Member logged out successfully" });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const randomCode = Math.floor(10000000 + Math.random() * 90000000); // 8 digit code

  const member = await Member.findOne({ email: email });

  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "Member email not found" });

  member.code = randomCode;
  member.codeExpires = Date.now() + 1800000;
  await member.save();

  sendMail(email, randomCode);
  res.json({ success: true, message: "Email has been sent with reset code" });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { username, password, code } = req.body;
  const salt = 5;

  const member = await Member.findOne({ username: username });
  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "Member not found" });

  if (code != member.code || member.codeExpires < Date.now())
    return res
      .status(400)
      .json({ success: false, message: "Code expired or invalid" });

  const hashedPassword = await bcrypt.hash(password, salt);
  member.password = hashedPassword;

  await member.save();

  res.json({ success: true, message: "Password reset successfully" });
});

const updateEmailVerify = asyncHandler(async (req, res) => {
  // const { email } = req.body;

  const member = await Member.findById(req.userid);

  if (!member)
    return res
      .status(404)
      .json({ success: false, messagee: "Member not found" });

  const randomCode = Math.floor(10000000 + Math.random() * 90000000); // 8 digit code

  member.code = randomCode;
  member.codeExpires = Date.now() + 1800000;

  await member.save();

  sendMail(member.email, randomCode);
  res.json({ success: true, message: "Email sent successfully" });
});

const updateEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const member2 = await Member.findOne({ email: email });
  if (member2)
    return res
      .status(400)
      .json({ success: false, message: "Email already in use" });

  const member = await Member.findById(req.userid);

  if (!member)
    return res
      .status(404)
      .json({ success: false, messagee: "Member not found" });

  if (code != member.code || member.codeExpires < Date.now())
    return res
      .status(400)
      .json({ success: false, message: "Code expired or invalid" });

  if (email) member.email = email;

  await member.save();
  res.json({
    success: true,
    data: member,
    message: "email updated successfully",
  });
});

const followMember = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const member = await Member.findOne({ username: username });
  const you = await Member.findById(req.userid);

  if (!member)
    return res
      .status(404)
      .json({ success: false, messagee: "Member not found" });
  /* if (you.following.includes(member._id)) // this does not work when referencing another model
    return res
      .status(400)
      .json({ success: false, message: "You already follow this user!" });
  */
  if (req.userid == member._id)
    return res
      .status(400)
      .json({ success: false, message: "You cannot follow yourself!" });
  if (you.following.some((id) => id.equals(member._id)))
    // returns true or false wether array has that id or no
    return res
      .status(400)
      .json({ success: false, message: "You already follow this user!" });

  await Member.findByIdAndUpdate(req.userid, {
    $push: { following: member._id },
  });
  await Member.findByIdAndUpdate(member._id, {
    $push: { followers: req.userid },
  });

  const followedUser = await Member.findById(req.userid).populate({
    path: "following",
    select: "username",
  });

  res.json({
    success: true,
    data: followedUser,
    message: `You are now following ${username}!`,
  });
});

const unfollowMember = asyncHandler(async (req, res) => {
  const you = await Member.findById(req.userid);
  const member = await Member.findOne({ username: req.body.username });

  if (!member)
    return res
      .status(404)
      .json({ success: false, messagee: "Member not found" });
  if (req.userid == member._id)
    return res
      .status(400)
      .json({ success: false, message: "You cannot unfollow yourself!" });
  if (!you.following.some((id) => id.equals(member._id)))
    return res
      .status(400)
      .json({ success: false, message: "You do not follow this user!" });

  await Member.findByIdAndUpdate(req.userid, {
    $pull: { following: member._id },
  });
  await Member.findByIdAndUpdate(member._id, {
    $pull: { followers: req.userid },
  });

  res.json({ success: true, message: "Member unfollowed successfully" });
});

const getFollowingFollowers = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.userid, "following followers")
    .populate({
      path: "following",
      select: "username",
    })
    .populate({
      path: "followers",
      select: "username",
    });

  if (!member)
    return res
      .status(404)
      .json({ success: false, messagee: "Member not found" });

  res.json({
    success: true,
    data: member,
    message: "Your followers and following",
  });
});

const getFavoritePosts = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.userid, "favorites").populate(
    "favorites"
  );

  if (!member)
    return res
      .status(404)
      .json({ success: false, messagee: "Member not found" });

  res.json({ success: true, data: member, message: "Your liked posts" });
});

const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const member = await Member.findById(req.userid);
    if (!member)
      return res
        .status(404)
        .json({ success: false, message: "Member not found" });
    if (!roles.includes(member.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this route",
      });
    }
    next();
  });

const getAllMembers = asyncHandler(async (req, res) => {
  const members = await Member.find();

  if (!members)
    return res
      .status(404)
      .json({ success: false, message: "No members found" });

  res.json({ success: true, data: members, message: "All members" });
});

const becomeAdmin = asyncHandler(async (req, res) => {
  const { username, code } = req.body;

  const member = await Member.findOne({ username: username });
  if (!member)
    return res.status(404).json({ success: false, message: "No member found" });
  if (code !== process.env.ADMIN)
    return res
      .status(401)
      .json({ success: false, message: "Code you provided is invalid" });

  member.role = "admin";
  await member.save();

  res.json({ success: true, message: `${username} is now an admin!` });
});

module.exports = {
  getMember,
  setMember,
  login,
  updateMember,
  deleteMember,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateEmailVerify,
  updateEmail,
  followMember,
  unfollowMember,
  getFollowingFollowers,
  getFavoritePosts,
  getMemberByUsername,
  //  onlineMembers,
  isOnline,
  allowedTo,
  getAllMembers,
  becomeAdmin,
};

// ? how to delete all posts of a member after deleting that member
// todo add logout
// ? ask about .optional() -> when putting and posting
