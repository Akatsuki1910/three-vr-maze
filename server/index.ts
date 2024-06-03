import WebSocket, { WebSocketServer } from "ws";
import { createMaze } from "../src/utils/createMaze";
import { createServer } from "https";
import { readFileSync } from "fs";

const server = createServer({
  cert: readFileSync("./cert.pem"),
  key: readFileSync("./key.pem"),
});
const wss = new WebSocketServer({ server, perMessageDeflate: false });

const size = 31;
const { wallMaze } = createMaze(size, size);

wss.on("connection", (socket, req) => {
  console.log(`Client connected ${req.headers["sec-websocket-key"]}`);

  socket.on("message", (data) => {
    console.log(`Received: ${data} by ${req.headers["sec-websocket-key"]}`);

    if (data.toString() === "first") {
      socket.send(`first ${size} ${JSON.stringify(wallMaze)}`);
    } else {
      wss.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send(`${req.headers["sec-websocket-key"]} ${data}`);
        }
      });
    }
  });

  socket.on("close", () => {
    console.log(`Client disconnected ${req.headers["sec-websocket-key"]}`);
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(`close ${req.headers["sec-websocket-key"]}`);
      }
    });
  });

  socket.on("error", console.error);
});

server.listen(3000, () => {
  console.log("Server started on https://localhost:3000");
});
