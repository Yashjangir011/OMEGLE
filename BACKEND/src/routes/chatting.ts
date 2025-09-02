// // import express , { Request , Response } from "express";
// // const router = express.Router();



// // export default router


// import { log } from "console";
// import { WebSocket, WebSocketServer } from "ws";

// const wss = new WebSocketServer({ port: 8080 });

// interface User {
//   socket: WebSocket;
//   room: string;
// }

// let client: User[] = [];

// wss.on("connection", (socket: WebSocket) => {
//   // whenever there is a new connection we just call the callback function

//   socket.on("message", (message: string) => {
//     const parsedMessage = JSON.parse(message);
//     log(parsedMessage);

//     if (parsedMessage.type == "join") {
//       client.push({
//         socket,
//         room: parsedMessage.payload.roomId,
//       });
//     }

//     if (parsedMessage.type == "chat") {
//       let currentUserRoom = null;

//       // first find the current user's room
//       for (let i = 0; i < client.length; i++) {
//         if (client[i].socket == socket) {
//           currentUserRoom = client[i].room;
//         }
//       }

//       // then send the message to all sockets in that room
//       for (let i = 0; i < client.length; i++) {
//         if (client[i].room == currentUserRoom) {
//           client[i].socket.send(parsedMessage.payload.message);
//         }
//       }
//     }
//   });
// });
