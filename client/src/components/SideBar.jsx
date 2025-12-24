import React from "react";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ColorFilter from "./ColorFilter";
import ConditionsFilter from "./ConditionsFilter";
import { useState } from "react";
import OrderBy from "./OrderBy";

const SideBar = ({ onPriceChange, onViewResult, onSortChange }) => {
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const handleChange = (value) => {
    setPriceRange(value);
    onPriceChange(value);
  };

  const handleSortChange = (value) => {
    onSortChange(value);
  };

  return (
    <>
      <aside className="pr-8">
        <OrderBy onSortChange={handleSortChange} />
        <PriceFilter
          value={priceRange}
          onChange={handleChange}
          onViewResult={onViewResult}
        />
      </aside>
    </>
  );
};

export default SideBar;
