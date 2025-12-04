import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import CategoryBanner from "../components/CategoryBanner";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";

const MOCK_PRODUCTS = [
  {
    id: "p1-1111-aaaa-bbbb-0001",
    sellerID: "u-seller-001",
    highestBidderID: null,
    productName: "iPhone 14 Pro Max 256GB",
    productAvt: "/images/products/iphone14promax.jpg",
    categoryID: "cate-electronics",
    startingPrice: 15000000,
    bidStep: 200000,
    buyNowPrice: 23000000,
    currentPrice: 15000000,
    startTime: "2025-01-01T10:00:00.000Z",
    endTime: "2025-01-05T10:00:00.000Z",
    autoExtend: true,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p2-1111-aaaa-bbbb-0002",
    sellerID: "u-seller-002",
    highestBidderID: "u-bidder-777",
    productName: "Macbook Air M2 2023",
    productAvt: "/images/products/macbook-air-m2.jpg",
    categoryID: "cate-electronics",
    startingPrice: 18000000,
    bidStep: 300000,
    buyNowPrice: 28000000,
    currentPrice: 19600000,
    startTime: "2025-01-03T12:00:00.000Z",
    endTime: "2025-01-07T12:00:00.000Z",
    autoExtend: true,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p3-1111-aaaa-bbbb-0003",
    sellerID: "u-seller-003",
    highestBidderID: null,
    productName: "Giày Nike Air Jordan 1 Retro",
    productAvt: "/images/products/jordan1.jpg",
    categoryID: "cate-fashion",
    startingPrice: 2500000,
    bidStep: 100000,
    buyNowPrice: 4500000,
    currentPrice: 2500000,
    startTime: "2025-01-04T08:00:00.000Z",
    endTime: "2025-01-09T08:00:00.000Z",
    autoExtend: false,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p4-1111-aaaa-bbbb-0004",
    sellerID: "u-seller-004",
    highestBidderID: null,
    productName: "Đồng hồ Casio G-Shock GA-2100",
    productAvt: "/images/products/gshock-ga2100.jpg",
    categoryID: "cate-accessories",
    startingPrice: 1200000,
    bidStep: 50000,
    buyNowPrice: 2500000,
    currentPrice: 1200000,
    startTime: "2025-01-02T09:30:00.000Z",
    endTime: "2025-01-06T09:30:00.000Z",
    autoExtend: false,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p5-1111-aaaa-bbbb-0005",
    sellerID: "u-seller-002",
    highestBidderID: "u-bidder-999",
    productName: "Tai nghe Sony WH-1000XM5",
    productAvt: "/images/products/sony-wh1000xm5.jpg",
    categoryID: "cate-electronics",
    startingPrice: 5000000,
    bidStep: 150000,
    buyNowPrice: 8000000,
    currentPrice: 5450000,
    startTime: "2025-01-03T07:00:00.000Z",
    endTime: "2025-01-06T07:00:00.000Z",
    autoExtend: true,
    sold: false,
    ratingRequired: false,
  },

  {
    id: "p6-1111-aaaa-bbbb-0006",
    sellerID: "u-seller-001",
    highestBidderID: null,
    productName: "Bàn phím cơ Keychron K6",
    productAvt: "/images/products/keychron-k6.jpg",
    categoryID: "cate-computer-accessories",
    startingPrice: 1500000,
    bidStep: 50000,
    buyNowPrice: 3000000,
    currentPrice: 1500000,
    startTime: "2025-01-01T15:00:00.000Z",
    endTime: "2025-01-04T15:00:00.000Z",
    autoExtend: false,
    sold: false,
    ratingRequired: false,
  },
];

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
    sortBy: searchParams.get("sortBy") || "default",
  };

  useEffect(() => {
    try {
      setIsLoading(true);

      const categoryProducts = MOCK_PRODUCTS.filter((p) => p.categoryID === id);

      const applyFilters = (products) => {
        return products.filter((p) => {
          return (
            Number(p.currentPrice) >= Number(filters.priceRange[0]) &&
            Number(p.currentPrice) <= Number(filters.priceRange[1])
          );
        });
      };

      const filteredProducts = applyFilters(categoryProducts);

      const newTotalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
      setTotalPages(newTotalPages);

      const offset = (currentPage - 1) * ITEMS_PER_PAGE;

      const pagedProducts = filteredProducts.slice(
        offset,
        offset + ITEMS_PER_PAGE
      );

      setProducts(pagedProducts);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading data: {error}</div>;
  }

  return (
    <div>
      {banner ? (
        <CategoryBanner title={banner.title} imageUrl={banner.imageUrl} />
      ) : (
        <div>Cannot find banner.</div>
      )}

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
