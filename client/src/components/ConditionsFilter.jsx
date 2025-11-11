import React from "react";

const ColorFilter = ({ conditions, selectedConditions, onConditionChange }) => {
  return (
    <div className="mb-8 border border-gray-300 rounded-lg py-7 px-5 shadow-xl/20">
      <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
        Conditions
      </h3>

      <div className="relative h-1 mb-6">
        <div className="absolute w-full h-0.5 bg-gray-300 bottom-0"></div>
        <div className="absolute w-20 h-1 bg-yellow-400 bottom-0"></div>
      </div>

      <div className="space-y-3 font-playfair">
        {conditions.map((condition) => (
          <label
            key={condition.name}
            className="flex items-center text-lg text-gray-700 cursor-pointer"
          >
            <input
              type="checkbox"
              name={condition.name}
              checked={selectedConditions.includes(condition.name)}
              onChange={() => onConditionChange(condition.name)}
              className="
                form-checkbox 
                h-5 w-5 
                rounded 
                border-gray-400 
                text-yellow-500 
                focus:ring-yellow-400
              "
            />
            <span className="ml-3">
              {condition.name} ({condition.count})
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
