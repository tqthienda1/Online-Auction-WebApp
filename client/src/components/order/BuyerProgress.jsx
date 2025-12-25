import React from "react";

const BuyerProgress = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Provide Payment" },
    { id: 2, label: "Confirm Delivery" },
    { id: 3, label: "Rate Transaction" },
  ];

  // Map 6 backend steps to 3 UI steps
  // currentStep 1 = UI step 1 (provide payment)
  // currentStep 4 = UI step 2 (confirm delivery)
  // currentStep 5+ = UI step 3 (rate transaction)
  const isStepActive = (stepId) => {
    if (stepId === 1) return currentStep >= 1;
    if (stepId === 2) return currentStep >= 4;
    if (stepId === 3) return currentStep >= 5;
    return false;
  };

  const isStepCurrent = (stepId) => {
    if (stepId === 1) return currentStep === 1;
    if (stepId === 2) return currentStep === 4;
    if (stepId === 3) return currentStep >= 5;
    return false;
  };

  return (
    <div className="flex items-center justify-between w-full max-w-4xl mx-auto py-6">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center w-full">
          {/* Circle */}
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full border text-lg font-semibold
              ${
                isStepCurrent(step.id)
                  ? "bg-amber-300 text-white border-amber-300"
                  : isStepActive(step.id)
                  ? "bg-amber-300 text-white border-amber-300"
                  : "bg-white text-gray-600 border-gray-300"
              }
            `}
          >
            {step.id}
          </div>

          {/* Label */}
          <span
            className={`ml-3 text-lg font-medium ${
              isStepActive(step.id) ? "text-black" : "text-gray-500"
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
