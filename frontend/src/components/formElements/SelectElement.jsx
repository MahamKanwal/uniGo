import React, { useState, useRef, useEffect } from "react";
import { snakeCaseToTitle } from "../../utils/helperFunction";

const SelectElement = ({
  label,
  name,
  icon,
  options = [],
  handleChange, // for forms like react-hook-form
  onChange,     // optional parent callback
  handleBlur,
  value,
  error,
  searchable = true,
  searchPlaceholder = "Search...",
  noOptionsMessage = "No options found",
}) => {
  const fieldName = label || snakeCaseToTitle(name);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const selectRef = useRef(null);
  const searchRef = useRef(null);

  // Update filtered options when search term or options change
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) => {
        const optionText = typeof option === "string" ? option : (option.name || option.label || option.value);
        return optionText.toLowerCase().includes(searchTerm.toLowerCase());
      });
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      setTimeout(() => searchRef.current.focus(), 100);
    }
  }, [isOpen, searchable]);

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearchTerm("");
  };

  const handleOptionSelect = (optionValue) => {
    const mockEvent = {
      target: {
        name,
        value: optionValue,
      },
    };

    if (handleChange) handleChange(mockEvent);
    if (onChange) onChange(mockEvent);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const getDisplayValue = () => {
    if (!value) return "";
    
    // Find the selected option
    const selectedOption = options.find((option) => {
      if (typeof option === "string") {
        return option === value;
      } else {
        return option.value === value || option.name === value || option.label === value;
      }
    });
    
    if (!selectedOption) return value;
    
    // Extract display text
    if (typeof selectedOption === "string") {
      return selectedOption;
    } else {
      return selectedOption.name || selectedOption.label || selectedOption.value || "";
    }
  };

  // Helper to get option text for display
  const getOptionText = (option) => {
    if (typeof option === "string") return option;
    return option.name || option.label || option.value || "";
  };

  // Helper to get option value
  const getOptionValue = (option) => {
    if (typeof option === "string") return option;
    return option.value || option.name || "";
  };

  return (
    <div className="flex flex-col relative" ref={selectRef}>
      <label className="flex items-center gap-2 text-gray-700 font-medium">
        {icon} {fieldName}
      </label>

      {/* Custom Select Button */}
      <button
        type="button"
        onClick={handleSelectClick}
        onBlur={handleBlur}
        className={`mt-1 py-2 px-3 border bg-white text-left ${
          error
            ? "border-red-700 focus:ring-red-500"
            : "border-blue-800 focus:ring-blue-500"
        } rounded-lg w-full focus:ring-1 focus:outline-none ${
          !value ? "text-gray-500" : "text-gray-900"
        }`}
      >
        {value ? getDisplayValue() : `Select ${fieldName}`}
        <span className="float-right transform transition-transform duration-200">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Hidden Native Select for form submission */}
      <select
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="hidden"
        required
      >
        <option value="">Select {fieldName}</option>
        {options.map((option, index) => {
          const optionValue = getOptionValue(option);
          const optionText = getOptionText(option);
          return (
            <option key={optionValue || index} value={optionValue}>
              {optionText}
            </option>
          );
        })}
      </select>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-800 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const optionValue = getOptionValue(option);
                const optionText = getOptionText(option);

                return (
                  <button
                    key={optionValue || index}
                    type="button"
                    onClick={() => handleOptionSelect(optionValue)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 ${
                      value === optionValue ? "bg-blue-100 text-blue-700" : "text-gray-700"
                    } ${index !== filteredOptions.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    {optionText}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                {noOptionsMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="text-red-700 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default SelectElement;