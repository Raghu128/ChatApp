
// import React, { useState, useEffect, useContext } from "react";
// import Chat from "../Chat/Chat.js";
// import { UserContext } from "../../context/UserContext.js";
// import { getDatabase, ref, onValue, set, remove, update, push} from "firebase/database";


// const GroupsPage = ({ group }) => {
//   const { user } = useContext(UserContext);
//   const [userName, setUserName] = useState(user?.displayName || "");
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     if (userName && group) {
//       const db = getDatabase();
//       const messagesRef = ref(db, `groups/${group.name}/messages/`);
//       onValue(
//         messagesRef,
//         (snapshot) => {
//           const data = snapshot.val();
//           if (data) {
//             const orderedMessages = Object.values(data).sort(
//               (a, b) => a.index - b.index
//             );

//             setMessages(orderedMessages);
//           } else {
//             console.log("No messages found.");
//           }
//         },
//         (error) => {
//           console.error("Error fetching messages: ", error);
//         }
//       );
//     }
//   }, [userName, group]);

  
//   const onRemoveMember = (groupId, memberUid, memberName, group) => {
//     const db = getDatabase();
      
//     // First, check if the user trying to remove is the admin
//     const isAdmin = user && user.displayName === group.admin[user.uid];
    
//     if (isAdmin) {
//       // Remove the member from the group's members
//       remove(ref(db, `groups/${groupId}/members/${memberUid}`))
//         .then(() => {
//           alert("Member has been removed now");
//           // update(ref(db, `groups/${groupId}/blockedUsers`), {
//           //   [memberUid]: memberName
//           // }).then(() => {
//           //   alert("Member removed and blocked successfully.");
//           // }).catch((error) => {
//           //   console.error("Error blocking member: ", error);
//           // });
//         })
//         .catch((error) => {
//           console.error("Error removing member: ", error);
//         });
//     } else {
//       alert("Only the admin can remove members.");
//     }
//   };

//   const handleSendMessage = (message) => {
//     if (message.trim() && group) {
//         const db = getDatabase();
//         const messagesRef = ref(db, `groups/${group.name}/messages`);

//         const newMessageRef = push(messagesRef);

//         const newMessage = {
//             sender: user ? user.displayName : "Anonymous",
//             content: message,
//             index: newMessageRef.key,
//             timestamp: new Date().toISOString(),
//         };

//         set(newMessageRef, newMessage)
//             .then(() => {
//                 console.log("Message sent successfully.");
//             })
//             .catch((error) => {
//                 console.error("Error sending message: ", error);
//             });
//     }
// };


//   const handleLogout = () => {
//     localStorage.clear();
//     setUserName(null);
//   };

//   return (
//     <Chat
//       messages={messages}
//       onSendMessage={handleSendMessage}
//       onLogout={handleLogout}
//       group={group}
//       onRemoveMember={onRemoveMember}
//     />
//   );
// };

// export default GroupsPage;



// this for the dynamically

import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; 
import Chat from "../Chat/Chat.js";
import { UserContext } from "../../context/UserContext.js";
import { getDatabase, ref, onValue, set, remove, push } from "firebase/database";

const GroupsPage = () => {
  const { user } = useContext(UserContext);
  const { groupId } = useParams(); 
  const [group, setGroup] = useState(null); 
  const [userName, setUserName] = useState(user?.displayName || "");
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!groupId) {
      console.error("No groupId found.");
      return;
    }
    
    const fetchGroupData = async () => {
      const db = getDatabase();
      const groupRef = ref(db, `groups/${groupId}`);

      onValue(
        groupRef,
        (snapshot) => {
          const groupData = snapshot.val();
          if (groupData) {
            setGroup(groupData); 

            // Check if the current user is an admin
            if (user && groupData.admin[user.uid]) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } else {
            console.log("Group not found.");
          }
        },
        (error) => {
          console.error("Error fetching group data: ", error);
        }
      );
    };

    fetchGroupData();
  }, [groupId, user]);

  useEffect(() => {
    if (userName && groupId) {
      const db = getDatabase();
      const messagesRef = ref(db, `groups/${groupId}/messages/`);

      onValue(
        messagesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const orderedMessages = Object.values(data).sort(
              (a, b) => a.index - b.index
            );
            setMessages(orderedMessages);
          } else {
            console.log("No messages found.");
          }
        },
        (error) => {
          console.error("Error fetching messages: ", error);
        }
      );
    }
  }, [userName, groupId, group]);

  const handleSendMessage = (message) => {
    if (message.trim() && groupId) {
      const db = getDatabase();
      const messagesRef = ref(db, `groups/${groupId}/messages`);

      const newMessageRef = push(messagesRef);

      const newMessage = {
        sender: user ? user.displayName : "Anonymous",
        sendId : user.uid,
        photoURL: user.photoURL,
        content: message,
        index: newMessageRef.key,
        timestamp: new Date().toISOString(),
      };

      set(newMessageRef, newMessage)
        .then(() => {
          console.log("Message sent successfully.");
        })
        .catch((error) => {
          console.error("Error sending message: ", error);
        });
    }
  };

  const onRemoveMember = (groupId, memberUid) => {
    const db = getDatabase();

    if (isAdmin) {
      remove(ref(db, `groups/${groupId}/members/${memberUid}`))
        .then(() => {
          alert("Member has been removed.");
        })
        .catch((error) => {
          console.error("Error removing member: ", error);
        });
    } else {
      alert("Only the admin can remove members.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserName(null);
  };

  return (
    group ? (
      <Chat
        messages={messages}
        onSendMessage={handleSendMessage}
        onLogout={handleLogout}
        group={group}
        onRemoveMember={onRemoveMember}
        isAdmin={isAdmin}
      />
    ) : (
      <div>Loading group data...</div>
    )
  );
};

export default GroupsPage;
