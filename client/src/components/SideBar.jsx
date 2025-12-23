import React from "react";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ColorFilter from "./ColorFilter";
import ConditionsFilter from "./ConditionsFilter";
import { useState } from "react";

const SideBar = ({ onPriceChange }) => {
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const handleChange = (value) => {
    setPriceRange(value);
    onPriceChange(value);
  };

  return (
    <>
      <aside className="pr-8">
        <PriceFilter value={priceRange} onChange={handleChange} />
      </aside>
    </>
  );
};

export default SideBar;
