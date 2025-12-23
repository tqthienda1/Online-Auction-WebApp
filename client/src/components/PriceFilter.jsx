import React from "react";
import Slider from "rc-slider";

const PriceFilter = ({ value, onChange }) => {
  return (
    <div className="mb-8 border border-gray-300 rounded-lg py-7 px-5 shadow-xl/20">
      <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
        Fill by price
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
          max={50000000}
          defaultValue={50000000}
          value={value}
          onChange={onChange}
        />
      </div>

      <div className="flex flex-col gap-2 justify-center items-start mt-4">
        <span className="text-gray-600">
          From: <span className="text-yellow-500 font-bold">${value[0]}</span>
        </span>
        <span className="text-gray-600">
          To:{" "}
          <span className="text-yellow-500 font-bold ml-5">${value[1]}</span>
        </span>
        <button className="border-2 rounded-lg mt-2 py-2 px-3 bg-yellow-400 text-white font-semibold hover:bg-yellow-500 transition-colors">
          View results
        </button>
      </div>
    </div>
  );
};

export default PriceFilter;
