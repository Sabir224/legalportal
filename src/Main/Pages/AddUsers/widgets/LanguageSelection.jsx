import { useState, useRef, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';

// WhatsApp supported languages (filtered from ISO)
const supportedLanguages = [
  'English (US)',
  'Arabic',
  'Spanish',
  'Spanish (ARG)',
  'Spanish (SPA)',
  'Spanish (MEX)',
  'French',
  'German',
  'Italian',
  'Portuguese (BR)',
  'Portuguese (POR)',
  'Russian',
  'Turkish',
  'Urdu',
  'Hindi',
  'Indonesian',
  'Malay',
  'Bengali',
  'Tamil',
  'Telugu',
  'Thai',
  'Vietnamese',
  'Chinese (Simplified)',
  'Chinese (Traditional)',
];

const LanguageDropdown = ({ selectedLanguages, setSelectedLanguages }) => {
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const dropdownRef = useRef(null);

  // Convert string → array
  const selectedArray = selectedLanguages ? selectedLanguages.split(',').map((s) => s.trim()) : [];

  const handleSelect = (langName) => {
    const isSelected = selectedArray.includes(langName);

    let updated;
    if (isSelected) {
      updated = selectedArray.filter((l) => l !== langName);
    } else if (selectedArray.length < 3) {
      updated = [...selectedArray, langName];
    } else {
      updated = [...selectedArray];
    }

    setSelectedLanguages(updated.join(', '));
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev === supportedLanguages.length - 1 ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev === 0 ? supportedLanguages.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelect(supportedLanguages[highlightIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="position-relative w-100" ref={dropdownRef} tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Dropdown button */}
      <button
        type="button"
        className="form-control text-start d-flex align-items-center justify-content-between py-2 px-3"
        style={{
          cursor: 'pointer',
          border: '1px solid #d3b386',
          borderRadius: '6px',
          backgroundColor: 'white',
          minHeight: '42px',
          fontSize: '0.95rem',
        }}
        onClick={() => setOpen(!open)}
      >
        <span>{selectedArray.length > 0 ? selectedArray.join(', ') : 'Select up to 3 languages'}</span>
        <FaChevronDown className={`transition-all fs-6 ${open ? 'rotate-180' : ''}`} style={{ color: '#18273e' }} />
      </button>

      {/* Dropdown list */}
      {open && (
        <ul
          className="list-group position-absolute w-100 mt-1 shadow-sm"
          style={{
            zIndex: 1050, // ensure it stays above button & other elements
            border: '1px solid #d3b386',
            borderRadius: '6px',
            maxHeight: '200px',
            overflowY: 'auto',
            backgroundColor: 'white', // force white background
          }}
        >
          {supportedLanguages.map((langName, index) => {
            const isSelected = selectedArray.includes(langName);
            const isDisabled = selectedArray.length >= 3 && !isSelected;
            const isHighlighted = index === highlightIndex;

            return (
              <li
                key={langName}
                className="list-group-item list-group-item-action px-3 py-2 d-flex justify-content-between align-items-center"
                style={{
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  backgroundColor: isSelected ? '#F8D4A1' : isHighlighted ? '#f5e9d9' : 'white',
                  fontSize: '0.95rem',
                  opacity: isDisabled ? 0.6 : 1,
                  border: 'none', // remove default borders
                  borderBottom: '1px solid #f0f0f0',
                }}
                onClick={() => !isDisabled && handleSelect(langName)}
              >
                <span>{langName}</span>
                {isSelected && <span style={{ color: '#18273e', fontWeight: 'bold' }}>✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default LanguageDropdown;
