const express = require("express");
const app = express();
const connectDB = require("./config");
require("dotenv").config();
const memberRouter = require("./Routes/memberRoute");
const sectionRouter = require("./Routes/sectionRoute");
const postRouter = require("./Routes/postRoute");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  //handle connection
  console.log("Client connected: ", socket.id);
  socket.on("message", (message) => {
    console.log("Received message from " + socket.id + " " + message);
    //handle message
    socket.broadcast.emit("message", { user: socket.id, text: message }); // or io.emit
  });
  socket.on("disconnect", () => {
    //handle disconnection
    console.log("Client disconnected: ", socket.id);
  });
});

connectDB();

app.use(express.json());
// app.use(express.urlencoded({extended:false}))

app.use("/api/member", memberRouter);
app.use("/api/section", sectionRouter);
app.use("/api/post", postRouter);

const port = process.env.PORT || 7000;
// app.listen(port, () => console.log(`listening to port ${port}`));
server.listen(port, () => console.log(`listening to port ${port}`)); // gives server access to socket.io
