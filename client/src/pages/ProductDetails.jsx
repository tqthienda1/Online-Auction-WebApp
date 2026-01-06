import ProductCarousel from "../components/details/ProductCarousel.jsx";
import ProductTitle from "../components/details/ProductTitle.jsx";
import DetailNavBar from "../components/details/DetailNavBar.jsx";
import ProductDescription from "../components/details/ProductDescription.jsx";
import { useEffect, useState, useCallback } from "react";
import ProductBidPlace from "../components/details/ProductBidPlace.jsx";
import BidHistory from "../components/details/BidHistory.jsx";
import SimilarProducts from "../components/details/SimilarProducts.jsx";
import CommentSection from "@/components/details/CommentSection.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import QuestionBox from "@/components/details/QuestionBox.jsx";
import { http } from "../lib/utils.js";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { useProductPermission } from "@/hooks/useProductPermission.js";
import { useAuth } from "@/context/AuthContext.jsx";
import { getTimeRemaining } from "@/helper/getTimeRemaining.js";
import ConfirmActionModal from "@/components/details/ConfirmActionModal.jsx";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [auction, setAuction] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  // const [question, setQuestion] = useState("");
  const { user } = useAuth();
  const [curFrame, setCurFrame] = useState("description");
  const [isLoadingComment, setIsLoadingComment] = useState(false);
  const { canBid, canEditDescription, canBanBidder } = useProductPermission(
    user,
    product
  );
  const [descMessage, setDescMessage] = useState("");
  const [text, setText] = useState("");
  const [parent, setParent] = useState(null);
  const [isWatched, setIsWatched] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [banning, setBanning] = useState(false);
  const navigate = useNavigate();

  const [confirmModal, setConfirmModal] = useState(null);

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

  const handleSubmit = async (text) => {
    const controller = new AbortController();
    try {
      setIsLoadingComment(true);
      console.log(text);
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

    if (!user) {
      navigate("/login");

      return;
    }

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

  const placeBid = async (bidValue) => {
    await http.post("/bids", {
      productId: product.id,
      maxPrice: bidValue,
    });

    await handleBidSuccess();
  };

  const handleBanBidder = async (bidderId) => {
    if (banning) return;

    await http.post(`/products/${product.id}/reject-bidder`, {
      bidderId,
    });

    await handleBidSuccess();
  };

  const handleBuyNow = async (productId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    await http.post("/orders/buy-now", { productId });
    return productId;
  };

  const handleViewSellerRating = (sellerId) => {
    navigate(`/rating/${sellerId}`);
  };

  const requestConfirm = (type, payload) => {
    setConfirmModal({
      type,
      payload,
      status: "idle",
      error: null,
      result: null,
    });
  };

  const requestBuyNowConfirm = (productId) => {
    setConfirmModal({
      type: "buy-now",
      productId,
      status: "idle",
      error: null,
    });
  };

  const handleConfirmAction = async (modal) => {
    setConfirmModal((prev) => ({
      ...prev,
      status: "loading",
      error: null,
    }));

    try {
      let result;

      switch (modal.type) {
        case "bid":
          await placeBid(modal.payload.value);
          break;

        case "buy-now":
          result = await handleBuyNow(modal.payload.productId);
          break;

        case "ban":
          await handleBanBidder(modal.payload.bidderId);
          break;
      }

      setConfirmModal((prev) => ({
        ...prev,
        status: "success",
        result,
      }));
    } catch (err) {
      setConfirmModal((prev) => ({
        ...prev,
        status: "error",
        error: err.response?.data?.message || err.message,
      }));
    }
  };

  const closeModal = () => {
    if (confirmModal.type === "buy-now" && confirmModal.status === "success") {
      navigate(`/buyer/payment/${confirmModal.result}`);
    }

    setConfirmModal(null);
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
            ratingRequired: product.ratingRequired,
          }}
          auction={auctionView}
          watchlist={{ isWatched, loading: watchlistLoading }}
          canBid={canBid}
          canEdit={canEditDescription}
          user={user}
          onToggleWatchlist={handleToggleWatchlist}
          onRequestBid={(value) => requestConfirm("bid", { value })}
          onBuyNow={() =>
            requestConfirm("buy-now", {
              productId: product.id,
              buyNowPrice: product.buyNowPrice,
            })
          }
          onBanBidder={
            canBanBidder
              ? (bidderId) => requestConfirm("ban", { bidderId })
              : null
          }
          onViewSellerRating={handleViewSellerRating}
        />

        {confirmModal && (
          <ConfirmActionModal
            type={confirmModal.type}
            payload={confirmModal.payload}
            status={confirmModal.status}
            error={confirmModal.error}
            onConfirm={() => handleConfirmAction(confirmModal)}
            onCancel={closeModal}
          />
        )}
      </div>
      <div data-aos="zoom-in">
        <CommentSection
          type="ask"
          comments={product.comments}
          setParent={setParent}
          onReply={handleSubmit}
          user={user?.data}
          replyText={text}
          setReplyText={setText}
          isLoading={isLoadingComment}
          seller={product.seller.id}
        />

        {user?.data?.id !== product.seller.id && (
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
        <SimilarProducts
          products={product.relatedProducts}
          onBuyNow={(productId, buyNowPrice) =>
            requestConfirm("buy-now", {
              productId,
              buyNowPrice,
            })
          }
          user={user}
        />
      </div>

      <div className="h-42 w-12"></div>
    </div>
  );
};

export default ProductDetails;
