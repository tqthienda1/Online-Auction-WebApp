import ImageCarousel from "../components/ImageCarousel";

const mockUpData = {
  images: [
    "/image/vangogh.jpg",
    "/image/buddha.jpg",
    "/image/complex.jpg",
    "/image/food.jpg",
    "/image/art.jpg",
  ],
};

const Home = () => {
  return (
    <div className="">
      <ImageCarousel images={mockUpData.images} />
    </div>
  );
};

export default Home;
