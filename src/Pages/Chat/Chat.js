import React, { useEffect } from 'react';
import Title from '../../Components/Title/Title.js';
import ChatContainer from '../../Components/ChatContainer/ChatContainer.js';
import './Chat.css'

const Chat = ({messages, onSendMessage, group, onRemoveMember}) => {

 
  return (<>
    {/* <Title chatMode={true} GroupName={group.name}/> */}
    <ChatContainer
      messages={messages}
      onSendMessage={onSendMessage}
      group={group}
      onRemoveMember={onRemoveMember}
    />
  </>
  );
};

export default Chat;
