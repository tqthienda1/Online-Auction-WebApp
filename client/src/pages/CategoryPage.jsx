import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ReactPaginate from "react-paginate";

import CategoryBanner from "../components/CategoryBanner";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";

const MOCK_BANNERS = {
  camera: { title: "Camera", imageUrl: "/image/camera.png" },
  laptop: { title: "Laptop", imageUrl: "/image/camera.png" },
};
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Fujifilm X-T5 (Body Only)",
    category: "camera",
    price: 1699,
    imageUrl: "/image/camera.png",
    brand: "Fujifilm",
    color: "Black",
    condition: "New",
    highestBidder: "****abc",
    buyNowPrice: 2000,
    endDate: "25/10/2025",
    timeLeft: "1h left",
  },
  {
    id: 2,
    name: "Sony Alpha a7 IV",
    category: "camera",
    price: 2499,
    imageUrl: "/image/camera.png",
    brand: "Sony",
    color: "Black",
    condition: "Used",
    highestBidder: "****fgh",
    buyNowPrice: 2800,
    endDate: "26/10/2025",
    timeLeft: "2d left",
  },
  {
    id: 3,
    name: "Canon EOS R6 Mark II",
    category: "camera",
    price: 2499,
    imageUrl: "/image/camera.png",
    brand: "Canon",
    color: "Grey",
    condition: "New",
    highestBidder: "****jkl",
    buyNowPrice: 2700,
    endDate: "25/10/2025",
    timeLeft: "3h left",
  },
  {
    id: 4,
    name: 'MacBook Pro 14"',
    category: "laptop",
    price: 1999,
    imageUrl: "/image/camera.png",
    brand: "Apple",
    color: "Grey",
    condition: "New",
    highestBidder: "****xyz",
    buyNowPrice: 2300,
    endDate: "27/10/2025",
    timeLeft: "4d left",
  },
  {
    id: 5,
    name: "Dell XPS 15",
    category: "laptop",
    price: 1799,
    imageUrl: "/image/camera.png",
    brand: "Dell",
    color: "Black",
    condition: "Used",
    highestBidder: "****123",
    buyNowPrice: 2000,
    endDate: "25/10/2025",
    timeLeft: "10h left",
  },
  {
    id: 6,
    name: "Fujifilm X-E4",
    category: "camera",
    price: 849,
    imageUrl: "/image/camera.png",
    brand: "Fujifilm",
    color: "Silver",
    condition: "Used",
    highestBidder: "****456",
    buyNowPrice: 1000,
    endDate: "26/10/2025",
    timeLeft: "1d left",
  },
  {
    id: 7,
    name: "Sony a6700",
    category: "camera",
    price: 1399,
    imageUrl: "/image/camera.png",
    brand: "Sony",
    color: "Black",
    condition: "New",
    highestBidder: "****789",
    buyNowPrice: 1500,
    endDate: "28/10/2025",
    timeLeft: "5d left",
  },
];

const ITEMS_PER_PAGE = 1;

const CategoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(0);
  const mainContentRef = useRef(null);
  const currentPage = Number(searchParams.get("page") || 1);

  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    colors: [],
    conditions: [],
  });

  const filters = {
    brand: searchParams.get("brand") || "",
    colors: searchParams.getAll("colors") || [],
    conditions: searchParams.getAll("conditions") || [],
    priceRange: [
      Number(searchParams.get("minPrice") || 0),
      Number(searchParams.get("maxPrice") || 5000),
    ],
    sortBy: searchParams.get("sortBy") || "recently_added",
  };

  useEffect(() => {
    try {
      setIsLoading(true);

      const categoryProducts = MOCK_PRODUCTS.filter(
        (p) => p.category === category
      );

      const applyFilters = (products, skipFilter) => {
        return products.filter((p) => {
          if (
            skipFilter !== "brand" &&
            filters.brand &&
            p.brand !== filters.brand
          )
            return false;
          if (
            skipFilter !== "colors" &&
            filters.colors.length > 0 &&
            !filters.colors.includes(p.color)
          )
            return false;
          if (
            skipFilter !== "conditions" &&
            filters.conditions.length > 0 &&
            !filters.conditions.includes(p.condition)
          )
            return false;
          if (
            skipFilter !== "price" &&
            (p.price < filters.priceRange[0] || p.price > filters.priceRange[1])
          )
            return false;
          return true;
        });
      };

      const brandContextProducts = applyFilters(categoryProducts, "brand");
      const availableBrands = [
        ...new Set(brandContextProducts.map((p) => p.brand)),
      ];

      const colorContextProducts = applyFilters(categoryProducts, "colors");
      const colorsMap = colorContextProducts.reduce((acc, p) => {
        acc[p.color] = (acc[p.color] || 0) + 1;
        return acc;
      }, {});
      const availableColors = Object.keys(colorsMap).map((name) => ({
        name,
        count: colorsMap[name],
      }));

      const conditionContextProducts = applyFilters(
        categoryProducts,
        "conditions"
      );
      const conditionsMap = conditionContextProducts.reduce((acc, p) => {
        acc[p.condition] = (acc[p.condition] || 0) + 1;
        return acc;
      }, {});
      const availableConditions = Object.keys(conditionsMap).map((name) => ({
        name,
        count: conditionsMap[name],
      }));

      setAvailableFilters({
        brands: availableBrands,
        colors: availableColors,
        conditions: availableConditions,
      });

      const allFilteredProducts = applyFilters(categoryProducts, null);

      const newTotalPages = Math.ceil(
        allFilteredProducts.length / ITEMS_PER_PAGE
      );
      setTotalPages(newTotalPages);

      const offset = (currentPage - 1) * ITEMS_PER_PAGE;

      const pagedProducts = allFilteredProducts.slice(
        offset,
        offset + ITEMS_PER_PAGE
      );

      setProducts(pagedProducts);
      setBanner(MOCK_BANNERS[category]);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [category, searchParams]);

  const handleFilterChange = (filterName, value) => {
    setSearchParams((prevParams) => {
      if (filterName === "colors" || filterName === "conditions") {
        prevParams.delete(filterName);
        value.forEach((item) => prevParams.append(filterName, item));
      } else if (filterName === "priceRange") {
        prevParams.set("minPrice", value[0]);
        prevParams.set("maxPrice", value[1]);
      } else {
        prevParams.set(filterName, value);
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

      <main ref={mainContentRef} className="grid grid-cols-10 gap-8 px-5 py-10">
        <div className="col-span-2">
          <Sidebar
            filters={filters}
            availableFilters={availableFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="col-span-8 flex flex-col">
          <div className="grow">
            <ProductList
              products={products}
              sortBy={filters.sortBy}
              onSortChange={(newValue) =>
                handleFilterChange("sortBy", newValue)
              }
            />
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
