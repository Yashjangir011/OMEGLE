import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3000");

function Chat() {
  const [socketId, setSocketId] = useState("");
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Idle");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // On successful websocket connection, store our socket ID
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    // Server queued us because no partner was available
    socket.on("queueing", () => {
      setStatus("Searching for a partner...");
      setPartnerId(null);
    });

    // We have been paired; reset chat and show connected status
    socket.on("partner-found", ({ partnerId }: { partnerId: string }) => {
      setPartnerId(partnerId);
      setStatus("Connected to partner");
      setMessages([]);
    });

    // Partner disconnected or clicked Next/Leave
    socket.on("partner-left", () => {
      setStatus("Partner left. Click Start to find a new one.");
      setPartnerId(null);
    });

    // Incoming chat message relayed by server from the current partner
    socket.on("partner-message", ({ message }: { from: string; message: string }) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup all listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("queueing");
      socket.off("partner-found");
      socket.off("partner-left");
      socket.off("partner-message");
    };
  }, []);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Request a partner; will either pair immediately or put us in the queue
  const handleStart = () => {
    socket.emit("find-partner");
  };

  // Break the current pair (if any) and immediately requeue for a new partner
  const handleNext = () => {
    socket.emit("next");
  };

  // Send a chat message to the current partner (also echo locally as "You:")
  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, `You: ${message}`]);
    socket.emit("partner-message", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-3xl flex flex-col overflow-hidden">
        {/* Header showing current session status */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h1 className="text-2xl font-bold">Omegle Chat</h1>
          <div className="flex items-center gap-3 text-sm opacity-90">
            <p>{status}</p>
            <span className="hidden sm:inline-block bg-white/10 px-2 py-0.5 rounded">You: {socketId?.slice(0, 6) || '—'}</span>
          </div>
        </div>

        {/* Messages list; aligns bubbles left/right based on sender */}
        <div className="flex-1 flex flex-col p-4 space-y-4 overflow-y-auto max-h-[70vh] bg-gray-50">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 italic">No messages yet</p>
          )}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.startsWith("You:") ? "justify-end" : "justify-start"}`}
            >
              <span
                className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] break-words shadow 
                  ${m.startsWith("You:")
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
              >
                {m}
              </span>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        {/* Controls: Start/Next and input/send */}
        <div className="p-4 bg-gray-100 border-t flex flex-col sm:flex-row gap-3 sm:gap-2">
          <div className="flex gap-2 justify-center sm:justify-start">
            <button
              onClick={handleStart}
              className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Start
            </button>
            <button
              onClick={handleNext}
              disabled={!partnerId && status !== "Searching for a partner..."}
              className={`px-5 py-2 rounded-xl font-semibold transition 
                ${(!partnerId && status !== "Searching for a partner...")
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
                }`}
            >
              Next
            </button>
          </div>
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!partnerId}
              className={`px-5 py-2 rounded-xl font-semibold transition 
                ${!partnerId
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600"
                }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
