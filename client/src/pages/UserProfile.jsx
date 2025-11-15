import React from "react";
import ProfileInfo from "../components/ProfileInfo";
import ProfileReviews from "../components/ProfileReviews";
import ProfileTab from "../components/ProfileTab";
import ProductList from "@/components/ProductList";

const MOCK_BANNERS = {
  camera: { title: "Camera", imageUrl: "/image/camera.png" },
  laptop: { title: "Laptop", imageUrl: "/image/camera.png" },
};
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Fujifilm X-T5 (Body Only)",
    category: "camera",
    price: 1699,
    imageUrl: "/image/camera.png",
    brand: "Fujifilm",
    color: "Black",
    condition: "New",
    highestBidder: "****abc",
    buyNowPrice: 2000,
    endDate: "25/10/2025",
    timeLeft: "1h left",
  },
  {
    id: 2,
    name: "Sony Alpha a7 IV",
    category: "camera",
    price: 2499,
    imageUrl: "/image/camera.png",
    brand: "Sony",
    color: "Black",
    condition: "Used",
    highestBidder: "****fgh",
    buyNowPrice: 2800,
    endDate: "26/10/2025",
    timeLeft: "2d left",
  },
  {
    id: 3,
    name: "Canon EOS R6 Mark II",
    category: "camera",
    price: 2499,
    imageUrl: "/image/camera.png",
    brand: "Canon",
    color: "Grey",
    condition: "New",
    highestBidder: "****jkl",
    buyNowPrice: 2700,
    endDate: "25/10/2025",
    timeLeft: "3h left",
  },
  {
    id: 4,
    name: 'MacBook Pro 14"',
    category: "laptop",
    price: 1999,
    imageUrl: "/image/camera.png",
    brand: "Apple",
    color: "Grey",
    condition: "New",
    highestBidder: "****xyz",
    buyNowPrice: 2300,
    endDate: "27/10/2025",
    timeLeft: "4d left",
  },
  {
    id: 5,
    name: "Dell XPS 15",
    category: "laptop",
    price: 1799,
    imageUrl: "/image/camera.png",
    brand: "Dell",
    color: "Black",
    condition: "Used",
    highestBidder: "****123",
    buyNowPrice: 2000,
    endDate: "25/10/2025",
    timeLeft: "10h left",
  },
  {
    id: 6,
    name: "Fujifilm X-E4",
    category: "camera",
    price: 849,
    imageUrl: "/image/camera.png",
    brand: "Fujifilm",
    color: "Silver",
    condition: "Used",
    highestBidder: "****456",
    buyNowPrice: 1000,
    endDate: "26/10/2025",
    timeLeft: "1d left",
  },
  {
    id: 7,
    name: "Sony a6700",
    category: "camera",
    price: 1399,
    imageUrl: "/image/camera.png",
    brand: "Sony",
    color: "Black",
    condition: "New",
    highestBidder: "****789",
    buyNowPrice: 1500,
    endDate: "28/10/2025",
    timeLeft: "5d left",
  },
];

const UserProfile = () => {
  return (
    <div className="flex flex-col items-center">
      <ProfileInfo />
      <ProfileReviews />
      <ProfileTab />
      <ProductList
        products={MOCK_PRODUCTS}
        // sortBy={filters.sortBy}
        // onSortChange={(newValue) =>
        //   handleFilterChange("sortBy", newValue)
        // }
      />
    </div>
  );
};

export default UserProfile;
