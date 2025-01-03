import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Case_details.css';

import Sidebar from './Sidebar';
import NotificationBar from './NotificationBar';
import LawyerDetails from './LawyerDetails';
import CaseDetails from './CaseDetails';

function Case_details() {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="col">
          {/* Notification Bar */}
          <NotificationBar />

          {/* Main Sections */}
          <div className="row mt-3">
            {/* Lawyer Details */}
            <div className="col-md-3">
              <LawyerDetails />
            </div>

            {/* Case Details */}
            <div className="col-md-9">
              <CaseDetails />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Case_details;
