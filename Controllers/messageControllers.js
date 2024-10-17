const Messages = require("../models/messages");
const asyncHandler = require("express-async-handler");

const setMessage = asyncHandler(async (req, res, sender, receiver, content) => {
  const message = await Messages.create({
    sender: sender,
    receiver: receiver,
    content: content,
  });

  res.status(201).json({ success: true, message: "New message" });
});

// const getMessage

module.exports = { setMessage };

// add messages to database

// ! redundant
