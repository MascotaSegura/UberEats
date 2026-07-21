import React, { useState, useRef, useEffect } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';

const CustomSelect = ({ value, onChange, options, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#F3F4F6] rounded-xl px-4 py-3 text-[15px] text-[#1E1E1E] outline-none hover:bg-[#ECECEE] focus:bg-[#ECECEE] transition-colors flex items-center justify-between"
      >
        <span className={selectedOption ? "text-[#1E1E1E]" : "text-[#8E8E93]"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <CaretDown size={16} weight="bold" className={`text-[#8E8E93] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Required hidden input to satisfy HTML form validation if needed, though we handle submit manually usually */}
      {required && !value && <input type="hidden" required />}

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl p-2 z-[60] animate-fade-in shadow-[0_0_1px_rgba(0,0,0,0.2)] border border-[#F3F4F6] max-h-60 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange({ target: { name: 'category', value: opt.value } });
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors flex items-center justify-between outline-none ${
                    value === opt.value ? 'bg-[#1E1E1E] text-white' : 'text-[#1E1E1E] hover:bg-[#F3F4F6] active:bg-[#ECECEE]'
                  }`}
                >
                  {opt.label}
                  {value === opt.value && <Check size={16} weight="bold" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
