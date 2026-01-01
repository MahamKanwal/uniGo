import React, { useState } from "react";
import { snakeCaseToTitle } from "../../utils/helperFunction";

const SelectElement = ({
  label,
  name,
  icon,
  options = [],
  value,
  error,
  handleChange,
  onChange,
  formikHelpers,
}) => {
  // console.log(options);
  const fieldName = label || snakeCaseToTitle(name);
  const [open, setOpen] = useState(false);

  const selectOption = (val) => {
    const event = { target: { name, value: val } };
    handleChange(event);
    onChange?.(event, formikHelpers);
    setOpen(false);
    // console.log(event)
  };

  const selectedLabel =
    options.find((o) => o.value === value)?.name || "";

  return (
    <div className="relative">
      <label className="flex gap-2">
        {icon} {fieldName}
      </label>

      <button
        type="button"
        className="border w-full text-left px-3 py-2"
        onClick={() => setOpen(!open)}
      >
        {selectedLabel || `Select ${fieldName}`}
      </button>

      {open && (
        <div className="border absolute w-full bg-white z-10">

          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={() => selectOption(o.value)}
            >
              {o.name}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default SelectElement;

// Submitting complaint: 
// Object { title: "gyuio", description: "hjkijj", status: "pending", role: "student", assignedTo: "69471509b257be66397956f1" }