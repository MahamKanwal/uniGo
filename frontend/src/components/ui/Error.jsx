import React from "react";
const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white shadow-md rounded-2xl p-6 w-80 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">⚠️ Error</h2>
        <p className="text-gray-700 mb-4">
          {message || "Something went wrong!"}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;
