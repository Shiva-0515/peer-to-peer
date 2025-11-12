// ProgressBar.jsx
import React from "react";

export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-blue-100 rounded-full h-2 mt-1.5">
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
