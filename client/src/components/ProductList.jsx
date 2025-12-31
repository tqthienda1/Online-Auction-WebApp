import React from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const ProductList = ({ products, showType }) => {
  const isHorizontal = products && products.length > 4;

  if (!products || products.length === 0) {
    return (
      <section>
        <p className="text-center text-gray-500">Cannot find any product.</p>
      </section>
    );
  }

  return (
    <section>
      {/* {isHorizontal ? (
        <div className="flex gap-6 overflow-x-auto py-2 -mx-2 px-2">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="min-w-[250px] flex-shrink-0"
            >
              <ProductCard product={product} showType={showType} />
            </Link>
          ))}
        </div>
      ) : ( */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showType={showType} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
