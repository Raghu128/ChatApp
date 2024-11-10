import React, { useState } from 'react';
import './JoinForm.css';

const JoinForm = ({ onJoin }) => {
  const [name, setName] = useState('');

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleJoinClick = () => {
    if (name.length > 0) {
      onJoin(name);
    }
  };

  return (
    <div id="join_container">
      <div id="join_inner_container">
        <div id="join_input_container">
          <input
            id="join_input"
            maxLength="15"
            placeholder="No.... It's Patrick Star"
            value={name}
            onChange={handleInputChange}
          />
        </div>
        <div id="join_button_container">
          <button
            id="join_button"
            className={name.length > 0 ? 'enabled' : ''}
            onClick={handleJoinClick}
          >
            Join <i className="fas fa-sign-in-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinForm;
