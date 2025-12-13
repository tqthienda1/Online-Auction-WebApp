import ProductCarousel from "../components/ProductCarousel.jsx";
import ProductTitle from "../components/ProductTitle.jsx";
import DetailNavBar from "../components/DetailNavBar.jsx";
import ProductDescription from "../components/ProductDescription.jsx";
import { useEffect, useState } from "react";
import ProductBidPlace from "../components/ProductBidPlace.jsx";
import BidHistory from "../components/BidHistory.jsx";
import SimilarProducts from "../components/SimilarProducts.jsx";
import CommentSection from "@/components/CommentSection.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import QuestionBox from "@/components/QuestionBox.jsx";
import { http } from "../lib/utils.js";
import { useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner.jsx";

const ProductDetails = () => {
  // Nho set isLoading ve true
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  const [product, setProduct] = useState([]);
  const [curFrame, setCurFrame] = useState("description");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async (productId) => {
      try {
        setIsLoading(true);
        setIsError(null);

        const res = await http.get(`/products/${id}`);
        if (isMounted) {
          setProduct(res.data.data);
        }
      } catch (error) {
        console.error("Error loading product");
        if (isMounted)
          setIsError(
            error.response?.data?.message || "Unable to load products"
          );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const handleFrameChange = (frame) => {
    setCurFrame(frame);
  };

  const [question, setQuestion] = useState("");
  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-full">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
      {isError && <div>{isError}</div>}
      {!isLoading && !isError && (
        <div className="overflow-hidden" data-aos="fade-up">
          <div className="p-10" data-aos="fade-down">
            <ProductCarousel images={product.productImages} />
          </div>
          <ProductTitle nameMain={product.productName} isSold={product.sold} />

          <div className="flex" data-aos="fade-up">
            <div className="flex flex-col w-3/4 ">
              <DetailNavBar
                frame={curFrame}
                onFrameChange={handleFrameChange}
              ></DetailNavBar>
              {curFrame === "description" && (
                <ProductDescription
                  descriptions={product.productDescriptions}
                />
              )}

              {curFrame === "bidhistory" && (
                <BidHistory BidHistory={product.bids} />
              )}
            </div>
            <ProductBidPlace
              productId={product.id}
              endingDate={product.endTime}
              price={product.currentPrice}
              buyNowPrice={product.buyNowPrice}
              seller={product.seller}
              bidder={product.highestBidder}
            />
          </div>
          <div data-aos="zoom-in">
            <CommentSection type="ask" comments={product.comments} />
            <QuestionBox />
          </div>

          <div
            className="flex justify-center items-center mt-20"
            data-aos="zoom-in"
          >
            <SimilarProducts products={product.relatedProducts} />
          </div>

          <div className="h-42 w-12"></div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
