import React from 'react';

function NotificationBar() {
  return (
    <div className="d-flex justify-content-between align-items-center bg-dark text-light py-2 px-4 " style={{borderRadius:8,margin:5}} >
      <h5>Case Details</h5>
      <div>
        <button className="btn btn-light btn-sm me-2">Notifications</button>
        <button className="btn btn-light btn-sm">Profile</button>
      </div>
    </div>
  );
}

export default NotificationBar;
