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
  useEffect(() => {
    let isMounted = true;

    const loadEndingSoonProduct = async () => {
      try {
        if (isMounted) {
          setLoading(true);
        }
        const res = await Promise.all([
          http.get("/products", {
            params: {
              sortBy: "endTime",
              limit: 5,
            },
          }),
          http.get("/products", {
            params: {
              sortBy: "totalBid",
              limit: 5,
              order: "desc",
            },
          }),
          http.get(""),
        ]);

        const endingSoonData = res[0].data.data;
        const mostBiddenData = res[1].data.data;

        endingSoonData.forEach((item) => {
          item.startTime = formattedDate(item.startTime);
          item.endTime = formattedDate(item.endTime);
        });

        mostBiddenData.forEach((item) => {
          item.startTime = formattedDate(item.startTime);
          item.endTime = formattedDate(item.endTime);
        });

        console.log(endingSoonData);

        if (isMounted) {
          setEndingSoonProducts(endingSoonData);
          setMostBiddenProducts(mostBiddenData);
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
    <>
      {!loading && (
        <>
          <ProductCoverflow products={endingSoonProducts} />

          <HomeProductCarousel
            heading="Most Bidden Items"
            product={mostBiddenProducts}
          />
          {/* <HomeProductCarousel
            heading="Highest - price Items"
            product={mockUpData.product}
          /> */}
        </>
      )}
      {loading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-full">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
    </>
  );
};

export default Home;
