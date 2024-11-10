import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import "./MessageContainer.css";

const MessageContainer = ({ messages }) => {
  const { user } = useContext(UserContext);
  let previousDate = null;
  

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  if (messages.length === 0) {
    return <div className="no-messages">No messages yet</div>;
  }

  return (
    <div className="message-list">
      {messages.reduce((acc, msg, index) => {
        const timestamp = new Date(msg.timestamp);
        const dateString = timestamp.toLocaleDateString();

        if (previousDate !== dateString) {
          acc.push(
            <div key={dateString} className="date-separator">
              {dateString}
            </div>
          );
          previousDate = dateString;
        }

        acc.push(
          <div
            key={index}
            className={`message ${
              msg.sendId === user.uid ? "sent" : "received"
            }`} 
          >
            {msg.sendId !== user.uid && ( 
              <div className="sender-info" >
                <img
                  src={
                    msg.photoURL ||
                    "https://example.com/default-profile-pic.jpg" 
                  }
                  alt={msg.sender}
                  className="profile-pic"
                />
              </div>
            )}
            <div className="message-bubble">
              {msg.content}
              <span className="timestamp">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
          </div>
        );
        return acc;
      }, [])}
    </div>
  );
};

export default MessageContainer;