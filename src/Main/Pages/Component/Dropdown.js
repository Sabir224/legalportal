import React, { useState } from "react";
import { BsFillArrowDownSquareFill } from "react-icons/bs";
import { FaArrowAltCircleDown } from "react-icons/fa";

const Dropdown = ({ options, onSelect, placeholder = `Select an option` }) => {
    const [selected, setSelected] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        setSelected(option);
        setIsOpen(false);
        onSelect(option);
    };

    return (
        <div style={{ position: "relative", width: "180px" }}>
            {/* Dropdown Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: "#16213e",
                    color: "white",
                    padding: "7px",
                    borderRadius: "5px",
                    border: "1px solid #d4af37",
                    cursor: "pointer",
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between", // Ensures even spacing
                    // Adds space between text and icon
                     width: "180px", // Adjust width as needed
                }}
            >
                <span style={{ flexGrow: 1, textAlign: "center" }}>
                    {selected ? selected?.UserName : placeholder}
                </span>
                <FaArrowAltCircleDown color="#d4af37" style={{marginRight:5}} />
            </div>


            {/* Dropdown List */}
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        width: "180px",
                        background: "#16213e",
                        border: "1px solid #d4af37",
                        borderRadius: "5px",
                        overflow: "hidden",
                        zIndex: 10,
                    }}
                >
                    {options.map((option) => (
                        <div
                            key={option?._id}
                            onClick={() => handleSelect(option)}
                            style={{
                                padding: "10px",
                                color: "white",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "0.3s",
                            }}
                            onMouseEnter={(e) => (e.target.style.background = "#d2a85a")}
                            onMouseLeave={(e) => (e.target.style.background = "#16213e")}
                        >
                            {option?.UserName}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default Dropdown;
