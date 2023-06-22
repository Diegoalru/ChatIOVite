import io from "socket.io-client";
import { useState, useEffect } from "react";
import { MessageModel } from "./models/MessageModel";
import MessageComponent from "./components/MessageComponent";

// Create socket instance.
const socket = io("/");

function App() {
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [text, setText] = useState("");

  /**
   * Handle submit form.
   * @param e Event from form.
   * @returns void
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault(); // Prevent page reload.

    if (!text) return; // If text is empty, do nothing.
    if (text.trim().length === 0) return; // If text is empty, do nothing.

    const messageModel: MessageModel = {
      from: "Me",
      message: text,
      date: new Date(),
    };

    setMessages((state) => [...state, messageModel]);
    socket.emit("message", messageModel);
    setText("");
  }

  useEffect(() => {
    /**
     * Receive message from server and add it to state.
     * @param message Message from server.
     * @returns void
     */
    function receiveMessage(message: MessageModel): void {
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
          <MessageComponent messages={messages} />
        )}
        <input
          type="text"
          className="border-2 bg-zinc-500 p-2 w-full text-black mt-2"
          placeholder="Enter your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
