import React, { useEffect } from "react";

export default function DropdownSheet({ replyData, onReplySelected, onClose }) {
  useEffect(() => {
    if (replyData) {
      console.log("Dropdown opened with reply:", replyData);
    }
  }, [replyData]);

  const handleSelectReply = () => {
    if (replyData) {
      onReplySelected(replyData); // Notify parent about the reply selection
    }
  };

  return (
    <div className="dropdown-sheet">
      <div className="dropdown-content">
        <h4>Replying to: {replyData.message}</h4>
        <button onClick={handleSelectReply}>Select Reply</button>
        <button onClick={onClose}>Cancel</button>
      </div>
      {/* Close the dropdown when clicking outside */}
      <div className="dropdown-overlay" onClick={onClose}></div>
    </div>
  );
}
