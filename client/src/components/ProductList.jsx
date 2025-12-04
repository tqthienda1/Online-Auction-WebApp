import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, sortBy, onSortChange, showType }) => {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 place-items-center">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showType={showType}
            />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            Cannot find any product.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductList;
