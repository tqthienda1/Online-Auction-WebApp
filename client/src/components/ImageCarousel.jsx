import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ImageCarousel = ({ images }) => {
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
        slideToClickedSlide
        onClick={(swiper) => {
          if (swiper.clickedIndex !== undefined) {
            swiper.slideTo(swiper.clickedIndex);
          }
        }}
        className="w-full h-[500px]"
      >
        {images.map((item, index) => (
          <SwiperSlide
            key={index}
            className="aspect-3/4 h-full w-[400px] rounded-2xl "
          >
            <img
              src={item}
              alt=""
              className="relative z-10 cursor-pointer pointer-events-auto w-full h-full object-cover rounded-2xl "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
