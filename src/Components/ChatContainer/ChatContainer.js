import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext.js";
import MessageContainer from "../MessageContainer/MessageContainer.js";
import { getDatabase, ref, onValue } from "firebase/database";
import "./ChatContainer.css";

const ChatContainer = ({ group, onSendMessage, onRemoveMember }) => {
  const [message, setMessage] = useState("");
  const [members, setMembers] = useState(null);
  const [showGroupDetails, setShowGroupDetails] = useState(false); // Group details visibility
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const isAdmin = user && group.admin[user.uid];
  const navigate = useNavigate();

  // Fetch group members and messages logic...
  useEffect(() => {
    const db = getDatabase();
    const membersRef = ref(db, `groups/${group.id}/members/`);
    const messagesRef = ref(db, `groups/${group.id}/messages/`);
    
    onValue(membersRef, (snapshot) => {
      const membersData = snapshot.val();
      setMembers(membersData);
    });

    onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      setMessages(messagesData ? Object.values(messagesData) : []);
    });
  }, [group.id]);

  const handleInputChange = (e) => setMessage(e.target.value);

  const handleSendClick = () => {
    if (!user) {
      alert("Please log in to send messages.");
      return;
    }

    if (message.trim().length > 0) {
      if (members && members[user.uid]) {
        onSendMessage(message);
        setMessage("");
      } else {
        alert("You are no longer a member of this group.");
        navigate("/");
      }
    }
  };

  const handleRemoveMember = (memberUid, memberName) => {
    if (window.confirm(`Are you sure you want to remove ${memberName} from the group?`)) {
      onRemoveMember(group.id, memberUid, memberName);
      setMembers((prevMembers) => {
        const updatedMembers = { ...prevMembers };
        delete updatedMembers[memberUid];
        return updatedMembers;
      });
    }
  };

  // Scroll to the bottom of messages
  useEffect(() => {
    const chatContent = document.getElementById("chat_content_container");
    if (chatContent) {
      chatContent.scrollTop = chatContent.scrollHeight;
    }
  }, [messages]);

  const adminUid = group.admin ? Object.keys(group.admin)[0] : "";

  const otherMembers = members
    ? Object.entries(members).filter(([uid]) => uid !== adminUid)
    : [];

  useEffect(() => {
    if (members && !members[user.uid]) {
      alert("You have been removed from the group by the admin.");
      navigate("/");
    }
    
  }, [members, user, navigate]);

  return (
    <div className="chat-app-container"> {/* Main container */}
      <div className="sidebar">
        <div className="search-bar">
          Search
          {/* <input type="text" placeholder="Search" /> */}
          <button className="add-button">
            <i className="fas fa-plus"></i>
          </button>
        </div>

        <div className="chat-list">
          <div className="members-list">
            <h3>Members</h3>
            <ul>
              {group && group.admin && (
                <li className="member-item admin">
                  <img
                    className="member-photo"
                    src={Object.values(group.admin)[0].photoURL || "https://example.com/default-profile-pic.jpg"}
                    alt="Admin Profile"
                  />
                  <span>{Object.values(group.admin)[0].name} (Admin)</span>
                </li>
              )}
              {otherMembers.map(([memberUid, memberData]) => (
                <li key={memberUid} className="member-item">
                  <img
                    className="member-photo"
                    src={memberData.photoURL || "https://example.com/default-profile-pic.jpg"}
                    alt="Member Profile"
                  />
                  <span>{memberData.name}</span>
                  {isAdmin && memberUid !== user.uid && (
                    <button
                      className="remove-member-button"
                      onClick={() => handleRemoveMember(memberUid, memberData.name)}
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="main-chat-area">
        <div className="chat-header">
          <div className="chat-header-left">
            <img
              src={group && group.admin ? group.iconUrl || "https://example.com/default-profile-pic.jpg" : "https://example.com/default-profile-pic.jpg"}
              alt="Profile"
            />
            <h3>{group ? group.name : "Select a Chat"}</h3>
          </div>

          <div className="chat-header-right">
            {/* Toggle Button for Group Details */}
            <button className="action-button" onClick={() => setShowGroupDetails(!showGroupDetails)}>
              {showGroupDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>
        </div>

        <div className="chat-body">
          <MessageContainer messages={messages} />
        </div>

        <div className="chat-footer">
          <div className="message-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={handleInputChange}
              className="message-input"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendClick();
                }
              }}
            />
          </div>
        </div>
      </div>

      {showGroupDetails && (
        <div className="group-details-panel">
          <h2>{group.name}</h2>
          <p><strong>Region:</strong> {group.region}</p>
          <p><strong>Description:</strong> {group.groupDescription}</p>
          <p><strong>Budget Preference:</strong> {group.budgetPreference}</p>
          <p><strong>Duration of Travel:</strong> {group.durationOfTravel}</p>
          <p><strong>Gear Requirements:</strong> {group.gearRequirements}</p>
          <p><strong>Site Description:</strong> {group.siteDescription}</p>

          

          <button className="logout-button" onClick={() => {setShowGroupDetails(false)}}>Close</button>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
