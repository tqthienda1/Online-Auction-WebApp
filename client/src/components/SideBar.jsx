import React from "react";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ColorFilter from "./ColorFilter";
import ConditionsFilter from "./ConditionsFilter";

const SideBar = ({ filters, onFilterChange }) => {
  const handlePriceChange = (priceValue) => {
    onFilterChange("priceRange", priceValue);
  };

  return (
    <>
      <aside className="pr-8">
        <PriceFilter value={filters.priceRange} onChange={handlePriceChange} />
      </aside>
    </>
  );
};

export default SideBar;
