const express = require("express");
const app = express();
const connectDB = require("./config");
require("dotenv").config();
const memberRouter = require("./Routes/memberRoute");
const sectionRouter = require("./Routes/sectionRoute");
const postRouter = require("./Routes/postRoute");
/*
const http = require("http");
const socketio = require("socket.io");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Member = require("./models/members");
const Messages = require("./models/messages");
const mongoose = require("mongoose");*/

connectDB();

app.use(express.json());
// app.use(express.urlencoded({extended:false}))

app.use("/api/member", memberRouter);
app.use("/api/section", sectionRouter);
app.use("/api/post", postRouter);

const port = process.env.PORT || 7000;
// app.listen(port, () => console.log(`listening to port ${port}`));
app.listen(port, () => console.log(`listening to port ${port}`)); // gives server access to socket.io

// module.exports = { io, members };
