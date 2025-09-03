import express from "express";
import http from "http";
import authRoutes from "./routes/auth";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { Server } from "socket.io";  

dotenv.config();

const app = express();
const server = http.createServer(app);

// enable json + cookies
app.use(express.json());
app.use(cookieParser());

// your routes
app.use("/api/auth", authRoutes);

// socket.io setup with cors
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // React frontend dev server
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// socket handlers
io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  socket.on("message", (msg: string) => { //yha messsage ayega from the server and we can transfer it another

    console.log(`Message from ${socket.id}: ${msg}`);
    // here we are sending the message to all connected clie3nts
    //ye message ko broadcast karega to all message things
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(` server is running on port : ${PORT}`);
});
