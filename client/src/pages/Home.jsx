import ImageCarousel from "../components/ImageCarousel";

const mockUpData = {
  products: [
    {
      image: "/image/vangogh.jpg",
      name: "Vangogh",
      currentPrice: 30000,
      highestBidder: "thiendepzai",
      buyNowPrice: 50000,
      startDate: "13/07/2025",
      endDate: "30/10/2025",
      totalBids: 10,
    },
    {
      image: "/image/buddha.jpg",
      name: "Buddha",
      currentPrice: 30000,
      highestBidder: "thiendepzai",
      buyNowPrice: 50000,
      startDate: "13/07/2025",
      endDate: "30/10/2025",
      totalBids: 10,
    },
    {
      image: "/image/complex.jpg",
      name: "Complex",
      currentPrice: 30000,
      highestBidder: "thiendepzai",
      buyNowPrice: 50000,
      startDate: "13/07/2025",
      endDate: "30/10/2025",
      totalBids: 10,
    },
    {
      image: "/image/food.jpg",
      name: "Food",
      currentPrice: 30000,
      highestBidder: "thiendepzai",
      buyNowPrice: 50000,
      startDate: "13/07/2025",
      endDate: "30/10/2025",
      totalBids: 10,
    },
    {
      image: "/image/art.jpg",
      name: "Art",
      currentPrice: 30000,
      highestBidder: "thiendepzai",
      buyNowPrice: 50000,
      startDate: "13/07/2025",
      endDate: "30/10/2025",
      totalBids: 10,
    },
  ],
};

const Home = () => {
  return (
    <div className="">
      <ImageCarousel products={mockUpData.products} />
    </div>
  );
};

export default Home;
