import { useState } from "react";

const ProductCarousel = ({ images = [] }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex w-full h-[600px] justify-center items-center relative">
      <div className="flex flex-col absolute left-20 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            onClick={() => setMainImage(img)}
            className={`rounded-xl border-2 overflow-hidden cursor-pointer transition-colors duration-300 ${
              mainImage === img
                ? "border-black opacity-100"
                : "border-gray-300 opacity-80 hover:opacity-100"
            }`}
          >
            <img
              src={img}
              alt={`thumb-${index}`}
              className="w-32 h-32 object-cover"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center h-full">
        <img
          src={mainImage}
          alt="main"
          className="h-full object-contain transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default ProductCarousel;
