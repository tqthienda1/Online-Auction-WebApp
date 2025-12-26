import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { useId, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";

const HomeProductCarousel = ({ heading, product }) => {
  const swiperID = useId();
  const [bidIcon, setBidIcon] = useState(false);

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
          {product.map((item, index) => {
            const productInfo = [
              { label: "Current price", key: item.currentPrice },
              { label: "Highest bidder", key: item.highestBidder },
              { label: "Buy now", key: item.buyNowPrice },
              { label: "Date added", key: item.startTime },
              { label: "Date ended", key: item.endTime },
              { label: "Total bids", key: item.totalBid },
            ];
            return (
              <SwiperSlide key={index}>
                <div className="flex items-center justify-center w-full h-full">
                  <div className="relative group pointer-events-auto">
                    <img
                      src={item.productAvt}
                      alt=""
                      className="w-3xl h-auto object-contain aspect-3/2 rounded-3xl cursor-pointer"
                    />

                    <div className="group-hover:bg-black/50 rounded-3xl absolute inset-0 flex flex-col gap-3 items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <img
                        className="max-w-20"
                        src="/image/auction-bid.svg"
                        alt=""
                      />
                      <div className="font-bold text-xl">Bid now</div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between bg-brand flex-2 h-[80%] rounded-r-3xl text-white p-10">
                    <h1 className="text-4xl text-center font-playfair">
                      {item.productName}
                    </h1>
                    {productInfo.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div className="font-semibold">{item.label}</div>
                        <div>{item.key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <button className={`next-btn${swiperID} cursor-pointer`}>
          <FaArrowRight className="text-3xl m-10" />
        </button>
      </div>
    </div>
  );
};

export default HomeProductCarousel;
