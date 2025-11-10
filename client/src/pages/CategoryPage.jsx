import React from "react";
import CategoryBanner from "../components/CategoryBanner";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { slug } = useParams();
  const imagePath = `/image/${slug}.jpg`;
  console.log(imagePath);
  return <CategoryBanner imagePath={imagePath} title="AAA" />;
};

export default CategoryPage;
