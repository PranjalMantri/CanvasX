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

interface HistoryState {
  history: ElementType[][];
  index: number;
}

const roomElementHistory = new Map<string, HistoryState>();

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

function initializeRoom(roomId: string): HistoryState {
  if (!roomElementHistory.has(roomId)) {
    roomElementHistory.set(roomId, {
      history: [[]],
      index: 0,
    });
  }
  return roomElementHistory.get(roomId)!;
}

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);

    const state = initializeRoom(roomId);
    const currentElements = state.history[state.index];

    socket.emit("history", {
      elements: deepClone(currentElements),
      index: state.index,
    });
    console.log(
      `Sent history length=${state.history.length}, index=${state.index} to ${socket.id} for room ${roomId}`
    );
  });

  socket.on("draw", (roomId, elements) => {
    if (Array.isArray(elements)) {
      const state = initializeRoom(roomId);

      // history branching
      state.history = state.history.slice(0, state.index + 1);

      state.history.push(deepClone(elements));
      state.index = state.history.length - 1;

      roomElementHistory.set(roomId, state);

      socket.to(roomId).emit("draw", {
        elements: deepClone(elements),
        index: state.index,
      });

      console.log(
        `Drew in room ${roomId}: index=${state.index}, historyLength=${state.history.length}`
      );
    } else {
      console.log(`Ignored invalid draw from ${socket.id} in room ${roomId}`);
    }
  });

  socket.on("undo", (roomId) => {
    const state = initializeRoom(roomId);

    if (state.index > 0) {
      state.index--;
      const currentElements = state.history[state.index];

      socket.to(roomId).emit("undo", {
        elements: deepClone(currentElements),
        index: state.index,
      });

      socket.emit("undo", {
        elements: deepClone(currentElements),
        index: state.index,
      });

      console.log(`Undo in room ${roomId}: index=${state.index}`);
    }
  });

  socket.on("redo", (roomId) => {
    const state = initializeRoom(roomId);

    if (state.index < state.history.length - 1) {
      state.index++;
      const currentElements = state.history[state.index];

      socket.to(roomId).emit("redo", {
        elements: deepClone(currentElements),
        index: state.index,
      });

      socket.emit("redo", {
        elements: deepClone(currentElements),
        index: state.index,
      });

      console.log(`Redo in room ${roomId}: index=${state.index}`);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(port, () => console.log(`Socket server running on port ${port}`));
