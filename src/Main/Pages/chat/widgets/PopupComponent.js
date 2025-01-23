import React from 'react';

const PopupComponent  = ({ id, text, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3 style={{color:'black'}}>Message Details</h3>
        <p><strong>ID:</strong> {id}</p>
        <p><strong>Text:</strong> {text}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default PopupComponent;