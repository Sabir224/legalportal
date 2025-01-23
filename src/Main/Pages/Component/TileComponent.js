import React from 'react';
import { FaTrash } from 'react-icons/fa';
import SheetComponent from './SheetComponent';

const TileComponent = ({ user, isSelected, onSelect, onDelete, onShowDetails }) => {
  const handleShowDetails = () => {
    onShowDetails(user.messages); // Show the details sheet
  };

  return (
    <div className={`userTile ${isSelected ? 'selected' : ''}`}>
      <div className="tileContent" onClick={handleShowDetails}>
       
        <div>Messages</div>
      </div>
      <div className="deleteIcon" onClick={() => onDelete(user.id)}>
        <FaTrash />
      </div>

      {/* Show Messages Sheet */}
      {user.messages && (
        <SheetComponent text={user.messages} onClose={() => onShowDetails(null)} />
      )}
    </div>
  );
};

export default TileComponent;
