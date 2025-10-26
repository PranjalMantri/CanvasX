import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

type ToolType = "line" | "rectangle";

interface ElementType {
  id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: ToolType;
  roughElement: any;
}

const port = process.env.PORT || 3001;

const app = express();
app.use(cors());

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const roomElementHistory = new Map();

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    const history = roomElementHistory.get(roomId) || [];

    socket.emit("history", deepClone(history));
    console.log(
      `Sent history length=${history.length} to ${socket.id} for room ${roomId}`
    );
  });

  socket.on("draw", (roomId, elements) => {
    if (Array.isArray(elements) && elements.length > 0) {
      roomElementHistory.set(roomId, elements);
      socket.to(roomId).emit("draw", elements);
    } else {
      console.log(`Ignored empty draw from ${socket.id} in room ${roomId}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(port, () => console.log(`Socket server running on port ${port}`));
