import React from 'react';
import "./NoteMsg.css";

const NoteMsg = ({setShowNote}) => {

  function handleClose(){
    setShowNote(false);
  }

  return (
    <div className="backdrop">
      <div className="popup">
        <button className="cancel-btn" onClick={handleClose}>
          ✕
        </button>
        <div className="popup-content">
          <h2>Important Note</h2>
          <p>
            This is temporary data. The data will be lost if a new user joins 
            the room. To prevent this, ensure all users join the room 
            before adding any data.
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoteMsg;