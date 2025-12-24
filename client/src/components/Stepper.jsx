const Stepper = ({ step }) => {
  const steps = [
    { id: 1, label: "Email" },
    { id: 2, label: "OTP" },
    { id: 3, label: "New password" },
  ];

  return (
    <div className="grid grid-cols-3 items-start mb-10">
      {steps.map((s, index) => (
        <div key={s.id} className="flex flex-col items-center relative">
          {/* Line left */}
          {index > 0 && (
            <div
              className={`absolute top-4 -left-1/2 w-full h-[2px]
                ${step >= s.id ? "bg-black" : "bg-gray-300"}`}
            />
          )}

          {/* Line right */}
          {index < steps.length - 1 && (
            <div
              className={`absolute top-4 left-1/2 w-full h-[2px]
                ${step >= s.id ? "bg-black" : "bg-gray-300"}`}
            />
          )}

          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full z-10 flex items-center justify-center text-sm font-medium
              ${
                step >= s.id
                  ? "bg-black text-white"
                  : "bg-gray-300 text-gray-600"
              }`}
          >
            {s.id}
          </div>

          {/* Label */}
          <span
            className={`text-xs mt-2 text-center
              ${step === s.id ? "text-black font-medium" : "text-gray-500"}`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
