import React from 'react';
import Title from '../../Components/Title/Title.js';
import JoinForm from '../../Components/JoinForm/JoinForm.js';

const HomeOfGroup = ({ onJoin, group}) => (
  <>
    <Title chatMode={false} group={group}/>
    {/* <JoinForm onJoin={onJoin} /> */}
  </>
);

export default HomeOfGroup;
