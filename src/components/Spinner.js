// components/Spinner.js
import React from "react";

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen bg-black bg-opacity-50 fixed inset-0 z-50">
      <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div>
  );
}
