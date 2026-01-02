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
import NotFoundPage from "./NotFoundPage.jsx";
import { useProductPermission } from "@/hooks/useProductPermission.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { getTimeRemaining } from "@/helper/getTimeRemaining.js";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [auction, setAuction] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const { user } = useAuth();
  const [curFrame, setCurFrame] = useState("description");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const { canBid, canEditDescription } = useProductPermission(user, product);
  const [descMessage, setDescMessage] = useState("");
  const [text, setText] = useState("");
  const [parent, setParent] = useState(null);
  const [isWatched, setIsWatched] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [now, setNow] = useState(Date.now());

  const [loading, setLoading] = useState({
    product: true,
    auction: true,
    bidHistory: false,
    comment: true,
  });
  const [error, setError] = useState({
    product: null,
    auction: null,
    bidHistory: null,
  });

  const fetchProduct = useCallback(async () => {
    try {
      setLoading((p) => ({ ...p, product: true }));
      const res = await http.get(`/products/${id}`);
      setProduct(res.data.data);
    } catch {
      setError((p) => ({ ...p, product: "Failed to load product" }));
    } finally {
      setLoading((p) => ({ ...p, product: false }));
    }
  }, [id]);

  const fetchAuction = useCallback(async () => {
    try {
      setLoading((p) => ({ ...p, auction: true }));
      const res = await http.get(`/products/${id}/auction`);
      setAuction(res.data);
    } catch {
      setError((p) => ({ ...p, auction: "Failed to load auction state" }));
    } finally {
      setLoading((p) => ({ ...p, auction: false }));
    }
  }, [id]);

  const fetchBidHistory = useCallback(async () => {
    try {
      setLoading((p) => ({ ...p, bidHistory: true }));
      const res = await http.get(`/products/${id}/bid-history`);
      setBidHistory(res.data.bidHistories);
    } catch {
      setError((p) => ({ ...p, bidHistory: "Failed to load bid history" }));
    } finally {
      setLoading((p) => ({ ...p, bidHistory: false }));
    }
  }, [id]);

  const fetchWatchlistStatus = useCallback(async () => {
    try {
      setWatchlistLoading(true);
      const res = await http.get(`/watchlist/check/${id}`);
      setIsWatched(res.data.data.isLiked);
    } catch (err) {
      console.error("Failed to fetch watchlist status:", err);
    } finally {
      setWatchlistLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
    console.log("refetch");
  }, [fetchProduct]);

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  useEffect(() => {
    if (curFrame === "bidhistory" && bidHistory.length === 0) {
      fetchBidHistory();
    }
  }, [curFrame, bidHistory.length, fetchBidHistory]);

  useEffect(() => {
    fetchWatchlistStatus();
  }, [fetchWatchlistStatus]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading.product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <Spinner className="size-8 text-yellow-500" />
        <p className="mt-4 font-medium">Loading</p>
      </div>
    );
  }

  if (error.product) {
    return NotFoundPage();
  }

  if (!product) return null;

  const handleBidSuccess = async () => {
    await Promise.all([fetchAuction(), fetchBidHistory()]);
  };

  const handleSubmit = async () => {
    const controller = new AbortController();
    try {
      setIsLoadingComment(true);
      const newComment = await http.post(
        `/comments/products/${id}`,
        {
          content: text,
          parentID: parent,
        },
        {
          signal: controller.signal,
        }
      );

      console.log("p:", product);
      console.log("c", newComment.data.data);

      setProduct((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          comments: [newComment.data.data, ...prev.comments],
        };
      });

      console.log("np:", product);
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setIsLoadingComment(false);
      setText("");
    }
  };

  const handleUpdateDescription = async (htmlContent) => {
    if (!canEditDescription) return;
    if (!htmlContent || htmlContent.trim() === "") return;

    try {
      setDescMessage("Description adding...");

      const res = await http.put(`/products/${id}`, {
        descriptions: htmlContent,
      });

      setProduct((prev) => ({
        ...prev,
        productDescriptions: res.data,
      }));

      setDescMessage("Description added successfully");

      setTimeout(() => setDescMessage(null), 3000);
    } catch (err) {
      console.error("Failed to update description:", err);
      setDescMessage("Failed to add description");
    }
  };

  const handleToggleWatchlist = async () => {
    if (watchlistLoading) return;

    try {
      setWatchlistLoading(true);

      if (isWatched) {
        await http.delete(`/watchlist/${id}`);
        setIsWatched(false);
      } else {
        await http.post("/watchlist", { productId: id });
        setIsWatched(true);
      }
    } catch (err) {
      console.error("Watchlist action failed", err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const start = new Date(product.startTime).getTime();
  const end = new Date(product.endTime).getTime();

  let auctionState;
  if (product.sold || now >= end) auctionState = "ended";
  else if (now < start) auctionState = "upcoming";
  else auctionState = "live";

  const countDownTarget =
    auctionState === "upcoming" ? start : auctionState === "live" ? end : null;

  const timeLeft = countDownTarget
    ? getTimeRemaining(countDownTarget, now)
    : null;

  const auctionView = {
    currentPrice: auction?.currentPrice,
    highestBidder: auction?.highestBidder,
    isWinner: auction?.isWinner ?? false,

    state: auctionState,

    time:
      auctionState === "ended"
        ? {
            label: "Auction ended",
            remainingText: null,
            endAtText: null,
          }
        : auctionState === "upcoming"
        ? {
            label: "Starts in",
            remainingText: `${timeLeft.days}days ${timeLeft.hours}hours ${timeLeft.minutes}mins`,
            endAtText: new Date(start).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          }
        : {
            label: "Ends in",
            remainingText: `${timeLeft.days}days, ${timeLeft.hours}hours, ${timeLeft.minutes}mins`,
            endAtText: new Date(end).toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          },
  };

  return (
    <div className="overflow-hidden" data-aos="fade-up">
      <div className="p-10" data-aos="fade-down">
        <ProductCarousel images={product.productImages} />
      </div>
      <ProductTitle nameMain={product.productName} isSold={product.sold} />

      <div className="flex" data-aos="fade-up">
        <div className="flex flex-col w-3/4">
          <DetailNavBar
            frame={curFrame}
            onFrameChange={setCurFrame}
          ></DetailNavBar>
          {curFrame === "description" && (
            <ProductDescription
              descriptions={product.productDescriptions}
              editable={canEditDescription}
              onSave={handleUpdateDescription}
              message={descMessage}
            />
          )}

          {curFrame === "bidhistory" && (
            <BidHistory
              data={bidHistory}
              loading={loading.bidHistory}
              error={error.bidHistory}
            />
          )}
        </div>

        <ProductBidPlace
          product={{
            id: product.id,
            sold: product.sold,
            buyNowPrice: product.buyNowPrice,
            startingPrice: product.startingPrice,
            bidStep: product.bidStep,
            seller: product.seller,
          }}
          auction={auctionView}
          watchlist={{ isWatched, loading: watchlistLoading }}
          canBid={canBid}
          onBidSuccess={handleBidSuccess}
          onToggleWatchlist={handleToggleWatchlist}
        />
      </div>
      <div data-aos="zoom-in">
        <CommentSection
          type="ask"
          comments={product.comments}
          setParent={setParent}
          onReply={handleSubmit}
          user={user.data.role}
          replyText={text}
          setReplyText={setText}
          isLoading={isLoadingComment}
        />

        {user?.data.role === "BIDDER" && (
          <QuestionBox
            onSubmit={handleSubmit}
            question={text}
            setQuestion={setText}
            isLoading={isLoadingComment}
          />
        )}
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
