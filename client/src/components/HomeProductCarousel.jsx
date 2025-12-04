import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { useId } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

const HomeProductCarousel = ({ heading, product }) => {
  const swiperID = useId();

  const productInfo = [
    { label: "Current price", key: product.currentPrice },
    { label: "Highest bidder", key: product.highestBidder },
    { label: "Buy now", key: product.buyNowPrice },
    { label: "Date added", key: product.startDate },
    { label: "Date ended", key: product.endDate },
  ];

  return (
    <div className="flex flex-col items-center m-30">
      <h1 className="font-playfair text-5xl my-7 font-semibold">{heading}</h1>
      <div className="flex w-full">
        <button className={`prev-btn${swiperID} cursor-pointer`}>
          <FaArrowLeft className="text-3xl m-10" />
        </button>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            nextEl: `.next-btn${swiperID}`,
            prevEl: `.prev-btn${swiperID}`,
          }}
          className="w-full"
          onSlideChange={() => console.log("slide change")}
        >
          <SwiperSlide>
            <div className="flex items-center justify-center w-full h-full">
              <img
                src="/image/dining_room.jpg"
                alt=""
                className="w-3xl h-auto aspect-3/2 rounded-3xl"
              />
              <div className="flex flex-col justify-between bg-brand flex-2 h-[80%] rounded-r-3xl text-white p-10">
                <h1 className="text-4xl text-center">{product.name}</h1>
                {productInfo.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>{item.label}</div>
                    <div>{item.key}</div>
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="flex items-center justify-center w-full h-full">
              <img
                src="/image/dining_room.jpg"
                alt=""
                className="w-3xl h-auto aspect-3/2 rounded-3xl"
              />
              <div className="flex flex-col justify-between bg-brand flex-2 h-[80%] rounded-r-3xl text-white p-10">
                <h1 className="text-4xl text-center">{product.name}</h1>
                {productInfo.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>{item.label}</div>
                    <div>{item.key}</div>
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <button className={`next-btn${swiperID} cursor-pointer`}>
          <FaArrowRight className="text-3xl m-10" />
        </button>
      </div>
    </div>
  );
};

export default HomeProductCarousel;
