const express = require("express");
const app = express();
const connectDB = require("./config");
require("dotenv").config();
const memberRouter = require("./Routes/memberRoute");
const sectionRouter = require("./Routes/sectionRoute");
const postRouter = require("./Routes/postRoute");
const path = require("path");
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const Member = require("./models/members");
const jwt = require("jsonwebtoken");

// let onlineMembers = 0;
let onlineMembers = new Set();
io.on("connection", (socket) => {
  socket.on("room", async (data) => {
    const { username } = data;
    onlineMembers.add(username);
  });

  socket.on("login", async (data) => {
    const { accessToken } = data;
    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );
    const userid = decodedToken.id;
    const member = await Member.findById(userid);
    socket.username = member.username;
    console.log(`member logged in: ${socket.username}`);
  });

  socket.on("online", async () => {
    // let room = "room" + Math.floor(onlineMembers / 2);
    console.log("Member online", socket.id, socket.username);
    onlineMembers.add(socket.username);
    socket.join(room);

    if (onlineMembers.size === 2) {
      let roomids = [];
      for (let item of onlineMembers) {
        roomids.append(item);
      }
      let room = "room" + roomids[0] + roomids[1];
      const sockets = await io.in(room).allSockets(); // returns all sockets in room under namespace io
      const socketIds = Array.from(sockets); // gives array of all sockets
      const members = socketIds.reduce((acc, id) => {
        const mappedSocket = io.sockets.sockets.get(id);
        acc[id] = mappedSocket.username;
        return acc;
      }, {}); // reduce the array into an object (dictionary) and initiate as empty object
      io.in(room).emit("startChat", { room, socketIds, members });
    }
  });

  socket.on("chatMessage", (data) => {
    const { room, message } = data;
    console.log(`Message from ${socket.id} : ${message}`);
    socket.to(room).emit("newMessage", { message, sender: socket.id });
    // broadcast to everyone but sender
  });

  socket.on("disconnect", (reason) => {
    onlineMembers--;
    console.log("Member disconnected", socket.id, socket.username, reason);
  });
});

connectDB();

app.use(express.json());
// app.use(express.urlencoded({extended:false}))

app.use(express.static(path.join(__dirname, "html_templates")));

app.use("/api/member", memberRouter);
app.use("/api/section", sectionRouter);
app.use("/api/post", postRouter);

app.get("/", (req, res) => {
  res.redirect("/api/member/register");
});

const port = process.env.PORT || 7000;
server.listen(port, () => console.log(`listening to port ${port}`)); // gives server access to socket.io

// module.exports = { io, members };
