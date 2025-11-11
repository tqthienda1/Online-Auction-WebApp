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
    price: 1699,
    imageUrl: "/image/camera.png",
    brand: "Fujifilm",
    color: "Black",
    condition: "New",
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
    brands: "",
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

        const availableBrands = [...new Set(MOCK_PRODUCTS.map((p) => p.brand))];

        const colorsMap = MOCK_PRODUCTS.reduce((acc, p) => {
          acc[p.color] = (acc[p.color] || 0) + 1;
          return acc;
        }, {});
        const availableColors = Object.keys(colorsMap).map((name) => ({
          name,
          count: colorsMap[name],
        }));

        const conditionsMap = MOCK_PRODUCTS.reduce((acc, p) => {
          acc[p.condition] = (acc[p.condition] || 0) + 1;
          return acc;
        }, {});
        const availableConditions = Object.keys(conditionsMap).map((name) => ({
          name,
          count: conditionsMap[name],
        }));

        //Giả lập fetch API
        const filteredProducts = MOCK_PRODUCTS.filter(
          (p) => p.category === category
        );

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
