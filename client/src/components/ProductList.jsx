import React from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

const ProductList = ({ products, showType }) => {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Link to={`/products/${product.id}`}>
              <ProductCard
                key={product.id}
                product={product}
                showType={showType}
              />
            </Link>
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
