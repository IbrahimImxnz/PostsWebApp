const express = require("express");
const app = express();
const connectDB = require("./config");
require("dotenv").config();
const memberRouter = require("./Routes/memberRoute");
const sectionRouter = require("./Routes/sectionRoute");
const postRouter = require("./Routes/postRoute");
const path = require("path");
// const server = require("http").createServer(app);
// const io = require("socket.io")(server);
const Member = require("./models/members");
const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");
const { error } = require("console");
// const { setMessage } = require("./Controllers/messageControllers");
const Messages = require("./models/messages");
const https = require("https");
const fs = require("fs");
const http = require("http");
const throttler = require("./throttler");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");

const privateKey = fs.readFileSync(
  path.join(__dirname, "SSL", "server.key"),
  "utf8"
);
const certificate = fs.readFileSync(
  path.join(__dirname, "SSL", "server.cert"),
  "utf8"
); // generated key and certificate (local dev)

const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app); // create HTTPS server

const socketio = require("socket.io");
const io = socketio(httpsServer, {
  cors: {
    origin: "*", // Replace "*" with your client origin in production
    methods: ["GET", "POST"],
  },
});
// let onlineMembers = 0;
let onlineMembers = new Map(); // map > set to map usernames to sockets
global.onlineMembers = onlineMembers;

io.on("connection", (socket) => {
  // global.socket = socket;
  /*socket.on("room", async (data) => {
    const { username } = data;
    onlineMembers.add(username);
  });*/

  socket.on("login", async (data) => {
    try {
      const { accessToken } = data;
      if (!accessToken) {
        socket.emit("loginResponse", {
          status: "error",
          message: "token not found",
        });
        return;
      }
      const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );
      const userid = decodedToken.id;
      const member = await Member.findById(userid);
      socket.username = member.username;

      // convert map so it maps username to a set of sockets
      onlineMembers.get(member.username).add(socket);
      // xonlineMembers.set(socket.username, socket);
      console.log(`member logged in: ${socket.username} ${socket.id}`);
      socket.emit("loginResponse", { status: "ok" });
    } catch (error) {
      console.error("Login error:", error);
      socket.emit("loginResponse", {
        status: "error",
        message: "Error login",
      });
    }
  });

  socket.on("joinRoom", async (data) => {
    try {
      const { otherUsername } = data;
      const currentUsername = socket.username;

      if (!currentUsername) {
        socket.emit("joinRoomResponse", {
          status: "error",
          message: "No username found",
        });
        return;
      }

      if (currentUsername === otherUsername) {
        socket.emit("joinRoomResponse", {
          status: "error",
          message: "Cannot chat with yourself",
        });
        return;
      }

      const otherUserSockets = onlineMembers.get(otherUsername);
      if (otherUserSockets && otherUserSockets.size > 0) {
        const otherSocket = Array.from(otherUserSockets)[0];

        // const room = "room" + currentUsername + otherUsername;
        const room = `room-${[currentUsername, otherUsername]
          .sort()
          .join("-")}`; // more consistent
        console.log(room);
        // const otherUser = onlineMembers.get(otherUsername);
        /*if (otherUser) {
        const sockets = await io.allSockets(); // returns all sockets in room under namespace io
        const socketIds = Array.from(sockets); // gives array of all sockets
        const otherUserId = socketIds.find((id) => id !== socket.id);
        const otherSocket = io.sockets.sockets.get(otherUserId);*/

        console.log(
          `Room created: for ${currentUsername} and ${otherUsername}`
        );
        socket.join(room);
        otherSocket.join(room);

        io.to(room).emit("startChat", {
          room,
          // socketIds: [socket.id, otherSocket.id],
          members: [currentUsername, otherUsername],
        });

        socket.emit("joinRoomResponse", { status: "ok" });
      } else {
        socket.emit("joinRoomResponse", {
          status: "error",
          message: "other user is not online",
        });
      }
    } catch (error) {
      console.error("joinRoom error:", error);
      socket.emit("joinRoomResponse", {
        status: "error",
        message: "error in joining room",
      });
    }
  });

  socket.on("chatMessage", async (data) => {
    try {
      const { room, message, otherUsername } = data;

      if (!room || !message)
        return console.error("Invalid chatMessage data:", data);

      //await setMessage(socket.username, otherUsername, message);
      await Messages.create({
        sender: socket.username,
        receiver: otherUsername,
        content: message,
        room: room,
      });

      console.log(`Message from ${socket.id} : ${message}`);
      socket.to(room).emit("newMessage", { message, sender: socket.id });
      // broadcast to everyone but sender
    } catch (error) {
      console.error("chatMessage error:", error);
    }
  });

  socket.on("disconnect", (reason) => {
    if (socket.username && onlineMembers.has(socket.username)) {
      onlineMembers.get(socket.username).delete(socket);

      if (onlineMembers.get(socket.username).size === 0) {
        onlineMembers.delete(socket.username);
      }
    }
    console.log("Member disconnected", socket.id, `reason is ${reason}`);
  });
});

connectDB();

app.use(express.json());
// app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, "html_templates")));
app.use(throttler);
// app.use(helmet());
app.use(compression());
// app.use(hpp());

app.use("/api/member", memberRouter);
app.use("/api/section", sectionRouter);
app.use("/api/post", postRouter);

app.get("/", (req, res) => {
  res.redirect("/api/member/register");
});

const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
}); // ? created http server that listens for http requests and redirects to https
// 301 status for moved permanently, response header to browser to move to new url
// location is destination of redirection, req.headers.host is hostname (localhost:port) and req.url is any path or query after that
// res.end ends the connection with http

const httpPort = process.env.httpPORT || 80;
const port = process.env.PORT || 443;
// const port = process.env.PORT || 7000;
httpServer.listen(httpPort, () =>
  console.log(`listening to port ${httpPort} and redirecting to ${port}`)
);
httpsServer.listen(port, () => console.log(`listening to port ${port}`)); // gives server access to socket.io

// module.exports = { io, members };

/*
socket.on("online", async () => {
   let room = "room" + Math.floor(onlineMembers / 2);
  const initialRoom = "room" + socket.username;
  console.log("Member online", socket.id, socket.username);
  /* if (!onlineMembers.has(socket.username)) {
    onlineMembers.add(socket.username);
  } 
  socket.join(initialRoom);

  if (onlineMembers.size === 2) {
    /*let roomids = [];
    for (let item of onlineMembers) {
      roomids.push(item);
    }
    let room = "room" + roomids[0] + roomids[1];
    const members = [...onlineMembers.keys()]; // use spread to get keys, a.k.a socket
    const [member1, member2] = members;
    let finalRoom = "room" + member1 + member2;

    const socket1 = onlineMembers.get(member1);
    const socket2 = onlineMembers.get(member2);

    socket1.join(finalRoom);
    socket2.join(finalRoom);
    console.log(`${member1} and ${member2} joined the room`);
    /*
    const sockets = await io.in(room).allSockets(); // returns all sockets in room under namespace io
    const socketIds = Array.from(sockets); // gives array of all sockets
    const members = socketIds.reduce((acc, id) => {
      const mappedSocket = io.sockets.sockets.get(id);
      acc[id] = mappedSocket.username;
      return acc;
    }, {}); // reduce the array into an object (dictionary) and initiate as empty object *
    // io.in(room).emit("startChat", { room, socketIds, members });
    io.in(finalRoom).emit("startChat", {
      room: finalRoom,
      socketIds: [socket1.id, socket2.id],
      members: [member1, member2],
    });
  }
});*/
