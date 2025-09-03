import { use, useEffect, useState } from "react";
import './App.css'; 
{/* this is the css file which is used to style the app */}

import io from "socket.io-client";

const socket = io("http://localhost:3000"); // this is the socket connection to the server

function App() {
  const [socketId, setSocketId] = useState(""); 
  {/* this is the state which is used to store the socket id */}

  const [sokets , setSokets] = useState<string[]>([]);
  {/* this is the state which is used to store all the sokets connected to the server */}

  const [messages, setMessages] = useState<string[]>([]); 
  {/* this is the state which is used to store the messages */}

  const [message, setMessage] = useState(""); 
  {/* this is the state which is used to store the message to be sent to the server */}
  
  const [room , setRoom] = useState<string[]>([]);

  const [roomid , setroomid] = useState(""); 

  useEffect(() => {
    
    socket.on("connect", () => { 
      {/* this is the event name which is sent from the server on back-end side */}
      console.log("connected to the server");
      
      setSocketId(socket.id); // here we are setting the socket id to the state
      setSokets((prev) => [...prev, socket.id]); // here we are setting the sokets to the state
    });


    socket.on("disconnect", () => {
      {/* this is the event name which is sent when someone disconnects */}
      console.log("disconnected from the server");
      setSokets((prev) => prev.filter(id => id !== socket.id)); // remove this socket from the list
    });


    

    socket.on("message", (message: string) => { 
      {/* this is the event name which is sent from the server on back-end side */}
      console.log("message received from the server");
      console.log(message);
      setMessages((prev) => [...prev, message]); 
      {/* here we are setting the message to the state */}
    });



    // Cleanup function to remove event listeners
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
    {/* this is the cleanup function which is used to remove the event listeners */}
  }, []);
  
  return (
    <>  
    {/* this is the div which is used to display the messages */}
      <h1>Hello World</h1>

      <h1>Socket ID: {socketId}</h1> 
       {/* this is the socket id which is used to display the socket id */}

      <div>
        <h2>Connected Sockets ({sokets.length}):</h2>
        <ul>
          {sokets.map((socketId) => (
            <li key={socketId}>{socketId}</li>
          ))}
        </ul>
      </div>
      <div> 
       {/* this is the div which is used to display the messages */}
        <h1>Messages</h1>
        <ul>
          {messages.map((message: string ) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>

      <input type="text" placeholder="Message" onChange={(e) => setMessage(e.target.value)} /> 
       {/* this is the input field which is used to send the message to the server */}

      <button onClick={() => socket.emit("message", message)}>Send</button> 
      {/* jo bhi hum input m dalenge and jab hm is btn pe click karenge to ye backend ko vo message
      bhejega
      */}

      {/* <input type="text" placeholder="Roomid" onChange={(e) => setroomid(e.target.value)} />
      <button onClick={() => socket.emit('join-room', roomid)}>join room</button>
       {/* this is the button which is used to send the message to the server */}
{/* 
      <button >Next</button> */} 

      </>
  )
}

export default App
