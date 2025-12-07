import ProductCoverflow from "../components/ProductCoverflow";
import HomeProductCarousel from "../components/HomeProductCarousel";

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
  product: {
    image: "/image/dining_room.jpg",
    name: "E-10: English Dining Room of the Georgian Period, 1770-90",
    currentPrice: 30000,
    highestBidder: "thiendepzai",
    buyNowPrice: 50000,
    startDate: "13/07/2025",
    endDate: "30/10/2025",
    totalBids: 10,
  },
};

const Home = () => {
  return (
    <div className="">
      <ProductCoverflow products={mockUpData.products} />

      <HomeProductCarousel
        heading="Ending Soon Items"
        product={mockUpData.product}
      />

      <HomeProductCarousel
        heading="Most Bidden Items"
        product={mockUpData.product}
      />
      <HomeProductCarousel
        heading="Highest - price Items"
        product={mockUpData.product}
      />
    </div>
  );
};

export default Home;
