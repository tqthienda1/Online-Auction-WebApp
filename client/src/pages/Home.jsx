import ProductCoverflow from "../components/ProductCoverflow";
import HomeProductCarousel from "../components/HomeProductCarousel";
import { Spinner } from "@/components/ui/spinner";

import { useEffect, useState } from "react";

import { http } from "@/lib/utils";
import { formattedDate } from "@/helper/formatDate";

const Home = () => {
  const [loading, setLoading] = useState(true);

  const [endingSoonProducts, setEndingSoonProducts] = useState([]);

  const [mostBiddenProducts, setMostBiddenProducts] = useState([]);
  const [highestPriceProducts, setHighestPriceProducts] = useState([]);
  useEffect(() => {
    const controller = new AbortController();

    const loadEndingSoonProduct = async () => {
      try {
        const res = await Promise.all([
          http.get("/products", {
            params: {
              sortBy: "endTime",
              order: "asc",
              limit: 5,
              sold: false,
            },
            // signal: controller.signal,
          }),
          http.get("/products", {
            params: {
              sortBy: "totalBid",
              limit: 5,
              order: "desc",
              sold: false,
            },
            // signal: controller.signal,
          }),
          http.get("/products", {
            params: {
              sortBy: "currentPrice",
              limit: 5,
              order: "desc",
              sold: false,
            },
            // signal: controller.signal,
          }),
        ]);

        console.log(res);

        const endingSoonData = res[0].data.data;
        const mostBiddenData = res[1].data.data;
        const highestPriceData = res[2].data.data;

        endingSoonData.forEach((item) => {
          item.startTime = formattedDate(item.startTime);
          item.endTime = formattedDate(item.endTime);
        });

        mostBiddenData.forEach((item) => {
          item.startTime = formattedDate(item.startTime);
          item.endTime = formattedDate(item.endTime);
        });

        highestPriceData.forEach((item) => {
          item.startTime = formattedDate(item.startTime);
          item.endTime = formattedDate(item.endTime);
        });

        setEndingSoonProducts(endingSoonData);
        setMostBiddenProducts(mostBiddenData);
        setHighestPriceProducts(highestPriceData);
      } catch (error) {
        console.error("Load ending soon products failed: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadEndingSoonProduct();

    return () => controller.abort();
  }, []);

  return (
    <>
      {!loading && (
        <>
          <ProductCoverflow products={endingSoonProducts} />

          <HomeProductCarousel
            heading="Most Bidden Items"
            product={mostBiddenProducts}
          />
          <HomeProductCarousel
            heading="Highest - price Items"
            product={highestPriceProducts}
          />
        </>
      )}
      {loading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-full overflow-hidden">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
    </>
  );
};

export default Home;
