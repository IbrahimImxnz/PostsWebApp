const asyncHandler = require("express-async-handler");
const Member = require("../models/members");
const { generateAccessToken } = require("../jwtAuthenticator");
// const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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
  res.json({ member });
});

const setMember = asyncHandler(async (req, res) => {
  const salt = 5;
  const { username, password } = req.body;
  // todo move to middleware
  /*const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }*/
  const hashedPassword = await bcrypt.hash(password, salt);

  const member = await Member.create({
    username: username,
    password: hashedPassword,
  });

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

const updateMember = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const salt = 5;
  const hashedPassword = await bcrypt.hash(password, salt);

  const member = await Member.findById(req.userid);
  if (!member)
    return res
      .status(404)
      .json({ success: false, message: "member not found" });
  // could use findByIdAndUpdate
  if (username) member.username = username;
  if (password) member.password = hashedPassword;

  await member.save();

  res.json({
    success: true,
    data: member,
    message: "Member updated successfully",
  });
});

module.exports = { getMember, setMember, login, updateMember };
