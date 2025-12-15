import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import CategoryBanner from "../components/CategoryBanner";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";

const ITEMS_PER_PAGE = 2;

const CategoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const mainContentRef = useRef(null);
  const currentPage = Number(searchParams.get("page") || 1);

  const filters = {
    priceRange: [
      Number(searchParams.get("minPrice") || 0),
      Number(searchParams.get("maxPrice") || 50000000),
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);

        const minPrice = Number(searchParams.get("minPrice") || 0);
        const maxPrice = Number(searchParams.get("maxPrice") || 50000000);
        const page = Number(searchParams.get("page") || 1);

        const url = `http://localhost:3000/categories/${id}/products?minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        setProducts(data.data.products);
        setTotalPages(data.data.totalPages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [id, searchParams]);

  const handleFilterChange = (filterName, value) => {
    setSearchParams((prevParams) => {
      if (filterName === "priceRange") {
        prevParams.set("minPrice", value[0]);
        prevParams.set("maxPrice", value[1]);
      }
      prevParams.set("page", "1");
      return prevParams;
    });
  };

  const handlePageClick = (event) => {
    const newPage = event.selected + 1;
    setSearchParams((prevParams) => {
      prevParams.set("page", newPage);
      return prevParams;
    });

    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }
  // if (error) {
  //   return <div>Error loading data: {error}</div>;
  // }

  return (
    <div>
      <main
        ref={mainContentRef}
        className="grid grid-cols-10 gap-8 px-5 py-10 mt-10"
      >
        <div className="col-span-2">
          <Sidebar filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="col-span-8 flex flex-col">
          <div className="grow">
            <ProductList showType={1} products={products} />
          </div>

          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            pageCount={totalPages}
            previousLabel="< Prev"
            renderOnZeroPageCount={null}
            forcePage={currentPage - 1}
            containerClassName="flex items-center justify-center mt-8 gap-2"
            pageLinkClassName="py-2 px-4 rounded-md hover:bg-gray-100"
            previousLinkClassName="py-2 px-4 rounded-md hover:bg-gray-100"
            nextLinkClassName="py-2 px-4 rounded-md hover:bg-gray-100"
            activeLinkClassName="bg-yellow-400 text-yellow-900 font-bold hover:bg-yellow-500"
            disabledLinkClassName="text-gray-400 cursor-not-allowed"
          />
        </div>
      </main>
    </div>
  );
};

export default CategoryPage;
