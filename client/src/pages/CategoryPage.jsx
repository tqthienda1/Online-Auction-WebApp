import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import CategoryBanner from "../components/CategoryBanner";
import Sidebar from "../components/SideBar";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Fujifilm X-T5 (Body Only)",
    category: "camera",
    price: 1699,
    imageUrl: "/image/camera.png",
  },
  {
    id: 2,
    name: "Sony Alpha a7 IV",
    category: "camera",
    price: 2499,
    imageUrl: "/image/camera.png",
  },
  {
    id: 3,
    name: "Canon EOS R6 Mark II",
    category: "camera",
    price: 2499,
    imageUrl: "/image/camera.png",
  },
  {
    id: 4,
    name: 'MacBook Pro 14"',
    category: "laptop",
    price: 1999,
    imageUrl: "/image/camera.png",
  },
  {
    id: 5,
    name: "Dell XPS 15",
    category: "laptop",
    price: 1799,
    imageUrl: "/image/camera.png",
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

        //Giả lập fetch API
        const filteredProducts = MOCK_PRODUCTS.filter(
          (p) => p.category === category
        );

        const currentBanner = MOCK_BANNERS[category];

        setProducts(filteredProducts);
        setBanner(currentBanner);
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

      <div className="col-span-2 flex p-5">
        <Sidebar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <div className="col-span-8">{/* <ProductList/> */}</div>
    </div>
  );
};

export default CategoryPage;
