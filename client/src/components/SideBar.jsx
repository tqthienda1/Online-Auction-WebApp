import React from "react";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ColorFilter from "./ColorFilter";

const BRANDS = ["Fujifilm", "Canon", "Sony", "Nikon", "Olympus"];
const COLORS = [
  { name: "Black", count: 56 },
  { name: "White", count: 56 },
  { name: "Grey", count: 56 },
];

const SideBar = ({ filters, onFilterChange }) => {
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

  return (
    <>
      <aside className="w-2/10 pr-8">
        <CategoryFilter
          brands={BRANDS}
          selectedBrand={filters.brand}
          onBrandChange={handleBrandChange}
        />
        <PriceFilter value={filters.priceRange} onChange={handlePriceChange} />
        <ColorFilter
          selectedColors={filters.colors}
          onColorChange={handleColorChange}
          colors={COLORS}
        />
      </aside>
    </>
  );
};

export default SideBar;
