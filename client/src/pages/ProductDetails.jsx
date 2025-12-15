import ProductCarousel from "../components/ProductCarousel.jsx";
import ProductTitle from "../components/ProductTitle.jsx";
import DetailNavBar from "../components/DetailNavBar.jsx";
import ProductDescription from "../components/ProductDescription.jsx";
import { useEffect, useState, useCallback } from "react";
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
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);
  const [product, setProduct] = useState();
  const [curFrame, setCurFrame] = useState("description");
  const [question, setQuestion] = useState("");

  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await http.get(`/products/${id}`);

      setProduct(res.data.data);
    } catch (err) {
      setIsError("Failed to load product.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner className="size-8 text-yellow-500" />
        <p className="mt-4 font-medium">Loading product...</p>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500">{isError}</div>;
  }

  if (!product) return null;

  return (
    <div className="overflow-hidden" data-aos="fade-up">
      <div className="p-10" data-aos="fade-down">
        <ProductCarousel images={product.productImages} />
      </div>
      <ProductTitle nameMain={product.productName} isSold={product.sold} />

      <div className="flex" data-aos="fade-up">
        <div className="flex flex-col w-3/4 ">
          <DetailNavBar
            frame={curFrame}
            onFrameChange={setCurFrame}
          ></DetailNavBar>
          {curFrame === "description" && (
            <ProductDescription descriptions={product.productDescriptions} />
          )}

          {curFrame === "bidhistory" && (
            <BidHistory BidHistory={product.bids} />
          )}
        </div>
        <ProductBidPlace
          productId={product.id}
          endingDate={product.endTime}
          price={product.currentPrice || product.startingPrice}
          buyNowPrice={product.buyNowPrice}
          seller={product.seller}
          bidder={product.highestBidder}
          onBidSuccess={fetchProduct}
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
  );
};

export default ProductDetails;
