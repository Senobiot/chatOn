require("dotenv").config();
const ws = require("ws");

const server = new ws.Server({ port: process.env.SERVER_PORT }, () =>
  console.log(`WebSocket server starts at port:${process.env.SERVER_PORT}`)
);

server.on("connection", (webSocket) => {
  webSocket.on("message", (msg) => {
    msg = JSON.parse(msg);
    switch (msg.event) {
      case "message":
        console.log(msg);
        sendMsg(msg);
        break;

      case "connection":
        sendMsg(`User ${msg.username} has entered in chat!!!`);
        break;

      default:
        break;
    }
  });
});

const sendMsg = (msg) => {
  server.clients.forEach((client) => {
    client.send(JSON.stringify(msg));
  });
};
