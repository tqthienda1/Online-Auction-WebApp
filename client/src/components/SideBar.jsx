import React, { useEffect } from "react";

import CategoryFilter from "./CategoryFilter";
import PriceFilter from "./PriceFilter";
import ColorFilter from "./ColorFilter";
import ConditionsFilter from "./ConditionsFilter";
import { useState } from "react";
import OrderBy from "./OrderBy";
import AddProductButton from "./AddProductButton";
import { useAuth } from "@/context/AuthContext";

const SideBar = ({
  onPriceChange,
  onViewResult,
  onSortChange,
  onOrderChange,
}) => {
  const { user } = useAuth();
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const handleChange = (value) => {
    setPriceRange(value);
    onPriceChange(value);
  };

  const handleSortChange = (value) => {
    onSortChange(value);
  };

  const handleOrderChange = (value) => {
    onOrderChange(value);
  };

  return (
    <>
      <aside className="pr-8">
        <OrderBy
          onSortChange={handleSortChange}
          onOrderChange={handleOrderChange}
        />
        <PriceFilter
          value={priceRange}
          onChange={handleChange}
          onViewResult={onViewResult}
        />

        {/* {user?.data.role === "SELLER" && <AddProductButton />} */}
        <AddProductButton />
      </aside>
    </>
  );
};

export default SideBar;
