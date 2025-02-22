import { IncomingMessage } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { createMaze } from "../src/utils/createMaze";

const port = Number(process.env.PORT || 8080);
const wss = new WebSocketServer({ port: port, host: "0.0.0.0" });

const size = 31;
const { wallMaze } = createMaze(size, size);

const getId = (req: IncomingMessage) => req.headers["sec-websocket-key"];

wss.on("connection", (socket, req) => {
  console.log(`Client connected ${getId(req)}`);

  socket.on("message", (data) => {
    if (data.toString() === "first") {
      socket.send(
        ["first", size, JSON.stringify(wallMaze), getId(req)].join(" ")
      );
    } else {
      wss.clients.forEach((client) => {
        if (client !== socket && client.readyState === WebSocket.OPEN) {
          client.send([getId(req), data].join(" "));
        }
      });
    }
  });

  socket.on("close", () => {
    console.log(`Client disconnected ${getId(req)}`);
    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(["close", getId(req)].join(" "));
      }
    });
  });

  socket.on("error", console.error);
});

wss.on("listening", () => {
  console.log(`Server started on port ${port}`);
});
