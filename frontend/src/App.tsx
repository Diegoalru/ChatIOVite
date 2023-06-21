import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";

// Create socket instance.
const socket = io("/");

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  /**
   * Handle form submit.
   * @param e Event
   * @returns void
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!message) return;
    if (message.trim().length === 0) return;

    socket.emit("message", message);
  }

  useEffect(() => {
    /**
     * Receive message from server.
     * @param message Message from server.
     * @returns void
     */
    function receiveMessage(message: string) {
      // Add message to state.
      return setMessages(() => [...messages, message]);
    }

    socket.on("message", (message) => {
      // Receive message from server.
      receiveMessage(message);
    });

    return () => {
      // Clean up.
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  return (
    <div>
      <ul>
        {messages.length === 0 ? (
          <p>No messages</p>
        ) : (
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        )}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="message"
          id="message"
          placeholder="Enter your message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
