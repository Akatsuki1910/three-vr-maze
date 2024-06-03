import WebSocket, { WebSocketServer } from "ws";
import { createMaze } from "../src/utils/createMaze";
import { createServer } from "https";
import { readFileSync } from "fs";
import { IncomingMessage } from "http";

// const server = createServer({
//   cert: readFileSync("./cert.pem"),
//   key: readFileSync("./key.pem"),
// });
// const wss = new WebSocketServer({ server, perMessageDeflate: false });
const wss = new WebSocketServer({ port: 3000 });

const size = 31;
const { wallMaze } = createMaze(size, size);

const getId = (req: IncomingMessage) => req.headers["sec-websocket-key"];

wss.on("connection", (socket, req) => {
  console.log(`Client connected ${getId(req)}`);

  socket.on("message", (data) => {
    // console.log(`Received: ${data} by ${getId(req)}`);

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

// server.listen(3000, () => {
//   console.log("Server started on https://localhost:3000");
// });
