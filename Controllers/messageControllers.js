const Messages = require("../models/messages");
const asyncHandler = require("express-async-handler");

const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId)
    return res
      .status(404)
      .json({ success: false, message: "Receiver not found" });

  const message = await Messages.create({
    sender: req.userid,
    receiver: receiverId,
    content: content,
  });

  res.json({ success: true, data: message, message: "Message sent" });
});

module.exports = sendMessage;
