// server.ts
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React dev server port (Vite default)
    methods: ["GET", "POST"],
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // Listen for "message" event from client
  socket.on("message", (msg: string) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    
    // Broadcast to all connected clients
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
