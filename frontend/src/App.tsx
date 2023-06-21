import "./App.css";
import io from "socket.io-client";

const socket = io("/");

function App() {
  socket.on("connect", () => {
    console.log("Connected to server");
  });

  return(
    <div>Hello World</div>
  );
}

export default App;
