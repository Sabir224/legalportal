// import React, { useState, useRef, useEffect } from 'react';
// import { BsCheck2, BsCheck2All, BsClock } from 'react-icons/bs';
// import { FaWindowClose, FaExclamationCircle } from 'react-icons/fa';

// const RenderStatusIcon = ({ status, message, id, type, blockScroll, unblockScroll }) => {
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [popupPosition, setPopupPosition] = useState({ top: 0, left: '70%', direction: 'down' });
//   const iconRef = useRef(null);
//   const popupRef = useRef(null);

//   const handleIconClick = () => {
//     if (iconRef.current) {
//       const rect = iconRef.current.getBoundingClientRect();
//       const middleOfViewport = window.innerHeight / 2;
//       const isAboveMid = rect.top < middleOfViewport;

//       setPopupPosition({
//         top: isAboveMid ? rect.bottom : rect.top - 120,
//         left: rect.right,
//         direction: isAboveMid ? 'down' : 'up',
//       });
//     }
//     blockScroll();
//     setIsPopupVisible(true);
//   };

//   const handleClosePopup = () => {
//     setIsPopupVisible(false);
//     unblockScroll();
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       if (isPopupVisible) {
//         handleClosePopup();
//       }
//     };

//     if (isPopupVisible) {
//       document.body.style.overflow = 'hidden';
//       document.addEventListener('mousedown', handleClickOutside);
//       window.addEventListener('scroll', handleScroll, { passive: true });
//     } else {
//       document.body.style.overflow = 'auto';
//       document.removeEventListener('mousedown', handleClickOutside);
//       window.removeEventListener('scroll', handleScroll);
//     }

//     return () => {
//       document.body.style.overflow = 'auto';
//       document.removeEventListener('mousedown', handleClickOutside);
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, [isPopupVisible]);

//   const handleClickOutside = (event) => {
//     if (popupRef.current && !popupRef.current.contains(event.target) && !iconRef.current.contains(event.target)) {
//       handleClosePopup();
//     }
//   };

//   const handleResendMessage = () => {
//     console.log(`Resending ${type} message with ID: ${id} and Text: ${message}`);
//     setTimeout(() => {
//       alert(`Message of type "${type}" resent successfully!`);
//       handleClosePopup();
//     });
//   };

//   const iconStyle = { fontSize: '17px', verticalAlign: 'bottom', cursor: 'pointer' };

//   return (
//     <div>
//       <div ref={iconRef} onClick={handleIconClick} style={{ display: 'inline-block' }}>
//         {status === 'sent' && <BsCheck2 style={{ ...iconStyle, color: '#A6A6A6' }} title="Sent" />}
//         {status === 'delivered' && <BsCheck2All style={{ ...iconStyle, color: '#A6A6A6' }} title="Delivered" />}
//         {status === 'read' && <BsCheck2All style={{ ...iconStyle, color: '#34B7F1' }} title="Read" />}
//         {status === 'failed' && <FaExclamationCircle style={{ ...iconStyle, color: 'red' }} title="Failed" />}
//         {status === 'pending' && <BsClock style={{ ...iconStyle, color: '#A6A6A6' }} title="Pending" />}
//       </div>

//       {isPopupVisible && (
//         <div
//           ref={popupRef}
//           className="popup-content"
//           style={{
//             position: 'fixed',
//             top: popupPosition.direction === 'down' ? popupPosition.top + window.scrollY : undefined,
//             bottom: popupPosition.direction === 'up' ? window.innerHeight - 800 : undefined,
//             left: '80%',
//             zIndex: 1000,
//             backgroundColor: '#A66CFF',
//             boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
//             borderRadius: '8px',
//             padding: '20px',
//             width: '15%',
//             color: 'white',
//           }}
//         >
//           <FaWindowClose
//             onClick={handleClosePopup}
//             style={{
//               cursor: 'pointer',
//               position: 'absolute',
//               top: 5,
//               right: 5,
//               color: 'rgb(255, 118, 64)',
//               fontSize: '20px',
//             }}
//           />
//           <div>
//             <h1 style={{ color: 'black', fontSize: '20px', textAlign: 'left' }}>Message Details</h1>
//             <p style={{ textAlign: 'left' }}>
//               <strong style={{ color: 'black' }}>Message:</strong> {message}
//             </p>
//             <p style={{ textAlign: 'left' }}>
//               <strong style={{ color: 'black' }}>ID:</strong> {id}
//             </p>
//           </div>
//           <div style={{ paddingTop: '10px' }}>
//             <button
//               onClick={handleResendMessage}
//               style={{
//                 backgroundColor: '#25D366',
//                 color: 'white',
//                 padding: '10px 20px',
//                 fontSize: '16px',
//                 border: 'none',
//                 borderRadius: '5px',
//                 cursor: 'pointer',
//                 fontWeight: 'bold',
//               }}
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RenderStatusIcon;

import React, { useState, useRef, useEffect } from "react";
import { BsCheck2, BsCheck2All, BsClock } from "react-icons/bs";
import { FaWindowClose, FaExclamationCircle } from "react-icons/fa";

const RenderStatusIcon = ({ status }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: "70%",
    direction: "down",
  });
  const iconRef = useRef(null);
  const popupRef = useRef(null);

  const blockScroll = () => {
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  };

  const unblockScroll = () => {
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";
  };

  const handleIconClick = () => {
    if (iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      const middleOfViewport = window.innerHeight / 2;
      const isAboveMid = rect.top < middleOfViewport;

      setPopupPosition({
        top: isAboveMid ? rect.bottom : rect.top - 120,
        left: rect.left,
        direction: isAboveMid ? "down" : "up",
      });
    }
    blockScroll();
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    unblockScroll();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isPopupVisible) {
        handleClosePopup();
      }
    };

    if (isPopupVisible) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, { passive: true });
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    }

    return () => {
      unblockScroll();
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isPopupVisible]);

  const handleClickOutside = (event) => {
    if (
      popupRef.current &&
      !popupRef.current.contains(event.target) &&
      !iconRef.current.contains(event.target)
    ) {
      handleClosePopup();
    }
  };

  // Helper function to truncate the message if it has more than 10 words

  const iconStyle = {
    verticalAlign: "bottom",
    cursor: "pointer",
    marginBottom: "3px",
  };

  return (
    <div>
      <div
        ref={iconRef}
        onClick={handleIconClick}
        style={{ display: "inline-block" }}
      >
        {status === "sent" && (
          <BsCheck2
            size={11}
            style={{ ...iconStyle, color: "#A6A6A6" }}
            title="Sent"
          />
        )}
        {status === "delivered" && (
          <BsCheck2All
            size={11}
            style={{ ...iconStyle, color: "#A6A6A6" }}
            title="Delivered"
          />
        )}
        {status === "read" && (
          <BsCheck2All
            size={12}
            style={{ ...iconStyle, color: "#34B7F1" }}
            title="Read"
          />
        )}
        {status === "failed" && (
          <FaExclamationCircle
            size={12}
            style={{ ...iconStyle, color: "red" }}
            title="Failed"
          />
        )}
        {status === "pending" && (
          <BsClock
            size={11}
            style={{ ...iconStyle, color: "#A6A6A6" }}
            title="Pending"
          />
        )}
      </div>

      {/* {isPopupVisible && (
        <div
          ref={popupRef}
          className="popup-content"
          style={{
            position: 'fixed',
            top: popupPosition.direction === 'down' ? popupPosition.top + window.scrollY : undefined,
            bottom: popupPosition.direction === 'up' ? window.innerHeight - 800 : undefined,
            left: '80%',
            zIndex: 1000,
            backgroundColor: '#A66CFF',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            width: '15%',
            color: 'white',
            padding:'10px',
         
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0', // Remove any padding
              margin: '0', // Remove any margin
            }}
          >
            <h1
              style={{
                color: 'black',
                fontSize: '18px',
                margin: '0', // Remove any margin
                padding: '0', // Remove any padding
              }}
            >
              Message Details
            </h1>
            <FaWindowClose
              onClick={handleClosePopup}
              style={{
                cursor: 'pointer',
                color: 'rgb(255, 118, 64)',
                fontSize: '18px',
                margin: '0', // Ensure no additional spacing
                padding: '0', // Ensure no additional spacing
              }}
            />
          </div>

          <div>
            <p style={{ textAlign: 'left', margin: '0', padding: '0' }}>
              <strong style={{ color: 'black' }}></strong> {getTruncatedMessage()}
            </p>
          </div>
          <div style={{ paddingTop: '10px' }}>
            <button
              onClick={handleResendMessage}
              style={{
                backgroundColor: '#25D366',
                color: 'white',
                padding: '10px 20px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default RenderStatusIcon;
