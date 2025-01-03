import React from 'react';

function Sidebar() {
  return (
    <div className="col-1 bg-dark d-flex flex-column align-items-center py-3">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="bg-secondary rounded-circle mb-3"
          style={{ width: '40px', height: '40px' }}
        ></div>
      ))}
    </div>
  );
}

export default Sidebar;
