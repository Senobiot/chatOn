require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const chatRouter = require("./router/chat");

const corsOptions = {
  origin: process.env.REACT_APP_URL,
  methods: ["GET", "POST"],
};

const app = express();
app.use(cors(corsOptions));
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

app.use("/chat", chatRouter);
io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("message", (msg) => {
    console.log("Message received: ", msg);
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const start = async () => {
  try {
    server.listen(process.env.SERVER_PORT, () => {
      console.log(`server starts at port ${process.env.SERVER_PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();

// server.listen(3000, () => {
//   console.log('server running at http://localhost:3000');
// });
