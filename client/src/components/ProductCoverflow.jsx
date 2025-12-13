import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import { useState, useRef } from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ProductCoverflow = ({ products }) => {
  //scale bar width with slide width
  const [slideWidth, setSlideWidth] = useState("400px");

  //for changing slide animation
  const [isUp, setIsUp] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const swiperRef = useRef(null);

  //product info
  const [productInfo, setProductInfo] = useState([]);

  //bid icon
  const [bidIcon, setBidIcon] = useState(false);

  const handleSlideChange = async (index) => {
    //Prevent user click continuously
    if (isAnimating) return;

    //slide is changing
    setIsAnimating(true);

    //hide info bar
    setIsUp(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsHide(true);

    //changing slide animation
    swiperRef.current.slideTo(index);
    setBidIcon(true);
    // console.log("show");

    //Update slide info
    const product = products[swiperRef.current.activeIndex];

    setProductInfo([
      { label: "Name", key: product.name },
      { label: "Current price", key: product.currentPrice },
      { label: "Highest bidder", key: product.highestBidder },
      { label: "Buy now", key: product.buyNowPrice },
      { label: "Date added", key: product.startTime },
      { label: "Time ends", key: product.endTime },
      { label: "Total bids", key: product.totalBids },
    ]);

    //wait changing slide animation
    await new Promise((resolve) => setTimeout(resolve, 600));

    //show info bar again
    setIsHide(false);
    setIsUp(false);

    //after show is done, stop changing slide animation
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="flex flex-col my-10 justify-center items-center overflow-hidden">
      <h1 className="font-playfair text-5xl my-7 font-semibold">Ending Soon</h1>
      <Swiper
        modules={[Navigation, Pagination, EffectCoverflow]}
        effect="coverflow"
        centeredSlides={true}
        initialSlide={2}
        speed={600}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 0,
          stretch: 80,
          depth: 350,
          modifier: 1,
          slideShadows: true,
        }}
        allowTouchMove={false}
        slideToClickedSlide={false}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onClick={(swiper) => {
          if (
            swiper.clickedIndex !== undefined &&
            swiper.clickedIndex !== swiper.activeIndex
          ) {
            handleSlideChange(swiper.clickedIndex);
          }
        }}
        onInit={(swiper) => {
          const activeSlide = swiper.slides[swiper.activeIndex];

          const product = products[swiper.activeIndex];

          setProductInfo([
            { label: "Name", key: product.name },
            { label: "Current price", key: product.currentPrice },
            { label: "Highest bidder", key: product.highestBidder },
            { label: "Buy now", key: product.buyNowPrice },
            { label: "Date added", key: product.startTime },
            { label: "Time ends", key: product.endTime },
            { label: "Total bids", key: product.totalBids },
          ]);

          setSlideWidth(activeSlide.offsetWidth);
        }}
        className="w-full h-[500px]"
      >
        {products.map((item, index) => (
          <SwiperSlide
            key={index}
            className="relative z-10 cursor-pointer pointer-events-auto aspect-3/4 h-full w-[400px] rounded-t-2xl "
          >
            <img
              src={item.productAvt}
              alt=""
              className={`w-full h-full object-cover rounded-t-2xl select-none transition-filter duration-300 ${
                index === swiperRef.current?.activeIndex
                  ? "hover:brightness-30"
                  : ""
              }`}
              draggable={false}
              onMouseOver={() => {
                if (index === swiperRef.current?.activeIndex) {
                  setBidIcon(true);
                }
              }}
              onMouseMove={() => {
                if (index !== swiperRef.current?.activeIndex) {
                  setBidIcon(false);
                }
              }}
              onMouseOut={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setBidIcon(false);
                }
              }}
            />
            {index === swiperRef.current?.activeIndex ? (
              <div
                className={`flex flex-col gap-3 absolute text-white max-w-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-opacity duration-300 ${
                  bidIcon ? "opacity-full" : "opacity-0"
                }`}
              >
                <img src="/image/auction-bid.svg" alt="" />
                <div className="font-bold text-xl">Bid now</div>
              </div>
            ) : (
              ""
            )}
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`"h-full aspect-6/3 bg-white rounded-b-2xl transform transition-transform duration-300 ${
          isUp ? "-translate-y-full" : "translate-y-0"
        } ${isHide ? "opacity-0" : "opacity-full"}`}
        style={{ width: slideWidth }}
      >
        <div className="h-full w-full flex flex-col justify-between text-brand p-7">
          <h1 className="w-full text-center text-3xl font-bold font-playfair">
            {productInfo.length > 0 ? productInfo[0].key : ""}
          </h1>

          {productInfo.slice(1).map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-xl font-light"
            >
              <div>{item.label}</div>
              <div>{item.key}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCoverflow;
