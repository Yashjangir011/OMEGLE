"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const auth_1 = __importDefault(require("./routes/auth"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// enable json + cookies
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// your routes
app.use("/api/auth", auth_1.default);
// socket.io setup with cors
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173", // React frontend dev server
        methods: ["GET", "POST"],
        credentials: true,
    },
});
// Simple matchmaking state
const waitingQueue = [];
const partnerBySocket = new Map();
function removeFromQueue(socketId) {
    const idx = waitingQueue.indexOf(socketId);
    if (idx !== -1)
        waitingQueue.splice(idx, 1);
}
function pairSockets(a, b) {
    partnerBySocket.set(a, b);
    partnerBySocket.set(b, a);
    io.to(a).emit("partner-found", { partnerId: b });
    io.to(b).emit("partner-found", { partnerId: a });
}
function tryMatch(socketId) {
    // Remove self if already in queue
    removeFromQueue(socketId);
    // Find another waiting user
    const partnerId = waitingQueue.find((id) => id !== socketId);
    if (partnerId) {
        removeFromQueue(partnerId);
        pairSockets(socketId, partnerId);
    }
    else {
        waitingQueue.push(socketId);
        io.to(socketId).emit("queueing");
    }
}
function endPair(socketId, notifyPartner = true) {
    const partnerId = partnerBySocket.get(socketId);
    if (!partnerId)
        return;
    partnerBySocket.delete(socketId);
    partnerBySocket.delete(partnerId);
    if (notifyPartner) {
        io.to(partnerId).emit("partner-left");
    }
}
// socket handlers
io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);
    // User requests to find a partner
    socket.on("find-partner", () => {
        tryMatch(socket.id);
    });
    // Send a chat message to the current partner only
    socket.on("partner-message", (msg) => {
        const partnerId = partnerBySocket.get(socket.id);
        if (!partnerId)
            return;
        io.to(partnerId).emit("partner-message", { from: socket.id, message: msg });
    });
    // User clicks Next: break current pair (if any) and immediately requeue them
    socket.on("next", () => {
        endPair(socket.id);
        tryMatch(socket.id);
    });
    // Optional: allow explicit leave without requeue
    socket.on("leave", () => {
        endPair(socket.id);
        removeFromQueue(socket.id);
        socket.emit("left");
    });
    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
        // Clean from queue and notify partner
        removeFromQueue(socket.id);
        endPair(socket.id);
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(` server is running on port : ${PORT}`);
});
