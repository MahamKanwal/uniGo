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
        const optionText = getOptionDisplayText(option);
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

  // Helper functions for consistent option handling
  const getOptionValue = (option) => {
    if (typeof option === "string") return option;
    return option.value || option.id || "";
  };

  const getOptionDisplayText = (option) => {
    if (typeof option === "string") return option;
    return option.label || option.name || option.value || "";
  };

  const getOptionData = (option) => {
    if (typeof option === "string") {
      return { value: option, label: option };
    }
    return {
      value: option.value || option.id || "",
      label: option.label || option.name || option.value || ""
    };
  };

  const handleSelectClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearchTerm("");
  };

  const handleOptionSelect = (optionValue, optionLabel) => {
    const mockEvent = {
      target: {
        name,
        value: optionValue,
        selectedLabel: optionLabel
      },
    };

    if (handleChange) handleChange(mockEvent);
    if (onChange) onChange(mockEvent);

    // Call handleBlur when an option is selected
    if (handleBlur) {
      handleBlur({
        target: {
          name,
          value: optionValue
        }
      });
    }

    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleSelectBlur = (e) => {
    // Only call handleBlur if the click is outside the select component
    if (!isOpen && handleBlur) {
      handleBlur(e);
    }
  };

  const getDisplayValue = () => {
    if (!value && value !== 0) return "";

    const selectedOption = options.find((option) => {
      const optionData = getOptionData(option);
      return optionData.value == value;
    });

    if (!selectedOption) return "";

    return getOptionDisplayText(selectedOption);
  };

  return (
    <div className="flex flex-col relative" ref={selectRef}>
      <label className="flex items-center gap-2 text-gray-700 font-medium">
        {icon} {fieldName}
      </label>

      {/* Hidden input for Formik to track the value */}
      <input
        type="hidden"
        name={name}
        value={value || ""}
        onChange={() => { }} // dummy onChange to satisfy Formik
        onBlur={handleBlur}
      />

      {/* Custom Select Button */}
      <button
        type="button"
        name={name} // Add name attribute
        onClick={handleSelectClick}
        onBlur={handleSelectBlur} // Use custom blur handler
        className={`mt-1 py-2 px-3 border bg-white text-left ${error
            ? "border-red-700 focus:ring-red-500"
            : "border-blue-800 focus:ring-blue-500"
          } rounded-lg w-full focus:ring-1 focus:outline-none ${!value && value !== 0 ? "text-gray-500" : "text-gray-900"
          }`}
      >
        {value || value === 0 ? getDisplayValue() : `Select ${fieldName}`}
        <span className="float-right transform transition-transform duration-200">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-blue-800 rounded-lg shadow-lg z-10 max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <input
                ref={searchRef}
                type="text"
                name={`${name}_search`}
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                onBlur={handleBlur}
              />
            </div>
          )}

          <div className="overflow-y-auto max-h-48">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const optionData = getOptionData(option);
                const isSelected = optionData.value == value;

                return (
                  <button
                    key={optionData.value || `option-${index}`}
                    type="button"
                    name={name}
                    onClick={() => handleOptionSelect(optionData.value, optionData.label)}
                    className={`w-full text-left px-4 py-2 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 ${isSelected ? "bg-blue-100 text-blue-700" : "text-gray-700"
                      } ${index !== filteredOptions.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    {optionData.label}
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
