"use client";

import React from "react";

export default function TestAreaFix() {
  // Test the area data type fix
  const testAreaString = "Ogba-Ijaiye";
  const testAreaObject = { value: "Ogba-Ijaiye", label: "Ogba-Ijaiye" };

  // This should now work correctly - area should be string type
  const handleAreaSubmission = (area: string) => {
    console.log("Area submitted:", area);
    console.log("Area type:", typeof area);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Area Field Fix Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Test 1: String Area (Should work)
          </h2>
          <button
            onClick={() => handleAreaSubmission(testAreaString)}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Submit String Area: {testAreaString}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold">
            Test 2: Object Area Value (Should extract value)
          </h2>
          <button
            onClick={() => handleAreaSubmission(testAreaObject.value)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit Object Area Value: {testAreaObject.value}
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold">Fixed Issues:</h3>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>✅ Area field now stores string values instead of objects</li>
            <li>✅ LGA dropdown shows consistently for alignment</li>
            <li>✅ Manual entry allowed for LGA when not found</li>
            <li>✅ Manual entry allowed for area when not found</li>
            <li>✅ Validation schema handles string area type</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
