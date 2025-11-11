import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CategoryBanner from "../components/CategoryBanner";
import Sidebar from "../components/SideBar";
import ProductList from "../components/ProductList";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Fujifilm X-T5 (Body Only)",
    category: "camera",
    price: 1699, // Giá hiện tại (current bid)
    imageUrl: "/image/camera.png",
    brand: "Fujifilm",
    color: "Black",
    condition: "New",
    highestBidder: "****abc",
    buyNowPrice: 2000,
    endDate: "25/10/2025",
    timeLeft: "1h left",
    bidCount: 20,
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
    bidCount: 20,
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
    bidCount: 20,
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
    bidCount: 20,
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
    bidCount: 20,
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
    bidCount: 20,
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
    bidCount: 20,
  },
];

const MOCK_BANNERS = {
  camera: { title: "Camera", imageUrl: "/image/camera.png" },
  laptop: { title: "Laptop", imageUrl: "/image/camera.png" },
};

const CategoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [banner, setBanner] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    colors: [],
    conditions: [],
    brand: "",
    sortBy: "recently_added",
  });
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    colors: [],
    conditions: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // const res = await fetch(`http://localhost:5173/${category}`);
        // const data = res.json();

        // if (isMounted) {
        //   setProducts(data);
        // }
        const categoryProducts = MOCK_PRODUCTS.filter(
          (p) => p.category === category
        );

        const availableBrands = [
          ...new Set(categoryProducts.map((p) => p.brand)),
        ];

        const colorsMap = categoryProducts.reduce((acc, p) => {
          acc[p.color] = (acc[p.color] || 0) + 1;
          return acc;
        }, {});
        const availableColors = Object.keys(colorsMap).map((name) => ({
          name,
          count: colorsMap[name],
        }));

        const conditionsMap = categoryProducts.reduce((acc, p) => {
          acc[p.condition] = (acc[p.condition] || 0) + 1;
          return acc;
        }, {});
        const availableConditions = Object.keys(conditionsMap).map((name) => ({
          name,
          count: conditionsMap[name],
        }));

        //Giả lập fetch API
        const filteredProducts = categoryProducts.filter(
          (p) => p.category === category
        );
        console.log(filteredProducts);

        const currentBanner = MOCK_BANNERS[category];

        setProducts(filteredProducts);
        setBanner(currentBanner);
        setAvailableFilters({
          brands: availableBrands,
          colors: availableColors,
          conditions: availableConditions,
        });
      } catch (error) {
        setError(error);
        console.error("Error loading products", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProducts();
  }, [category, filters]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <div>
      {banner ? (
        <CategoryBanner title={banner.title} imageUrl={banner.imageUrl} />
      ) : (
        <div>Cannot find banner.</div>
      )}

      <div className="flex px-5 py-10">
        <Sidebar
          filters={filters}
          availableFilters={availableFilters}
          onFilterChange={handleFilterChange}
        />
        <ProductList
          products={products}
          sortBy={filters.sortBy}
          onSortChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default CategoryPage;
