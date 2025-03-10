require("dotenv").config();
const ws = require("ws");

const connectedUsers = new Map();

const server = new ws.Server({ port: process.env.SERVER_PORT }, () =>
  console.log(`WebSocket server starts at port:${process.env.SERVER_PORT}`)
);

function broadcast(message) {
  server.clients.forEach((client) => {
    if (client.readyState === ws.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

server.on("connection", (webSocket) => {
  webSocket.on("message", (dto) => {
    try {
      const { message, event, username } = JSON.parse(dto);

      switch (event) {
        case "message":
          broadcast({ message, event, username });
          break;

        case "connect":
          connectedUsers.set(webSocket, username);
          broadcast({
            currentUsers: Array.from(connectedUsers.values()),
            event,
            message: `User ${username} has entered in chat!`,
          });
          break;

        case "disconnect":
          connectedUsers.delete(username);
          broadcast({
            currentUsers: Array.from(connectedUsers.values()),
            event,
            message: `User ${username} has left the chat!`,
          });
        default:
          console.warn("Unknown event:");
          break;
      }
    } catch (error) {
      console.log(error);
    }
  });

  webSocket.on("close", () => {
    let username;
    for (const [key, value] of connectedUsers.entries()) {
      if (key === webSocket) {
        username = value;
        connectedUsers.delete(key);
      }
    }

    if (username) {
      broadcast({
        currentUsers: Array.from(connectedUsers.values()),
        event: "disconnect",
        message: `User ${username} has left the chat.`,
      });
    }
  });
});
