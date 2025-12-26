import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { TbChartBarPopular } from "react-icons/tb";

const OrderBy = ({ onSortChange, onOrderChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Order by");

  const options = [
    {
      label: "Most Popular",
      value: "totalBid",
      order: "desc",
      icon: <TbChartBarPopular />,
    },
    {
      label: "Price Low to High",
      value: "currentPrice",
      order: "asc",
      icon: <FaArrowUp />,
    },
    {
      label: "Price High to Low",
      value: "currentPrice",
      order: "desc",
      icon: <FaArrowDown />,
    },
  ];

  const handleSelect = (option) => {
    setSelected(option.label);
    setIsOpen(false);
    onSortChange(option.value);
    onOrderChange(option.order);
  };

  return (
    <div className="w-full relative inline-block text-left mb-8 border border-gray-300 rounded-lg py-7 px-5 shadow-xl/20">
      <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
        Order By
      </h3>

      <div className="relative h-1 mb-6">
        <div className="absolute w-full h-0.5 bg-gray-300 bottom-0"></div>
        <div className="absolute w-16 h-1 bg-yellow-400 bottom-0"></div>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full font-semibold bg-yellow-400 border border-gray-300 rounded-md shadow-sm px-4 py-2 text-white flex justify-between items-center hover:bg-yellow-500 focus:outline-none"
      >
        {selected}
        <svg
          className={`h-5 w-5 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 14a1 1 0 01-.707-.293l-5-5a1 1 0 111.414-1.414L10 11.586l4.293-4.293a1 1 0 011.414 1.414l-5 5A1 1 0 0110 14z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-[85%] bg-gray-100 shadow-lg rounded-md z-10">
          {options.map((option) => (
            <div
              key={option.label}
              onClick={() => handleSelect(option)}
              className="cursor-pointer px-4 py-2 flex items-center gap-2 hover:bg-gray-200"
            >
              {option.icon}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderBy;
