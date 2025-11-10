import React from "react";

// Dùng style inline để đặt ảnh nền
const bannerStyle = (imageUrl) => ({
  height: "300px", // Bạn có thể điều chỉnh
  backgroundImage: `url(${imageUrl})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
});

const CategoryBanner = ({ title, imageUrl }) => {
  return (
    <div style={bannerStyle(imageUrl)}>
      <h1 style={{ fontSize: "4rem" }}>{title}</h1>
    </div>
  );
};

export default CategoryBanner;
