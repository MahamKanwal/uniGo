import React from "react";
import { snakeCaseToTitle } from "../../utils/helperFunction";

const InputElement = ({
  label,
  type = "text",
  name,
  icon,
  handleChange,
  handleBlur,
  value,
  error,
}) => {
  const fieldName = label || snakeCaseToTitle(name);

  return (
    <div className="flex flex-col">
      <label className="flex items-center gap-1 text-gray-700 font-medium">
        {icon}
        {fieldName}
      </label>
      <input
        value={value}
        onChange={handleChange}
        type={type}
        name={name}
        onBlur={handleBlur}
        placeholder={`Enter ${fieldName}`}
        className={`mt-1 rounded-lg p-2 w-full border ${
          error
            ? "border-red-700 focus:ring-red-500"
            : "border-blue-800 focus:ring-blue-500"
        } focus:outline-none focus:ring-1`}
      />
      {error && <div className="text-red-700 text-sm">{error}</div>}
    </div>
  );
};

export default InputElement;

