
import React from 'react';

function LawyerDetails() {
  return (
    <div className="p-3 rounded" style={{ background:"#c0a262"}}>
      <h6>Lawyer Details</h6>
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-secondary rounded my-2"
          style={{ height: '40px' }}
        >
            {/* <button  className="bg-secondary rounded my-2"> 
            </button> */}
        </div>
      ))}
      <p className="mt-3">
        Other information regarding the case will be displayed here.
      </p>
    </div>
  );
}

export default LawyerDetails;
