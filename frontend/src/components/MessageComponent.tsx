import './MessageComponent.css';
import { MessageModel } from "../models/MessageModel";

function getHourAndMinute(date: Date): string {
  const time = new Date(date);
  const hour = time.getHours();
  const minute = time.getMinutes().toString().padStart(2, "0");
  return `${hour}:${minute}`;
}

function MessageComponent(props: { messages: MessageModel[] }) {
  const { messages } = props;

  return (
    <div className="messages">
      <h2 className="text-white text-lg font-bold mb-2">Messages</h2>
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
            <span>{item.message}</span>
            <span className="text-xs text-white block">
              {getHourAndMinute(item.date)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageComponent;
