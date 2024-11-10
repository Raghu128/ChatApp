// // import React, { useState, useContext } from "react";
// // import { getDatabase, ref, set } from "firebase/database";
// // import { UserContext } from "../../context/UserContext";
// // import { useNavigate } from "react-router-dom";
// // import Loader from "../Loader/Loader";
// // import './AddGroup.css'

// // const AddGroup = () => {
// //   const { user } = useContext(UserContext);
// //   const [loading, setLoading] = useState(false);
// //   const navigate = useNavigate();
// //   const [newGroup, setNewGroup] = useState({
// //     name: "",
// //     isPrivate: false,
// //     members: "",
// //     region: "",
// //   });

// //   const handleGroupChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setNewGroup({
// //       ...newGroup,
// //       [name]: type === "checkbox" ? checked : value,
// //     });
// //   };

// //   const addGroup = async () => {
// //     if (user == null) {
// //       alert("Please login to add groups.");
// //       return;
// //     }
// //     if (newGroup.name && newGroup.region) {
// //       const db = getDatabase();

// //       // Generate a unique ID for the group
// //       const groupId = `group_${Date.now()}`;

// //       const groupsRef = ref(db, `groups/${groupId}`);

// //       // Create members object including the user
// //       const membersObj = {
// //         [user.uid]: {
// //           name: user.displayName,
// //           id: user.uid,
// //         },
// //       };
// //       if (newGroup.members) {
// //         newGroup.members.split(",").forEach((member) => {
// //           const trimmedMember = member.trim();
// //           if (trimmedMember) {
// //             membersObj[trimmedMember] = {
// //               name: trimmedMember,
// //               id: trimmedMember, // Assuming member name is used as ID, adjust if needed
// //             };
// //           }
// //         });
// //       }

// //       // Create admin object
// //       const adminObj = {
// //         [user.uid]: {
// //           name: user.displayName,
// //           id: user.uid,
// //         },
// //       };

// //       const groupToAdd = {
// //         id: groupId, // Include the unique ID
// //         name: newGroup.name,
// //         admin: adminObj,
// //         messages: {}, // Initialize with empty messages
// //         members: membersObj,
// //         isPrivate: newGroup.isPrivate,
// //         region: newGroup.region,
// //         blockedUsers: {},
// //         requestedUsers: {},
// //       };

// //       try {
// //         await set(groupsRef, groupToAdd);
// //         alert("Group added successfully.");
// //         navigate("/"); // Navigate to home page or relevant route
// //       } catch (error) {
// //         alert("Error adding group: " + error.message);
// //       } finally {
// //         setLoading(false); // Ensure loading is stopped after the operation
// //       }

// //       // Reset form fields
// //       setNewGroup({
// //         name: "",
// //         isPrivate: false,
// //         members: "",
// //         region: "",
// //       });
// //     } else {
// //       alert("Please provide both group name and region.");
// //     }
// //   };

// //   const handleAddGroupClick = () => {
// //     setLoading(true);
// //     addGroup();
// //   };

// //   if (loading) return <Loader />;

// //   return (
// //     <div className="new-group">
// //       <h2>Add a New Group</h2>
// //       <input
// //         type="text"
// //         name="name"
// //         value={newGroup.name}
// //         onChange={handleGroupChange}
// //         placeholder="Group Name"
// //       />
// //       <input
// //         type="text"
// //         name="members"
// //         value={newGroup.members}
// //         onChange={handleGroupChange}
// //         placeholder="Add members (comma separated)"
// //       />
// //       <select
// //         name="region"
// //         value={newGroup.region}
// //         onChange={handleGroupChange}
// //       >
// //         <option value="">Select Region</option>
// //         <option value="Himachal Pradesh">Himachal Pradesh</option>
// //         <option value="Rajasthan">Rajasthan</option>
// //         <option value="Uttarakhand">Uttarakhand</option>
// //         {/* Add other regions */}
// //       </select>
// //       <label>
// //         <input
// //           type="checkbox"
// //           name="isPrivate"
// //           checked={newGroup.isPrivate}
// //           onChange={handleGroupChange}
// //         />
// //         Private
// //       </label>
// //       <button onClick={handleAddGroupClick}>
// //         Add Group
// //       </button>
// //     </div>
// //   );
// // };

// // export default AddGroup;

// import React, { useState, useContext } from "react";
// import { getDatabase, ref, set } from "firebase/database";
// import { UserContext } from "../../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import Loader from "../Loader/Loader";
// import "./AddGroup.css";

// const AddGroup = () => {
//   const { user } = useContext(UserContext);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const [newGroup, setNewGroup] = useState({
//     name: "",
//     isPrivate: false,
//     members: "",
//     region: "",
//     iconUrl: "", // New field for group icon
//   });

//   const defaultIconUrl =
//     "https://lh5.googleusercontent.com/p/AF1QipNMMcmETi8sDiANcHtNfFb2iTHmbNSNyW3qSTOB=w1080-h624-n-k-no";

//   const handleGroupChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewGroup({
//       ...newGroup,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const addGroup = async () => {
//     if (user == null) {
//       alert("Please login to add groups.");
//       return;
//     }
//     if (newGroup.name && newGroup.region) {
//       const db = getDatabase();

//       // Generate a unique ID for the group
//       const groupId = `group_${Date.now()}`;

//       const groupsRef = ref(db, `groups/${groupId}`);

//       // Create members object including the user
//       const membersObj = {
//         [user.uid]: {
//           name: user.displayName,
//           id: user.uid,
//         },
//       };
//       if (newGroup.members) {
//         newGroup.members.split(",").forEach((member) => {
//           const trimmedMember = member.trim();
//           if (trimmedMember) {
//             membersObj[trimmedMember] = {
//               name: trimmedMember,
//               id: trimmedMember, // Assuming member name is used as ID, adjust if needed
//             };
//           }
//         });
//       }

//       // Create admin object
//       const adminObj = {
//         [user.uid]: {
//           name: user.displayName,
//           id: user.uid,
//         },
//       };

//       const groupToAdd = {
//         id: groupId, // Include the unique ID
//         name: newGroup.name,
//         admin: adminObj,
//         messages: {}, // Initialize with empty messages
//         members: membersObj,
//         isPrivate: newGroup.isPrivate,
//         region: newGroup.region,
//         blockedUsers: {},
//         requestedUsers: {},
//         iconUrl: newGroup.iconUrl || defaultIconUrl, // Set icon or default if not provided
//       };

//       try {
//         await set(groupsRef, groupToAdd);
//         alert("Group added successfully.");
//         navigate("/"); // Navigate to home page or relevant route
//       } catch (error) {
//         alert("Error adding group: " + error.message);
//       } finally {
//         setLoading(false); // Ensure loading is stopped after the operation
//       }

//       // Reset form fields
//       setNewGroup({
//         name: "",
//         isPrivate: false,
//         members: "",
//         region: "",
//         iconUrl: "", // Reset the icon field
//       });
//     } else {
//       alert("Please provide both group name and region.");
//     }
//   };

//   const handleAddGroupClick = () => {
//     setLoading(true);
//     addGroup();
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="new-group">
//       <h2>Create a New Group</h2>
//       <input
//         type="text"
//         name="name"
//         value={newGroup.name}
//         onChange={handleGroupChange}
//         placeholder="Group Name"
//       />
//       <input
//         type="text"
//         name="members"
//         value={newGroup.members}
//         onChange={handleGroupChange}
//         placeholder="Add members (comma separated)"
//       />
//       <select
//         name="region"
//         value={newGroup.region}
//         onChange={handleGroupChange}
//       >
//         <option value="">Select Region</option>
//         <option value="Andhra Pradesh">Andhra Pradesh</option>
//         <option value="Arunachal Pradesh">Arunachal Pradesh</option>
//         <option value="Assam">Assam</option>
//         <option value="Bihar">Bihar</option>
//         <option value="Chhattisgarh">Chhattisgarh</option>
//         <option value="Goa">Goa</option>
//         <option value="Gujarat">Gujarat</option>
//         <option value="Haryana">Haryana</option>
//         <option value="Himachal Pradesh">Himachal Pradesh</option>
//         <option value="Jharkhand">Jharkhand</option>
//         <option value="Karnataka">Karnataka</option>
//         <option value="Kerala">Kerala</option>
//         <option value="Madhya Pradesh">Madhya Pradesh</option>
//         <option value="Maharashtra">Maharashtra</option>
//         <option value="Manipur">Manipur</option>
//         <option value="Meghalaya">Meghalaya</option>
//         <option value="Mizoram">Mizoram</option>
//         <option value="Nagaland">Nagaland</option>
//         <option value="Odisha">Odisha</option>
//         <option value="Punjab">Punjab</option>
//         <option value="Rajasthan">Rajasthan</option>
//         <option value="Sikkim">Sikkim</option>
//         <option value="Tamil Nadu">Tamil Nadu</option>
//         <option value="Telangana">Telangana</option>
//         <option value="Tripura">Tripura</option>
//         <option value="Uttar Pradesh">Uttar Pradesh</option>
//         <option value="Uttarakhand">Uttarakhand</option>
//         <option value="West Bengal">West Bengal</option>
//         <option value="Andaman and Nicobar Islands">
//           Andaman and Nicobar Islands
//         </option>
//         <option value="Chandigarh">Chandigarh</option>
//         <option value="Dadra and Nagar Haveli and Daman and Diu">
//           Dadra and Nagar Haveli and Daman and Diu
//         </option>
//         <option value="Lakshadweep">Lakshadweep</option>
//         <option value="Delhi">Delhi</option>
//         <option value="Puducherry">Puducherry</option>
//         <option value="Ladakh">Ladakh</option>
//         <option value="Jammu and Kashmir">Jammu and Kashmir</option>
//       </select>
//       <input
//         type="text"
//         name="iconUrl"
//         value={newGroup.iconUrl}
//         onChange={handleGroupChange}
//         placeholder="Group Icon URL (optional)"
//       />
//       <label>
//         <input
//           type="checkbox"
//           name="isPrivate"
//           checked={newGroup.isPrivate}
//           onChange={handleGroupChange}
//         />
//         Private
//       </label>
//       <button onClick={handleAddGroupClick}>Create</button>
//     </div>
//   );
// };

// export default AddGroup;



import React, { useState, useContext } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";
import "./AddGroup.css";

const AddGroup = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [newGroup, setNewGroup] = useState({
    name: "",
    isPrivate: false,
    members: "",
    region: "",
    iconUrl: "",
    budgetPreference: "",
    durationOfTravel: "",
    groupDescription: "",
    gearRequirements: "",
    siteDescription: "",
  });
  
  const handleGroupChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setNewGroup({ ...newGroup, [name]: checked });
    } else {
      setNewGroup({ ...newGroup, [name]: value });
    }
  };
  
  const defaultIconUrl =
    "https://lh5.googleusercontent.com/p/AF1QipNMMcmETi8sDiANcHtNfFb2iTHmbNSNyW3qSTOB=w1080-h624-n-k-no";
  const addGroup = async () => {
    if (user == null) {
      alert("Please login to add groups.");
      return;
    }
    if (newGroup.name && newGroup.region) {
      const db = getDatabase();

      // Generate a unique ID for the group
      const groupId = `group_${Date.now()}`;

      const groupsRef = ref(db, `groups/${groupId}`);

      // Create members object including the user
      const membersObj = {
        [user.uid]: {
          name: user.displayName,
          id: user.uid,
        },
      };
      if (newGroup.members) {
        newGroup.members.split(",").forEach((member) => {
          const trimmedMember = member.trim();
          if (trimmedMember) {
            membersObj[trimmedMember] = {
              name: trimmedMember,
              id: trimmedMember, // Assuming member name is used as ID, adjust if needed
            };
          }
        });
      }
      
      // Create admin object
      const adminObj = {
        [user.uid]: {
          name: user.displayName,
          id: user.uid,
          photoURL: user.photoURL,
        },
      };

      const groupToAdd = {
        id: groupId, // Include the unique ID
        name: newGroup.name,
        admin: adminObj,
        messages: {}, // Initialize with empty messages
        members: membersObj,
        isPrivate: newGroup.isPrivate,
        region: newGroup.region,
        blockedUsers: {},
        requestedUsers: {},
        iconUrl: newGroup.iconUrl || defaultIconUrl, // Set icon or default if not provided
        budgetPreference: newGroup.budgetPreference,      
        durationOfTravel: newGroup.durationOfTravel,
        groupDescription: newGroup.groupDescription,
        gearRequirements: newGroup.gearRequirements,
        siteDescription: newGroup.siteDescription,
      };

      try {
        await set(groupsRef, groupToAdd);
        alert("Group added successfully.");
        navigate("/home"); // Navigate to home page or relevant route
      } catch (error) {
        alert("Error adding group: " + error.message);
      } finally {
        setLoading(false); // Ensure loading is stopped after the operation
      }

      // Reset form fields
      setNewGroup({
        name: "",
        isPrivate: false,
        members: "",
        region: "",
        iconUrl: "", // Reset the icon field
        budgetPreference: "",
        timePreference: "",
        peopleGroupPreference: "",
        durationOfTravel: "",
        groupDescription: "",
        gearRequirements: "",
        siteDescription: "",
      });
    } else {
      alert("Please provide both group name and region.");
    }
  };

  const handleAddGroupClick = () => {
    setLoading(true);
    addGroup();
  };

  if (loading) return <Loader />;

  return (
   <div className="add-group-container">
     <div className="new-group">
      <h2>Create a New Group</h2>
      <input
        type="text"
        name="name"
        value={newGroup.name}
        onChange={handleGroupChange}
        placeholder="Group Name"
      />
      <select
        name="region"
        value={newGroup.region}
        onChange={handleGroupChange}
      >
        <option value="">Select Region</option>
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
        <option value="Dadra and Nagar Haveli">
          Dadra and Nagar Haveli
        </option>
        <option value="Daman and Diu">Daman and Diu</option>
        <option value="Delhi">Delhi</option>
        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
        <option value="Ladakh">Ladakh</option>
        <option value="Lakshadweep">Lakshadweep</option>
        <option value="Puducherry">Puducherry</option>
      </select>
      <input
        type="text"
        name="iconUrl"
        value={newGroup.iconUrl}
        onChange={handleGroupChange}
        placeholder="Group Icon URL"
      />
      <input
        type="text"
        name="budgetPreference"
        value={newGroup.budgetPreference}
        onChange={handleGroupChange}
        placeholder="Budget Preference"
      />
     
      <select
        name="durationOfTravel"
        value={newGroup.durationOfTravel}
        onChange={handleGroupChange}
      >
        <option value="">Select Duration of Travel</option>
        <option value="Summer">1 - 2 weeks</option>
        <option value="Winter">2 - 3 weeks</option>
        <option value="Monsoon">more than 3 weeks</option>
      </select>
      <textarea
        name="groupDescription"
        value={newGroup.groupDescription}
        onChange={handleGroupChange}
        placeholder="Group Description"
      />
      <textarea
        name="gearRequirements"
        value={newGroup.gearRequirements}
        onChange={handleGroupChange}
        placeholder="Gear Requirements"
      />
      <textarea
        name="siteDescription"
        value={newGroup.siteDescription}
        onChange={handleGroupChange}
        placeholder ="Site Description"
      />
      <button onClick={handleAddGroupClick}>Add Group</button>
    </div>
   </div>
  );
};

export default AddGroup;