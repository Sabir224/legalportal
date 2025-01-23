import React, { useState } from 'react';
export const ImageWithHover = ({ defaultSrc, hoverSrc, altText, onClick }) => {
    const [imageSrc, setImageSrc] = useState(defaultSrc);
  
    return (
      <img
        src={imageSrc}
        alt={altText}
        style={{
          height: "20px",
          width: "20px",
          objectFit: "contain",
          transition: "transform 0.3s ease",
          cursor: "pointer"
        }}
        onMouseEnter={() => setImageSrc(hoverSrc)}
        onMouseLeave={() => setImageSrc(defaultSrc)}
        onClick={onClick}
      />
    );
  };