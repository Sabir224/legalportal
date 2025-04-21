import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const ScreenHeader = ({ title, onBack }) => (
  <div className="d-flex align-items-center">
    {onBack && (
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
        }}
      >
        <FaArrowLeft color="white" />
      </button>
    )}
    <span style={{ marginLeft: onBack ? "10px" : 0 }}>{title}</span>
  </div>
);
