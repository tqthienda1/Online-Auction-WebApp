const CategoryFilter = ({ brands, selectedBrands, onBrandChange }) => {
  return (
    <div className="mb-8 border border-gray-300 rounded-lg py-7 px-5 shadow-xl/20">
      <h3 className="text-3xl font-playfair font-bold text-gray-800 mb-2">
        Brands
      </h3>

      <div className="relative h-1 mb-6">
        <div className="absolute w-full h-0.5 bg-gray-300 bottom-0"></div>
        <div className="absolute w-20 h-1 bg-yellow-400 bottom-0"></div>
      </div>

      <div className="space-y-3 font-playfair">
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => onBrandChange(brand)}
            className={`w-full text-left p-4 rounded-lg border-2 text-lg font-medium transition-all duration-200
              ${
                selectedBrands === brand
                  ? "border-yellow-400 font-semibold text-gray-900"
                  : "border-gray-300 text-gray-700 hover:border-gray-400"
              }
            `}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
