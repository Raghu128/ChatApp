import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Header from '../../Components/Header/Header';
import GroupList from '../../Components/GroupList/GroupList.js';
import { UserContext } from '../../context/UserContext.js';
import Footer from '../../Components/Footer/Footer.js'
import './MainLayout.css';

const MainLayout = () => {
  const { user } = useContext(UserContext); 
  // const userName = user ? user.displayName : null;


  return (
    <div className='mainlayout'>
      <Header />
      <GroupList/>
      <Footer/>
    </div>
  );
};

export default MainLayout;
