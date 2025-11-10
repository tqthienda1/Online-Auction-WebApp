import ProductCarousel from "../components/ProductCarousel.jsx";

const ProductDetails = () => {
  const images = [
    "/image/detail_1.jpg",
    "/image/detail_2.jpg",
    "/image/detail_3.jpg",
    // "/image/detail_back.jpg",
    // "/image/detail_front.jpg",
  ];

  return (
    <div className="p-10">
      <ProductCarousel images={images} />
    </div>
  );
};

export default ProductDetails;
