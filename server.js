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

let onlineMembers = 0;
io.on("connection", (socket) => {
  socket.on("online", async () => {
    let room = "room" + Math.floor(onlineMembers / 2);
    console.log("Member online", socket.id);
    onlineMembers++;
    socket.join(room);

    if (onlineMembers % 2 === 0) {
      const sockets = await io.in(room).allSockets(); // returns all sockets in room under namespace io
      const socketIds = Array.from(sockets); // gives array of all sockets
      io.in(room).emit("startChat", { room, socketIds });
    }
  });

  socket.on("chatMessage", (data) => {
    const { room, message } = data;
    console.log(`Message from ${socket.id} : ${message}`);
    socket.to(room).emit("newMessage", { message, sender: socket.id });
    // broadcast to everyone but sender
  });

  socket.on("disconnect", () => {
    onlineMembers--;
    console.log("Member disconnected", socket.id);
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
