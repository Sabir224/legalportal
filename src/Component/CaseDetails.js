import React from 'react';

function CaseDetails() {
  return (
    <div className="bg-light p-3 rounded">
      <div className="text-center mb-3">
        <div
          className="bg-dark rounded-circle mx-auto"
          style={{ width: '100px', height: '100px' }}
        ></div>
        <h6 className="mt-3">Subject Line</h6>
      </div>

      <div className="row">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="col-4">
            <div
              className="bg-dark rounded mb-2"
              style={{ height: '50px' }}
            ></div>
          </div>
        ))}
      </div>

      <div className="bg-dark rounded text-light text-center p-2 mt-3">
        Important points will be mentioned in the grid. Remaining points will be
        displayed in the horizontal card below.
      </div>
    </div>
  );
}

export default CaseDetails;
