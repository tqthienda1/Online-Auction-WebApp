import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import CategoryBanner from "../components/CategoryBanner";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";
import { http } from "@/lib/utils";

const CategoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(9);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);

  useEffect(() => {
    const controller = new AbortController();
    const getProductsData = async () => {
      try {
        setIsLoading(true);

        const data = http.get(
          `products?category=${id}&page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}`,
          {
            signal: controller.signal,
          }
        );
        console.log(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProductsData();
  }, []);

  const handlePriceChange = (priceValue) => {
    const [min, max] = priceValue;
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div>
      <main className="grid grid-cols-10 gap-8 px-5 py-10 mt-10">
        <div className="col-span-2">
          <Sidebar onPriceChange={handlePriceChange} />
        </div>

        <div className="col-span-8 flex flex-col">
          <div className="grow">
            <ProductList showType={1} products={products} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
