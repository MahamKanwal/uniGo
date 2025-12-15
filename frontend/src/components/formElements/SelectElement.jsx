import React from "react";
import { snakeCaseToTitle } from "../../utils/helperFunction";

const SelectElement = ({
  label,
  name,
  icon,
  options = [],
  handleChange,
  handleBlur,
  value,
  error,
}) => {
  const fieldName = label || snakeCaseToTitle(name);

  return (
    <div className="flex flex-col">
      <label className="flex items-center gap-2 text-gray-700 font-medium">
        {icon}
        {fieldName}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`mt-1 py-2 px-3 border bg-white ${
          error
            ? "border-red-700 focus:ring-red-500"
            : "border-blue-800 focus:ring-blue-500"
        } rounded-lg w-full focus:ring-1`}
      >
        <option value="">Select {fieldName}</option>
        {options.map((option) => {
          <option value={option} key={option}>
            {option}
          </option>;
        })}
      </select>
      {error && <div className="text-red-700 text-sm">{error}</div>}
    </div>
  );
};

export default SelectElement;
