import React from "react";

const CategoryBanner = ({ title, imageUrl }) => {
  return (
    <div
      style={{ backgroundImage: `url(${imageUrl})` }}
      className="h-[600px] bg-cover bg-center flex items-end justify-start p-8"
    >
      <h1 className="px-15 py-5 text-white text-7xl font-playfair font-bold drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)]">
        {title}
      </h1>
    </div>
  );
};

export default CategoryBanner;
