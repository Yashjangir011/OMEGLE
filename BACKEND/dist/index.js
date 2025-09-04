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
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// CORS configuration for API routes
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // React frontend dev server
    credentials: true, // Allow cookies
}));
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
// waitingQueue holds socket IDs that clicked "Start" (find-partner)
// but aren't paired yet. First-in is matched with the next newcomer.
const waitingQueue = [];
// partnerBySocket maps a socket ID -> its current partner's socket ID.
// If a socket isn't present here, it is either queued or idle.
const partnerBySocket = new Map();
function removeFromQueue(socketId) {
    // Remove the given socket from the waiting queue if present
    const idx = waitingQueue.indexOf(socketId);
    if (idx !== -1)
        waitingQueue.splice(idx, 1);
}
// this pair help to make a pair and then to access it to send the message to the particular
// partner only
function pairSockets(a, b) {
    // Record the relationship both ways
    partnerBySocket.set(a, b);
    partnerBySocket.set(b, a);
    // Notify both clients that they have been paired
    io.to(a).emit("partner-found", { partnerId: b });
    io.to(b).emit("partner-found", { partnerId: a });
}
function tryMatch(socketId) {
    // Remove self if already in queue
    //here we remove our own id more the queue so it will not add ourself with sourself
    removeFromQueue(socketId);
    // Find another waiting user
    //ye find karega ki 
    const partnerId = waitingQueue.find((id) => id !== socketId);
    //after finding the partner we remove that id from the queue and then make a pair
    if (partnerId) {
        // If we found one, remove them from the queue and pair
        removeFromQueue(partnerId);
        pairSockets(socketId, partnerId);
    }
    else {
        // Otherwise, add caller to queue and notify they're waiting
        waitingQueue.push(socketId);
        io.to(socketId).emit("queueing");
    }
}
function endPair(socketId, notifyPartner = true) {
    // Break the pairing for a given socket; optionally notify the partner
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
        //is end point se partner ko find karne ki req jayegi 
        // Either pairs immediately if someone is waiting, or enqueues the usere
        // after initiating the find-partner call from frontend ye matching pe jayega backend pe and
        // phir try match function ko initiate karega
        tryMatch(socket.id);
    });
    // Send a chat message to the current partner only
    socket.on("partner-message", (msg) => {
        // Look up the partner for this socket
        const partnerId = partnerBySocket.get(socket.id);
        if (!partnerId)
            return;
        // Forward the message only to the active partner
        io.to(partnerId).emit("partner-message", { from: socket.id, message: msg });
    });
    // User clicks Next: break current pair (if any) and immediately requeue them
    socket.on("next", () => {
        // Inform current partner and clear mapping
        endPair(socket.id);
        // Immediately try to find a new partner
        tryMatch(socket.id);
    });
    // Optional: allow explicit leave without requeue
    socket.on("leave", () => {
        // Break pairing and ensure user is not left in the queue
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
