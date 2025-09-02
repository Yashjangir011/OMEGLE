import { useEffect, useState } from "react";
import './App.css'

import io from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to the server");
      setSocketId(socket.id);
    });

    socket.on("message", (message: string) => {
      console.log("message received from the server");
      console.log(message);
      setMessages([...messages, message]);
    });
  }, []);
  
  return (
    <>
      <h1>Hello World</h1>

      <h1>Socket ID: {socketId}</h1>

      <div>
        <h1>Messages</h1>
        <ul>
          {messages.map((message: string , index: number) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>

      <input type="text" placeholder="Message" onChange={(e) => setMessage(e.target.value)} />

      <button onClick={() => socket.emit("message", message)}>Send</button>

      </>
  )
}

export default App
