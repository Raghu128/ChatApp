import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../Utils/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "./Header.css";
import { UserContext } from "../../context/UserContext";
import { getDatabase, ref, onValue, update, remove } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { user, loginUser, logoutUser } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email,
        };
        loginUser(userData);

        const db = getDatabase();
        const groupsRef = ref(db, `groups/`);

        onValue(groupsRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const userRequests = [];

            Object.keys(data).forEach((groupKey) => {
              const group = data[groupKey];
              const adminId = Object.keys(group.admin)[0]; // Extract admin ID

              if (
                group.admin[adminId].name === userData.displayName &&
                group.requestedUsers
              ) {
                Object.entries(group.requestedUsers).forEach(
                  ([requestId, request]) => {
                    userRequests.push({
                      groupId: groupKey,
                      requestId,
                      groupName: group.name, // Include group name
                      requesterName: request.requesterName,
                      requesterUid: request.requesterUid,
                      requesterPhoto: request.requesterPhoto,
                      
                    });
                  }
                );
              }
            });

            setNotifications(userRequests);
          }
        });
      } else {
        logoutUser();
      }
    });

    return () => unsubscribe();
  }, [loginUser, logoutUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logoutUser();
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleRequestAction = (
    groupId,
    requestId,
    requesterName,
    requesterUid,
    requesterPhoto,
    action
  ) => {
    
    const db = getDatabase();
    const requestRef = ref(db, `groups/${groupId}/requestedUsers/${requestId}`);
    console.log(action);
    
    
    if (action === "accept") {
      // Add to members
      update(ref(db, `groups/${groupId}/members`), {
        [requesterUid]: {
          name: requesterName,
          id: requesterUid,
          photoURL: requesterPhoto,
        },
      })
      .then(() => {
        // Remove from requestedUsers
        remove(requestRef)
        .then(() => {

              console.log(`User ${requesterName} added to members.`);
            })
            .catch((error) => {
              console.error("Error removing request: ", error);
            });
        })
        .catch((error) => {
          console.error("Error adding member: ", error);
        });
        console.log("running");
    } else if (action === "reject") {
      // Remove from requestedUsers
      
      remove(requestRef)
        .then(() => {
          console.log(`User ${requesterName} request rejected.`);
        })
        .catch((error) => {
          console.error("Error rejecting request: ", error);
        });
    } else if (action === "block") {
      // Add to blockedUsers and remove from requestedUsers
      update(ref(db, `groups/${groupId}/blockedUsers`), {
        [requesterUid]: {
          name: requesterName,
          id: requesterUid,
        },
      })
        .then(() => {
          remove(requestRef)
            .then(() => {
              console.log(`User ${requesterName} has been blocked.`);
            })
            .catch((error) => {
              console.error("Error removing request after blocking: ", error);
            });
        })
        .catch((error) => {
          console.error("Error blocking user: ", error);
        });
    }

    // Update local notifications state
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.requestId !== requestId)
    );
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={()=> navigate('/')}>Traviya</div>
      <ul className="nav-links">
        <li>{/* <a href="#contact">Contact</a> */}</li>
      </ul>
      <div className="auth-links">
        {user ? (
          <>
            
            <div
              className="notification-icon-container"
              onClick={toggleNotifications}
            >
              <FontAwesomeIcon icon={faBell} className="notification-icon" />
              {notifications.length > 0 && (
                <span className="notification-count">
                  {notifications.length}
                </span>
              )}
              {showNotifications && (
                <ul className="notification-list">
                  {notifications.length === 0 ? (
                    <li className="no-notifications">No notifications</li>
                  ) : (
                    notifications.map((notification, index) => (
                      <li key={index}>
                        <p className="text-group-notification">
                          <strong>{notification.requesterName}</strong> wants to
                          join in <strong>{notification.groupName}</strong>
                        </p>
                        <div className="request-actions">
                          <button
                            onClick={() =>
                              handleRequestAction(
                                notification.groupId,
                                notification.requestId,
                                notification.requesterName,
                                notification.requesterUid,
                                notification.requesterPhoto,
                                "accept"
                              )
                            }
                          >
                            Add
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(
                                notification.groupId,
                                notification.requestId,
                                notification.requesterName,
                                notification.requesterUid,
                                notification.requesterPhoto,
                                "reject"
                              )
                            }
                          >
                            Reject
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(
                                notification.groupId,
                                notification.requestId,
                                notification.requesterName,
                                notification.requesterUid,
                                notification.requesterPhoto,
                                "block"
                              )
                            }
                          >
                            Block
                          </button>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              )}
            </div>

            <span onClick={() => navigate("/profile")} className="user-name">
               {user.displayName.length > 10
                ? `${user.displayName.substring(0, 10)}...`
                : user.displayName}
            </span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="login-link">
            Login
          </a>
        )}
      </div>
    </nav>
  );
}

export default Header;
