import React, { useEffect, useState } from "react";
import CategoryBanner from "../components/CategoryBanner";
import { useParams } from "react-router-dom";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Fujifilm X-T5 (Body Only)",
    category: "camera",
    price: 1699,
    imageUrl: "/img/product-1.jpg",
  },
  {
    id: 2,
    name: "Sony Alpha a7 IV",
    category: "camera",
    price: 2499,
    imageUrl: "/img/product-2.jpg",
  },
  {
    id: 3,
    name: "Canon EOS R6 Mark II",
    category: "camera",
    price: 2499,
    imageUrl: "/img/product-3.jpg",
  },
  {
    id: 4,
    name: 'MacBook Pro 14"',
    category: "laptop",
    price: 1999,
    imageUrl: "/img/product-4.jpg",
  },
  {
    id: 5,
    name: "Dell XPS 15",
    category: "laptop",
    price: 1799,
    imageUrl: "/img/product-5.jpg",
  },
  // ... thêm sản phẩm
];

const MOCK_BANNERS = {
  camera: { title: "Camera", imageUrl: "/image/camera.png" }, // Dùng ảnh bạn cung cấp
  laptop: { title: "Laptop", imageUrl: "/img/laptop-banner.jpg" },
};

const CategoryPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    colors: [],
    conditions: [],
  });

  // useEffect(() => {
  //   let isMounted = true;

  //   const loadProducts = async () => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);

  //       const res = await fetch(`http://localhost:5173/${category}`);
  //       const data = res.json();

  //       if (isMounted) {
  //         setProducts(data);
  //       }
  //     } catch (error) {
  //       setError(error);
  //       console.error("Error loading products", error);
  //     } finally {
  //       if (isMounted) setIsLoading(false);
  //     }
  //   };

  //   loadProducts();
  // }, [category, filters]);

  // Giả lập fetch API
  setProducts(MOCK_PRODUCTS);
  setBanners(MOCK_BANNERS);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  return (
    <div className="category-page">
      {/* 1. Banner Động */}
      {bannerData && (
        <CategoryBanner
          title={bannerData.title}
          imageUrl={bannerData.imageUrl}
        />
      )}
    </div>
  );
};

export default CategoryPage;
