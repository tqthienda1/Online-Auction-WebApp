import React from "react";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ColorFilter from "./ColorFilter";
import ConditionsFilter from "./ConditionsFilter";

const SideBar = ({ filters, availableFilters, onFilterChange }) => {
  const handleBrandChange = (brandName) => {
    onFilterChange("brand", brandName);
  };
  const handlePriceChange = (priceValue) => {
    onFilterChange("priceRange", priceValue);
  };
  const handleColorChange = (colorName) => {
    const currentColors = filters.colors || [];
    const isSelected = currentColors.includes(colorName);

    let newColors;
    if (isSelected) {
      newColors = currentColors.filter((name) => name !== colorName);
    } else {
      newColors = [...currentColors, colorName];
    }

    onFilterChange("colors", newColors);
  };
  const handleConditionChange = (conditionName) => {
    const currentConditions = filters.conditions || [];
    const isSelected = currentConditions.includes(conditionName);

    let newConditions;
    if (isSelected) {
      newConditions = currentConditions.filter(
        (name) => name !== conditionName
      );
    } else {
      newConditions = [...currentConditions, conditionName];
    }

    onFilterChange("conditions", newConditions);
  };

  return (
    <>
      <aside className="w-2/10 pr-8">
        <CategoryFilter
          brands={availableFilters.brands}
          selectedBrands={filters.brands}
          onBrandChange={handleBrandChange}
        />
        <PriceFilter value={filters.priceRange} onChange={handlePriceChange} />
        <ColorFilter
          selectedColors={filters.colors}
          onColorChange={handleColorChange}
          colors={availableFilters.colors}
        />
        <ConditionsFilter
          conditions={availableFilters.conditions}
          selectedConditions={filters.conditions}
          onConditionChange={handleConditionChange}
        />
      </aside>
    </>
  );
};

export default SideBar;
