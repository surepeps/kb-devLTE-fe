/** @format */

"use client";
import React from "react";
import { PreferenceFormProvider } from "@/context/preference-form-context";
import LocationSelection from "@/components/preference-form/LocationSelection";

const TestLocationPage: React.FC = () => {
  return (
    <PreferenceFormProvider>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            LocationSelection Component Test
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <LocationSelection />
          </div>
        </div>
      </div>
    </PreferenceFormProvider>
  );
};

export default TestLocationPage;
