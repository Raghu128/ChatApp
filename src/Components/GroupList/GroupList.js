import React, { useState, useEffect, useContext } from "react";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import { UserContext } from "../../context/UserContext";
import Loader from "../Loader/Loader";
import { FiMoreVertical } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./GroupList.css";

const GroupsList = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    admin: user ? { name: user.displayName, id: user.uid } : null,
    members: "",
    isPrivate: false,
    region: "",
  });
  const [groupsData, setGroupsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [menuOpen, setMenuOpen] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const groupsRef = ref(db, "groups/");

    const unsubscribe = onValue(
      groupsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const fetchedGroups = Object.keys(data).map((groupKey) => ({
            ...data[groupKey],
            id: groupKey,
          }));

          setGroupsData(fetchedGroups);
        } else {
          console.log("No groups found.");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching groups: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (newGroup.name && newGroup.region) {
      const handleNavigation = () => {
        if (newGroup.name) {
          window.open(`group/${newGroup.id}`);
        }
      };
      handleNavigation();
    }
  }, [newGroup]);

 
  const handleChatOrRequest = (group) => {
    if (!user) {
      alert("Please login to join groups.");
      return;
    }

    if (user.documentVerified === false) {
      alert("Please Verified yourself to join groups.");
      return;
    }

    const adminId = Object.keys(group.admin)[0]; // Get the admin ID
    const adminName = group.admin[adminId].name; // Get the admin's name

    // Check if the user is blocked
    if (group.blockedUsers && group.blockedUsers[user.uid]) {
      alert("You are blocked from joining this group.");
      return;
    }

    if (group.isPrivate) {
      // Check if the user is already a member or is the admin
      if ((group.members && group.members[user.uid]) || adminId === user.uid) {
        setNewGroup(group); // Set new group for navigation
      } else {
        const db = getDatabase();
        const requestedUsersRef = ref(
          db,
          `groups/${group.id}/requestedUsers/${user.uid}`
        );

        set(requestedUsersRef, {
          requesterName: user.displayName,
          requesterUid: user.uid,
          requesterPhoto: user.photoURL,
          timestamp: new Date().toISOString(),
        })
          .then(() => {
            alert(`Request to join sent to admin: ${adminName}`);
          })
          .catch((error) => {
            console.error("Error sending request: ", error);
          })
          .finally(() => {
            console.log("running for stop");
            setLoading(false);
          });
      }
    } else {
      // For public groups, add the user as a member directly
      const db = getDatabase();
      const membersRef = ref(db, `groups/${group.id}/members/${user.uid}`);

      set(membersRef, {
        name: user.displayName,
        id: user.uid,
        photoURL: user.photoURL,
      })
        .then(() => {
          // alert(`You have joined the group: ${group.name}`);
          setNewGroup(group); // Set new group for navigation
        })
        .catch((error) => {
          console.error("Error joining group: ", error);
        })
        .finally(() => {
          console.log("running for stop");
          setLoading(false);
        });
    }
  };

  const toggleGroupPrivacy = (group) => {
    if (user && Object.keys(group.admin)[0] === user.uid) {
      const db = getDatabase();
      const groupRef = ref(db, `groups/${group.id}`);

      set(groupRef, {
        ...group,
        isPrivate: !group.isPrivate,
      })
        .then(() => {
          alert(
            `Group privacy updated to ${
              !group.isPrivate ? "Private" : "Public"
            }.`
          );
        })
        .catch((error) => {
          console.error("Error updating group privacy: ", error);
        });
    } else {
      alert("Only the admin can update the group privacy.");
    }
  };

  const deleteGroup = (group) => {
    if (user && Object.keys(group.admin)[0] === user.uid) {
      const db = getDatabase();
      const groupRef = ref(db, `groups/${group.id}`);

      remove(groupRef)
        .then(() => {
          alert("Group deleted successfully.");
          setGroupsData(groupsData.filter((g) => g.id !== group.id));
        })
        .catch((error) => {
          console.error("Error deleting group: ", error);
        });
    } else {
      alert("Only the admin can delete the group.");
    }
  };

  const filteredGroups = groupsData.filter((group) => {
    const matchesSearchTerm = group.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion = !selectedRegion || group.region === selectedRegion;
    return matchesSearchTerm && matchesRegion;
  });

  const enrolledGroups = filteredGroups.filter((group) => {
    return (
      group.members &&
      Object.values(group.members).some((member) => member.id === user?.uid)
    );
  });

  const groupedByRegion = (
    activeTab === "all" ? filteredGroups : enrolledGroups
  ).reduce((acc, group) => {
    const { region } = group;
    if (!acc[region]) acc[region] = [];
    acc[region].push(group);
    return acc;
  }, {});

  const toggleMenu = (groupId) => {
    setMenuOpen((prev) => (prev === groupId ? null : groupId));
  };

  return (
    <div className="group-container">
      {loading ? (
        <Loader />
      ) : (
        <>
          {user && !user?.documentVerified ? (
            <button
              onClick={() => navigate("/doucmentupload")}
              className="add-group-button"
            >
              Verification
            </button>
          ) : (
            <></>
          )}
          <div className="tabs">
            <button
              onClick={() => setActiveTab("all")}
              className={activeTab !== "all" ? "active" : "tab-button"}
            >
              All Groups
            </button>
            <button
              onClick={() => setActiveTab("enrolled")}
              className={activeTab !== "enrolled" ? "active" : "tab-button"}
            >
              My Groups
            </button>
          </div>

          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="filter-with-add-group">
            <div className="filter-box">
              <label htmlFor="region-select" className="filter-label">
                Filter by region:
              </label>
              <select
                id="region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="region-select"
              >
                <option value="">All Regions</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Andaman and Nicobar Islands">
                  Andaman and Nicobar Islands
                </option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Dadra and Nagar Haveli and Daman and Diu">
                  Dadra and Nagar Haveli and Daman and Diu
                </option>
                <option value="Lakshadweep">Lakshadweep</option>
                <option value="Delhi">Delhi</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Ladakh">Ladakh</option>
                <option value="Jammu and Kashmir">Jammu and Kashmir</option>
              </select>
            </div>
            <button
              onClick={() => navigate("/add-group")}
              className="add-group-button"
            >
              Add New Group
            </button>
          </div>

          <hr />
          {Object.keys(groupedByRegion).map((region, idx) => (
            <div key={region + idx} className="region-container">
              <h3 className="group-region">{region}</h3>
              <div className="region-groups">
                {groupedByRegion[region].map((group, idx) => {
                  let buttonText = "Join Group";
                  let buttonClass = "join-button";

                  if (group.isPrivate) {
                    buttonText = "Request to Join";
                    buttonClass = "request-sent-button";
                    if (
                      user &&
                      group.members &&
                      Object.keys(group.members).includes(user.uid)
                    ) {
                      buttonText = "Start Chatting";
                      buttonClass = "chat-button";
                    }
                    if (
                      user &&
                      group.requestedUsers &&
                      Object.keys(group.requestedUsers).includes(user.uid)
                    ) {
                      buttonText = "Request Sent";
                      buttonClass = "request-sent-button";
                    }
                    if (
                      user &&
                      group.blockedUsers &&
                      Object.keys(group.blockedUsers).includes(user.uid)
                    ) {
                      buttonText = "You are Blocked";
                      buttonClass = "blocked-button";
                    }
                  } else if (user ) {
                    buttonText = "Start Chatting";
                    buttonClass = "chat-button";
                  }

                  return (
                    <div key={group.id + idx} className="group">
                      <div className="group-icon-container">
                        <img
                          src={group.iconUrl}
                          alt={`${group.name} icon`}
                          className="group-icon"
                        />
                      </div>
                      <div className="group-details">
                        <h4 className="group-name">{group.name}</h4>
                        {/* <p>
                          <strong>Admin:</strong>{" "}
                          {group.admin[Object.keys(group.admin)[0]].name}
                        </p> */}
                        {/* <p>
                        <strong>Members:</strong>
                        {group.members
                          ? Object.values(group.members)
                              .map((member) => member.name)
                              .join(", ")
                          : "None"}
                      </p> */}
                        <p className="group-status">
                          <strong className="group-status">Status:</strong>{" "}
                          <strong className="group-status">{group.isPrivate
                            ? user && group.members[user.uid]
                              ? "Private (Joined)"
                              : "Private"
                            : "Public"}</strong>
                        </p>
                      </div>

                      <div className="group-actions">
                        <button
                          onClick={() => {
                            handleChatOrRequest(group);
                            setLoading(true);
                          }}
                          className={buttonClass}
                        >
                          {buttonText}
                        </button>
                        {user &&
                          activeTab !== "all" &&
                          Object.keys(group.admin)[0] === user.uid && (
                            <div className="more-options">
                              <FiMoreVertical
                                className="three-dots"
                                onClick={() => toggleMenu(group.id)}
                              />
                              {menuOpen === group.id && (
                                <div className="options-menu">
                                  <button onClick={() => toggleMenu(null)}>
                                    Close Menu
                                  </button>
                                  <button
                                    onClick={() => toggleGroupPrivacy(group)}
                                  >
                                    {group.isPrivate
                                      ? "Make Public"
                                      : "Make Private"}
                                  </button>
                                  <button onClick={() => deleteGroup(group)}>
                                    Delete Group
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default GroupsList;




// import React, { useState, useEffect, useContext } from "react";
// import { getDatabase, ref, onValue, set, remove } from "firebase/database";
// import { UserContext } from "../../context/UserContext";
// import Loader from "../Loader/Loader";
// import { FiMoreVertical } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import "./GroupList.css";

// const GroupsList = () => {
//   const { user } = useContext(UserContext);
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRegion, setSelectedRegion] = useState("");
//   const [newGroup, setNewGroup] = useState({
//     name: "",
//     admin: user ? { name: user.displayName, id: user.uid } : null,
//     members: "",
//     isPrivate: false,
//     region: "",
//     budgetPreference: "", 
//     timePreference: "", 
//     peopleGroupPreference: "", 
//     durationOfTravel: "", 
//     groupDescription: "",
//     gearRequirements: "", 
//     siteDescription: "", 
//   });
//   const [groupsData, setGroupsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("all");
//   const [menuOpen, setMenuOpen] = useState(null);


//   useEffect(() => {
//     const db = getDatabase();
//     const groupsRef = ref(db, "groups/");

//     const unsubscribe = onValue(
//       groupsRef,
//       (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           const fetchedGroups = Object.keys(data).map((groupKey) => ({
//             ...data[groupKey],
//             id: groupKey,
//           }));

//           setGroupsData(fetchedGroups);
//         } else {
//           console.log("No groups found.");
//         }
//         setLoading(false);
//       },
//       (error) => {
//         console.error("Error fetching groups: ", error);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     if (newGroup.name && newGroup.region) {
//       const handleNavigation = () => {
//         if (newGroup.name) {
//           window.open(`group/${newGroup.id}`);
//         }
//       };
//       handleNavigation();
//     }
//   }, [newGroup]);



//   const handleChatOrRequest = (group) => {
//     if (!user) {
//       alert("Please login to join groups.");
//       return;
//     }

//     if (user.documentVerified === false) {
//       alert("Please Verified yourself to join groups.");
//       return;
//     }

//     const adminId = Object.keys(group.admin)[0]; // Get the admin ID
//     const adminName = group.admin[adminId].name; // Get the admin's name

//     // Check if the user is blocked
//     if (group.blockedUsers && group.blockedUsers[user.uid]) {
//       alert("You are blocked from joining this group.");
//       return;
//     }

//     if (group.isPrivate) {
//       // Check if the user is already a member or is the admin
//       if ((group.members && group.members[user.uid]) || adminId === user.uid) {
//         setNewGroup(group); // Set new group for navigation
//       } else {
//         const db = getDatabase();
//         const requestedUsersRef = ref(
//           db,
//           `groups/${group.id}/requestedUsers/${user.uid}`
//         );

//         set(requestedUsersRef, {
//           requesterName: user.displayName,
//           requesterUid: user.uid,
//           requesterPhoto: user.photoURL,
//           timestamp: new Date().toISOString(),
//         })
//           .then(() => {
//             alert(`Request to join sent to admin: ${adminName}`);
//           })
//           .catch((error) => {
//             console.error("Error sending request: ", error);
//           })
//           .finally(() => {
//             console.log("running for stop");
//             setLoading(false);
//           });
//       }
//     } else {
//       // For public groups, add the user as a member directly
//       const db = getDatabase();
//       const membersRef = ref(db, `groups/${group.id}/members/${user.uid}`);

//       set(membersRef, {
//         name: user.displayName,
//         id: user.uid,
//       })
//         .then(() => {
//           alert(`You have joined the group: ${group.name}`);
//           setNewGroup(group); // Set new group for navigation
//         })
//         .catch((error) => {
//           console.error("Error joining group: ", error);
//         })
//         .finally(() => {
//           console.log("running for stop");
//           setLoading(false);
//         });
//     }
//   };

//   const toggleGroupPrivacy = (group) => {
//     if (user && Object.keys(group.admin)[0] === user.uid) {
//       const db = getDatabase();
//       const groupRef = ref(db, `groups/${group.id}`);

//       set(groupRef, {
//         ...group,
//         isPrivate: !group.isPrivate,
//       })
//         .then(() => {
//           alert(
//             `Group privacy updated to ${
//               !group.isPrivate ? "Private" : "Public"
//             }.`
//           );
//         })
//         .catch((error) => {
//           console.error("Error updating group privacy: ", error);
//         });
//     } else {
//       alert("Only the admin can update the group privacy.");
//     }
//   };

//   const deleteGroup = (group) => {
//     if (user && Object.keys(group.admin)[0] === user.uid) {
//       const db = getDatabase();
//       const groupRef = ref(db, `groups/${group.id}`);

//       remove(groupRef)
//         .then(() => {
//           alert("Group deleted successfully.");
//           setGroupsData(groupsData.filter((g) => g.id !== group.id));
//         })
//         .catch((error) => {
//           console.error("Error deleting group: ", error);
//         });
//     } else {
//       alert("Only the admin can delete the group.");
//     }
//   };

//   const filteredGroups = groupsData.filter((group) => {
//     const matchesSearchTerm = group.name
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesRegion = !selectedRegion || group.region === selectedRegion;
//     return matchesSearchTerm && matchesRegion;
//   });

//   const enrolledGroups = filteredGroups.filter((group) => {
//     return (
//       group.members &&
//       Object.values(group.members).some((member) => member.id === user?.uid)
//     );
//   });

//   const groupedByRegion = (
//     activeTab === "all" ? filteredGroups : enrolledGroups
//   ).reduce((acc, group) => {
//     const { region } = group;
//     if (!acc[region]) acc[region] = [];
//     acc[region].push(group);
//     return acc;
//   }, {});

//   const toggleMenu = (groupId) => {
//     setMenuOpen((prev) => (prev === groupId ? null : groupId));
//   };

//   return (
//     <div className="group-container">
//       {loading ? (
//         <Loader />
//       ) : (
//         <>
//           {user && !user?.documentVerified ? (
//             <button
//               onClick={() => navigate("/doucmentupload")}
//               className="add-group-button"
//             >
//               Verification
//             </button>
//           ) : (
//             <></>
//           )}
//           <div className="tabs">
//             <button
//               onClick={() => setActiveTab("all")}
//               className={activeTab !== "all" ? "active" : "tab-button"}
//             >
//               All Groups
//             </button>
//             <button
//               onClick={() => setActiveTab("enrolled")}
//               className={activeTab !== "enrolled" ? "active" : "tab-button"}
//             >
//               My Groups
//             </button>
//           </div>

//           <input
//             type="text"
//             placeholder="Search groups..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//           <div className="filter-with-add-group">
//             <div className="filter-box">
//               <label htmlFor="region-select" className="filter-label">
//                 Filter by region:
//               </label>
//               <select
//                 id="region-select"
//                 value={selectedRegion}
//                 onChange={(e) => setSelectedRegion(e.target.value)}
//                 className="region-select"
//               >
//                 {/* options */}
//               </select>
//             </div>
//             <button
//               onClick={() => navigate("/add-group")}
//               className="add-group-button"
//             >
//               Add New Group
//             </button>
//           </div>

//           <hr />
//           {Object.keys(groupedByRegion).map((region, idx) => (
//             <div key={region + idx} className="region-container">
//               <h3 className="group-region">{region}</h3>
//               <div className="region-groups">
//                 {groupedByRegion[region].map((group, idx) => {
//                   let buttonText = "Join Group";
//                   let buttonClass = "join-button";

//                   // ... (rest of the code remains the same)

//                   return (
//                     <div key={group.id + idx} className="group">
//                       <div className="group-icon-container">
//                         <img
//                           src={group.iconUrl}
//                           alt={`${group.name} icon`}
//                           className="group-icon"
//                         />
//                       </div>
//                       <div className="group-details">
//                         <h4 className="group-name">{group.name}</h4>
//                         {/* <p>
//                           <strong>Admin:</strong>{" "}
//                           {group.admin[Object.keys(group.admin)[0]].name}
//                         </p> */}
//                         {/* <p>
//                         <strong>Members:</strong>
//                         {group.members
//                           ? Object.values(group.members)
//                               .map((member) => member.name)
//                               .join(", ")
//                           : "None"}
//                       </p> */}
//                         <p>
//                           <strong>Status:</strong>{" "}
//                           {group.isPrivate
//                             ? user && group.members[user.uid]
//                               ? "Private (Joined)"
//                               : "Private"
//                             : "Public"}
//                         </p>
//                         <p>
//                           <strong>Budget Preference:</strong>{" "}
//                           {group.budgetPreference}
//                         </p>
//                         <p>
//                           <strong>Time Preference:</strong>{" "}
//                           {group.timePreference}
//                         </p>
//                         <p>
//                           <strong>People Group Preference:</strong>{" "}
//                           {group.peopleGroupPreference}
//                         </p>
//                         <p>
//                           <strong>Duration of Travel:</strong>{" "}
//                           {group.durationOfTravel}
//                         </p>
//                         <p>
//                           <strong>Group Description:</strong>{" "}
//                           {group.groupDescription}
//                         </p>
//                         <p>
//                           <strong>Gear Requirements:</strong>{" "}
//                           {group.gearRequirements}
//                         </p>
//                         <p>
//                           <strong>Site Description:</strong>{" "}
//                           {group.siteDescription}
//                         </p>
//                       </div>

//                       <div className="group-actions">
//                         <button
//                           onClick={() => {
//                             handleChatOrRequest(group);
//                             setLoading(true);
//                           }}
//                           className={buttonClass}
//                         >
//                           {buttonText}
//                         </button>
//                         {user &&
//                           activeTab !== "all" &&
//                           Object.keys(group.admin)[0] === user.uid && (
//                             <div className="more-options">
//                               <FiMoreVertical
//                                 className="three-dots"
//                                 onClick={() => toggleMenu(group.id)}
//                               />
//                               {menuOpen === group.id && (
//                                 <div className="options-menu">
//                                   <button onClick={() => toggleMenu(null)}>
//                                     Close Menu
//                                   </button>
//                                   <button
//                                     onClick={() => toggleGroupPrivacy(group)}
//                                   >
//                                     {group.isPrivate
//                                       ? "Make Public"
//                                       : "Make Private"}
//                                   </button>
//                                   <button onClick={() => deleteGroup(group)}>
//                                     Delete Group
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           )}
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// };

// export default GroupsList;