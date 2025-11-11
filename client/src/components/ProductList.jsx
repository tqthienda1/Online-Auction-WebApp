// src/components/ProductList.jsx
import React from "react";
import ProductCard from "./ProductCard";
// import SortDropdown from './SortDropdown'; // (Component 'Sort by' của bạn)

const ProductList = ({ products, sortBy, onSortChange }) => {
  return (
    <section className="w-8/10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            Không tìm thấy sản phẩm nào.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductList;
