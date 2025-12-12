import ProductCoverflow from "../components/ProductCoverflow";
import HomeProductCarousel from "../components/HomeProductCarousel";
import { Spinner } from "@/components/ui/spinner";

import { useEffect, useState } from "react";

import { http } from "@/lib/utils";
import { formattedDate } from "@/helper/formatDate";

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
  const [loading, setLoading] = useState(true);

  const [endingSoonProducts, setEndingSoonProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadEndingSoonProduct = async () => {
      try {
        if (isMounted) {
          setLoading(true);
        }
        const res = await http.get("/products", {
          params: {
            sortBy: "endTime",
            limit: 5,
          },
        });

        const data = res.data.data;
        console.log(data);

        data.forEach((item) => {
          item.startTime = formattedDate(item.startTime);
          item.endTime = formattedDate(item.endTime);
        });

        if (isMounted) {
          setEndingSoonProducts(data);
        }
      } catch (error) {
        console.error("Load ending soon products failed: ", error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadEndingSoonProduct();
  }, []);

  return (
    <div className="">
      {!loading && (
        <>
          <ProductCoverflow products={endingSoonProducts} />

          <HomeProductCarousel
            heading="Most Bidden Items"
            product={mockUpData.product}
          />
          <HomeProductCarousel
            heading="Highest - price Items"
            product={mockUpData.product}
          />
        </>
      )}
      {loading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
    </div>
  );
};

export default Home;
