const asyncHandler = require("express-async-handler");
const Member = require("../models/members");
const { generateAccessToken } = require("../jwtAuthenticator");
// const { validationResult } = require("express-validator");

const getMember = asyncHandler(async (req, res) => {
  /*const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }*/
  const member = await Member.findById(req.userid);
  if (!member) return res.status(404).send("Member not found");
  res.json({ member });
});

const setMember = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  // todo move to middleware
  /*const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }*/
  const member = await Member.create({
    username: username,
    password: password,
  });

  // todo encrypt password
  // todo return jwt token
  const accessToken = generateAccessToken({ id: member._id });

  res.status(201).json({ member, accessToken });
});

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  /*const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ success: false, message: result.array() });
  }*/
  const member = await Member.find({ username: username, password: password });

  if (!member) return res.status(404).send("Username or password is incorrect");

  const accessToken = generateAccessToken({ id: member._id });

  res.json({ member, accessToken });
});

module.exports = { getMember, setMember, login };
