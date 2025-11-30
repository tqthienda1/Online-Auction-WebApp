import React from "react";

const BuyerProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Provide Payment" },
    { id: 2, label: "Confirm Delivery" },
    { id: 3, label: "Rate Transaction" },
  ];

  return (
    <div className="flex items-center justify-between w-full py-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center w-full">
          {/* Circle */}
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border text-lg font-semibold
              ${
                currentStep === step.id
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-600 border-gray-300"
              }
            `}
          >
            {step.id}
          </div>

          {/* Label */}
          <span
            className={`ml-3 text-lg font-medium ${
              currentStep === step.id ? "text-black" : "text-gray-500"
            }`}
          >
            {step.label}
          </span>


        </div>
      ))}
    </div>
  );
};

export default BuyerProgress;
