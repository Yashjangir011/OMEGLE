"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // React dev server port (Vite default)
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);
    // Listen for "message" event from client
    socket.on("message", (msg) => {
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
