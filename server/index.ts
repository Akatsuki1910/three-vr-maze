import WebSocket, { WebSocketServer } from "ws";
import { createMaze } from "../src/utils/createMaze";
const server = new WebSocketServer({ port: 3000 });

const size = 31;
const { wallMaze } = createMaze(size, size);

server.on("connection", (socket, req) => {
  console.log(`Client connected ${req.headers["sec-websocket-key"]}`);

  socket.on("message", (data) => {
    console.log(`Received: ${data} by ${req.headers["sec-websocket-key"]}`);

    if (data.toString() === "first") {
      socket.send(`first ${size} ${JSON.stringify(wallMaze)}`);
    } else {
      server.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(`${req.headers["sec-websocket-key"]} ${data}`);
        }
      });
    }
  });

  socket.on("close", () => {
    console.log(`Client disconnected ${req.headers["sec-websocket-key"]}`);
    server.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(`close ${req.headers["sec-websocket-key"]}`);
      }
    });
  });
});