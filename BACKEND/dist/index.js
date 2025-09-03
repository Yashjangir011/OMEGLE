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
// socket handlers
io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);
    socket.on("message", (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);
        // here we are sending the message to all connected clie3nts
        //ye message ko broadcast karega to all message things
        socket.on('join-room', (roomName) => {
            if (roomName === 'jk') {
                socket.join(roomName);
                io.emit("message", msg);
            }
        });
    });
    socket.on("disconnect", () => {
        console.log("user disconnected:", socket.id);
    });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(` server is running on port : ${PORT}`);
});
