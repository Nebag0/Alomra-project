import React, { useState, useRef, useEffect } from "react";

export default function DropdownMultiSelect({ options, value, onChange, placeholder = "Choisir...", labelKey = "nom", valueKey = "id" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setOpen((o) => !o)}
      >
        {value.length === 0
          ? <span className="text-gray-400">{placeholder}</span>
          : options.filter(opt => value.includes(opt[valueKey])).map(opt => opt[labelKey]).join(", ")}
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((opt) => (
            <label key={opt[valueKey]} className="flex items-center px-3 py-2 hover:bg-indigo-50 cursor-pointer">
              <input
                type="checkbox"
                checked={value.includes(opt[valueKey])}
                onChange={() => handleSelect(opt[valueKey])}
                className="mr-2"
              />
              {opt[labelKey]}
            </label>
          ))}
        </div>
      )}
    </div>
  );
} 