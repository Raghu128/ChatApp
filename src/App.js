import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login/Login.js';
import MainLayout from './Pages/MainLayout/MainLayout.js';
import './App.css'
import GroupsPage from './Pages/GroupsPage/GroupsPage.js';
import AddGroup from './Components/AddGroup/AddGroup.js';
import PageNotFound from './Pages/PageNotFound/PageNotFound.js';
import UserProfile from './Pages/UserProfile/UserProfile.js';
import DocumentUploader from './Pages/DocumentUploader/DocumentUploader.js';
import FeedPage from './Pages/FeedPage/FeedPage.js';
import HomePage from './Pages/HomePage/HomePage.js';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<MainLayout />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/doucmentupload" element={<DocumentUploader />} />
        <Route path="group/:groupId" element={<GroupsPage />} />
        <Route path="/add-group" element={<AddGroup/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
