import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import Loader from '../../Components/Loader/Loader.js';
import { storage, auth, db } from '../../Utils/firebaseConfig'; // Make sure to import firebase auth and database
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import './UserProfile.css';

const UserProfile = () => {
  const { user, updateUserPhotoURL } = useContext(UserContext); 
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [imageUrl, setImageUrl] = useState(user?.photoURL || '');

  useEffect(() => {
    if (!user) {
      console.log("No user data available");
    }
    else console.log(user);
    
  }, [user]);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!image) {
      setErrorMessage("Please select an image to upload.");
      return;
    }

    setUploading(true);
    setErrorMessage('');

    // Upload image to Firebase storage
    const storageRef = ref(storage, `profilePictures/${user.uid}/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        setErrorMessage("Upload failed: " + error.message);
        setUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);

          // Step 1: Update the photoURL in Firebase Authentication
          await updateProfile(auth.currentUser, { photoURL: downloadURL });

          // Step 2: Update user context with the new photoURL
          updateUserPhotoURL(downloadURL);

          // Step 3: Optionally, update the photoURL in your database if you're storing it separately
          await updateUserInDatabase(user.uid, downloadURL);

          setUploading(false);
          setErrorMessage("Profile picture updated successfully.");
        } catch (error) {
          setErrorMessage("Failed to update profile: " + error.message);
          setUploading(false);
        }
      }
    );
  };

  // Function to update photoURL in your database (Firestore example)
  const updateUserInDatabase = async (userId, photoURL) => {
    try {
      const userRef = db.collection('users').doc(userId); // Firestore reference
      await userRef.update({ photoURL });
      console.log("User photoURL updated in the database.");
    } catch (error) {
      console.error("Error updating user photoURL in the database:", error);
    }
  };

  if (!user) {
    return (
      <div className="loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-info">
          
          <p className="profile-email"><strong>Email:</strong> {user.email}</p>
        </div>

        <div className="profile-picture-container">
          <img
            src={user.photoURL || imageUrl || 'https://example.com/default-profile-pic.jpg'}
            alt={user.displayName || 'Profile'}
            className="profile-picture"
          />
          <h2 className="profile-name">{user.displayName}</h2>
        </div>

        <div className="image-upload-section">
          <input type="file" onChange={handleImageChange} />
          <button onClick={handleUpload} className="upload-button">
            {uploading ? "Uploading..." : "Upload Profile Picture"}
          </button>
          {progress > 0 && <p>Upload progress: {Math.round(progress)}%</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>

        <button className="home-button" onClick={handleHomeClick}>
          Home
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
