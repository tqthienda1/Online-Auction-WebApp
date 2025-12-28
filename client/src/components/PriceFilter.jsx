import React from "react";
import Slider from "rc-slider";
import { useState } from "react";

const PriceFilter = ({ value, onChange, onViewResult }) => {
  const [inputValue, setInputValue] = useState([value[0], value[1]]);
  const handleInputChange = (index, newValue) => {
    if (/^\d*$/.test(newValue)) {
      const newInputs = [...inputValue];
      newInputs[index] = newValue;
      setInputValue(newInputs);

      const num = Number(newValue);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, 0), 10000);
        const newRange = [...value];
        newRange[index] = clamped;
        onChange(newRange);
      }
    }
  };

  const handleSliderChange = (newRange) => {
    onChange(newRange);
    setInputValue(newRange.map((v) => v.toString()));
  };

  return (
    <div className="mb-8 border border-gray-300 rounded-lg py-7 px-5 shadow-xl/20">
      <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
        Filter by price
      </h3>

      <div className="relative h-1 mb-6">
        <div className="absolute w-full h-0.5 bg-gray-300 bottom-0"></div>
        <div className="absolute w-16 h-1 bg-yellow-400 bottom-0"></div>
      </div>

      <div className="px-2">
        <Slider
          range
          allowCross={false}
          min={0}
          max={10000}
          value={value}
          onChange={handleSliderChange}
          styles={{
            track: { backgroundColor: "#facc15" },
            handle: { backgroundColor: "#ffffff", border: "2px solid #facc15" },
          }}
        />
      </div>

      <div className="flex flex-col gap-2 justify-start items-start mt-4">
        <div className="flex items-center gap-2">
          <label className="text-gray-600 font-semibold">From:</label>
          <span className="font-medium text-yellow-500">$</span>
          <input
            type="number"
            className="border rounded px-2 py-1 w-24 text-yellow-500 font-bold"
            value={inputValue[0]}
            onChange={(e) => handleInputChange(0, e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-600 font-semibold">To:</label>
          <span className="font-medium text-yellow-500 ml-5">$</span>
          <input
            type="number"
            className="border rounded px-2 py-1 w-24 text-yellow-500 font-bold"
            value={inputValue[1]}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
        </div>

        <button
          className="rounded-lg mt-2 py-2 px-3 bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition-colors cursor-pointer"
          onClick={onViewResult}
        >
          View results
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
