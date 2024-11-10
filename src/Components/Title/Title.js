import React from 'react';
import './Title.css';

const Title = ({ chatMode, GroupName }) => (
  <div id="title_container" className={chatMode ? 'chat_title_container' : ''}>
    <div id="title_inner_container">
      <h1 id="title" className={chatMode ? 'chat_title' : ''}>{GroupName}</h1>
    </div>
  </div>
);

export default Title;
