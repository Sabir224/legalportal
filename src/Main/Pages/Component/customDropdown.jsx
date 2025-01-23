import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CustomDropdown = ({ selectedTemplate, messageTemplates, handleTemplateChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDeselect = () => {
    handleTemplateChange(null);
  };

  return (
    <div ref={dropdownRef} className="relative justify-content-center d-flex w-full">
      <div
        className="block w-full pl-4 pr-2.5 py-2 text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedTemplate ? `${selectedTemplate.name} - ${selectedTemplate.language}` : 'Select message template'}
        </span>
        <div className="flex items-center">
          {selectedTemplate && (
            <FontAwesomeIcon
              icon={faTimes}
              className="mr-2  cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // Prevents dropdown from opening when deselecting
                handleDeselect();
              }}
              
              style={{
                color:"red",
                fontSize:'12px'
              }}
              
            />
          )}
      <svg
  className={`w-4 h-4 mr-1 text-green-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M19 9l-7 7-7-7"
  />
</svg>


        </div>
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full mt-5 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {messageTemplates && messageTemplates.length > 0 ? (
            messageTemplates.map((template) => (
              <li
                key={template.id}
                className="pl-4 pr-2.5 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  handleTemplateChange(template.id);
                  setIsOpen(false);
                }}
              >
                {template.name} - {template.language}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No templates available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
