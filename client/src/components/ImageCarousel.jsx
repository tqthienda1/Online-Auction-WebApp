import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import { useState, useRef } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageCarousel = ({ products }) => {
  //scale bar width with slide width
  const [slideWidth, setSlideWidth] = useState("400px");

  //for changing slide animation
  const [isUp, setIsUp] = useState(false);
  const [isHide, setIsHide] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const swiperRef = useRef(null);

  const handleSlideChange = async (index) => {
    //Prevent user click continuously
    if (isAnimating) return;

    //slide is changing
    setIsAnimating(true);

    //hide info bar
    setIsUp(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsHide(true);

    //changing slide animation and wait
    swiperRef.current.slideTo(index);
    await new Promise((resolve) => setTimeout(resolve, 600));

    //show info bar again
    setIsHide(false);
    setIsUp(false);

    //after show is done, stop changing slide animation
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
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

          setSlideWidth(activeSlide.offsetWidth);
        }}
        onSlideChange={(swiper) => {
          console.log("Active slide index:", swiper.activeIndex);
          console.log(
            "Centered slide element:",
            swiper.slides[swiper.activeIndex]
          );
        }}
        className="w-full h-[500px]"
      >
        {products.map((item, index) => (
          <SwiperSlide
            key={index}
            className="relative z-10 cursor-pointer pointer-events-auto aspect-3/4 h-full w-[400px] rounded-t-2xl "
          >
            <img
              src={item.image}
              alt=""
              className=" w-full h-full object-cover rounded-t-2xl select-none"
              draggable={false}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className={`"h-full aspect-6/3 bg-brand rounded-b-2xl transform transition-transform duration-500 ${
          isUp ? "-translate-y-full" : "translate-y-0"
        } ${isHide ? "opacity-0" : "opacity-full"}`}
        style={{ width: slideWidth }}
      ></div>
    </div>
  );
};

export default ImageCarousel;
