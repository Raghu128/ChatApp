import React, { useState, useContext } from 'react';
import './DocumentUploader.css';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { getDatabase, set, ref as dbRef } from 'firebase/database';
import { UserContext } from '../../context/UserContext';

const DocumentUploader = () => {
  const { user, setUserData} = useContext(UserContext);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const storage = getStorage();
  const db = getDatabase();
  

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    setUploading(true);
    const fileRef = ref(storage, `documents/${file.name}`);
  
    const userRef = dbRef(db, `users/${user.uid}`);
        set(userRef, {
          ...user,
          documentVerified: true,
        });
        
        setUserData({
          ...user,
          documentVerified: true,
        });
  };

  return (
    <div className="document-uploader-container">
      <div className="document-uploader-card">
        {user?.documentVerified ? (
          <div>
            <h1>You are already verified!</h1>
            <p className="success-message">Thank you for verifying your identity.</p>
          </div>
        ) : (
          <>
            <h1>User Verification Page</h1>
            <h1 className="document-title">Upload a document to verify your identity</h1>
            <label className="file-input-label" htmlFor="file-input">
              Choose File
            </label>
            <input
              id="file-input"
              type="file"
              className="file-input"
              onChange={handleFileChange}
            />
            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={uploading || !file}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {uploaded && (
              <p className="success-message">
                File uploaded successfully! You are now verified.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentUploader;
