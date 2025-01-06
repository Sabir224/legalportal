import React from "react";
import "./Case_details";

const CaseDetails = () => {
  return (
    // <div className="card-grid1">
    //   <div className="card-grid">
    //     <div className="card SUBJECT-card" style={{}}>
    //       <h2>Subject Line</h2>
    //       <p>Subject line comes here with other details like number, name, etc.</p>
    //     </div>
    //     <div className="card important-points Important-card">
    //       <p>Important points will be mentioned in the grid.</p>
    //     </div>
    //   </div>
    //   <div style={{flexDirection:'row', flex:1}}>
    //     <div className="card small-card" style={{ height: 200, width: 200, marginTop: -50 }}></div>
    //     <div className="card small-card" style={{ height: 200, width: 200, marginTop: -50 }}></div>
    //     <div className="card small-card" style={{ height: 100, width: 200, marginTop: -50 }}></div>
    //   </div>
    // </div>

    <div className="dashboard-container">
      <div className="subject-line" style={{height:200}}>
        <h2>Subject Line</h2>
        <p>Subject line comes here with other details like number, name, etc.</p>
      </div>
      <div className="important-points" style={{height:270}}>
        <p>Important points will be mentioned in the grid.</p>
      </div>
      <div className="grid">
        <div className="grid-item" style={{height:150,marginTop:-70}}>Item 1</div>
        <div className="grid-item"  style={{height:150,marginTop:-70}}>Item 2</div>
        <div className="grid-item">Item 3</div>
      </div>
    </div>
  );
}
export default CaseDetails;
