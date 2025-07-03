// components/Stepper.tsx
import React from "react";

type Step = {
  label?: string;
  status: "completed" | "active" | "pending";
};

interface StepperProps {
  steps: Step[];
}

const Stepper: React.FC<StepperProps> = ({ steps }) => {
  return (
    <div className="flex items-center justify-center space-x-2 flex-wrap">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {/* Circle */}
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
              step.status === "completed"
                ? "bg-[#8DDB90] text-white"
                : step.status === "active"
                ? "bg-green-200 text-black"
                : "bg-[#C7CAD0] text-[#5A5D63]"
            }`}
          >
            {index + 1}
          </div>

          {/* Label */}
          {step.label && (
            <span
              className={`ml-2 mr-4 text-base font-medium whitespace-nowrap
                ${step.status === "completed" ? "text-black" : "text-[#A8ADB7]"}
                ${step.status === "active" ? "inline" : "hidden"} md:inline
              `}
            >
              {step.label}
            </span>
          )}

          {/* Line */}
          {/* {index < steps.length - 1 && (
            <div className="w-8 h-1.5 bg-[#D9D9D9] mx-2"></div>
          )} */}
          {index < steps.length - 1 && step.status !== "active" && (
            <div className="w-8 h-1.5 bg-[#D9D9D9] mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Stepper;