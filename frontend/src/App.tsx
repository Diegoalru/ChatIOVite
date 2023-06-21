import io from "socket.io-client";
import { useState, useEffect } from "react";
import { MessageModel } from "./models/MessageModel";

// Create socket instance.
const socket = io("/");

function App() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [text, setText] = useState("");

  /**
   * Handle form submit.
   * @param e Event
   * @returns void
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!text) return;
    if (text.trim().length === 0) return;

    const messageModel: MessageModel = {
      from: "Me",
      message: text,
    };

    setMessages((state) => [...state, messageModel]);
    socket.emit("message", messageModel);
  }

  function getHourAndMinute(date: Date): string {
    const time = new Date(date);
    const hour = time.getHours()
    const minute = time.getMinutes().toString().padStart(2, "0");
    return `${hour}:${minute}`;
  }

  useEffect(() => {
    /**
     * Receive message from server.
     * @param message Message from server.
     * @returns void
     */
    function receiveMessage(message: MessageModel) {
      // Add message to state.
      return setMessages((state) => [...state, message]);
    }

    socket.on("message", (message) => {
      // Receive message from server.
      receiveMessage(message);
    });

    return () => {
      // Clean up.
      socket.off("message");
    };
  }, [messages]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        {messages.length === 0 ? (
          <h6 className="text-center">No messages</h6>
        ) : (
          <ul>
            {messages.map((item, index) => (
              <li
                key={index}
                className={`my-2 p-2 table text-sm rounded-md ${
                  item.from === "Me" ? "bg-sky-700 ml-auto" : "bg-zinc-400"
                }`}
              >
                <span className="text-xs text-slate-800 font-bold block">
                  {item.from}
                </span>
                <span>
                  {item.message}
                </span>
                <span className="text-xs text-white block">
                  {getHourAndMinute(new Date())}
                </span>
              </li>
            ))}
          </ul>
        )}
        <input
          type="text"
          className="border-2 bg-zinc-500 p-2 w-full text-black"
          placeholder="Enter your message..."
          onChange={(e) => setText(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
