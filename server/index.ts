import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("User joined room: ", roomId);
  });

  socket.on("draw", (roomId, elements) => {
    socket.to(roomId).emit("draw", elements);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(port, () => console.log(`Socket server running on port ${port}`));
