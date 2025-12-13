import { useState } from "react";

const ProductCarousel = ({ images = [] }) => {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex w-full h-[500px] items-center relative">
      <div className="h-[500px] w-32 absolute left-10">
        <div className="absolute top-0 left-0 w-full h-12 pointer-events-none bg-gradient-to-b from-white to-transparent z-10"></div>

        <div
          className="
            h-full 
            overflow-y-scroll overflow-x-hidden 
            no-scrollbar 
            flex flex-col gap-4 
            pt-12 pb-12
          "
        >
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setMainImage(img)}
              className={`rounded-xl border-2 transition-all duration-300 ${
                mainImage === img
                  ? "border-black"
                  : "border-gray-300 opacity-80 hover:opacity-100"
              }`}
            >
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-white flex justify-center items-center mx-auto">
                <img
                  src={img.imageURL}
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 w-full h-12 pointer-events-none bg-gradient-to-t from-white to-transparent z-10"></div>
      </div>

      <div className="flex justify-center items-center h-full mx-auto">
        <img
          src={mainImage?.imageURL}
          alt="main"
          className="h-full object-contain transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default ProductCarousel;
