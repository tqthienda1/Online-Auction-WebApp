import { useState, useEffect } from "react";
import { getTimeRemaining } from "../helper/getTimeRemaining";
import InputPrice from "./InputPrice";
import SellerInformation from "./SellerInformation";
import { http } from "../lib/utils.js";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

const ProductBidPlace = ({
  productId,
  startTime,
  endTime,
  currentPrice,
  buyNowPrice,
  bidStep,
  seller,
  bidder,
  onBidSuccess,
  isSold,
  isWatched,
  watchlistLoading,
  onToggleWatchlist,
}) => {
  const [now, setNow] = useState(Date.now());
  const [timeLeft, setTimeLeft] = useState();
  const [bidValue, setBidValue] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  let auctionState;

  if (isSold || now >= end) {
    auctionState = "ended";
  } else if (now < start) {
    auctionState = "upcoming";
  } else {
    auctionState = "live";
  }
  const isBidDisabled = auctionState !== "live";
  const countDownTarget =
    auctionState === "upcoming" ? start : auctionState === "live" ? end : null;

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!countDownTarget) {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(getTimeRemaining(countDownTarget));

    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(countDownTarget));
    }, 1000);

    return () => clearInterval(timer);
  }, [countDownTarget]);

  useEffect(() => {
    if (!bidValue) {
      setValidationError(null);
      return;
    }

    const value = Number(bidValue);

    if (Number.isNaN(value)) {
      setValidationError("Bid must be a number");
      return;
    }

    if (value < currentPrice + bidStep) {
      setValidationError(`Bid must be at least ${currentPrice + bidStep} USD`);
      return;
    }

    setValidationError(null);
  }, [bidValue, currentPrice, bidStep]);

  const handlePlaceBid = async () => {
    if (validationError || !bidValue) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await http.post("/bids", {
        productId,
        maxPrice: Number(bidValue),
      });

      setBidValue("");
      onBidSuccess?.();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  {
    validationError && (
      <p className="w-[90%] text-center text-sm text-red-500">
        {validationError}
      </p>
    );
  }

  {
    submitError && (
      <p className="w-[90%] text-center text-sm text-red-500">{submitError}</p>
    );
  }

  return (
    <div className="flex flex-col w-1/3 items-center ">
      <div className=" h-12 mt-10 flex justify-center items-center">
        <p className="text-2xl font-medium font-playfair">Place your bid</p>
      </div>

      <div
        className={`flex flex-col items-center w-[90%] h-auto border mt-10 py-5 gap-5  ${
          isBidDisabled ? "pointer-events-none opacity-60" : ""
        }`}
      >
        <div className="flex flex-row w-[90%] justify-between items-center">
          <p className="text-lg font-medium">
            {auctionState === "upcoming" && "Starts in"}
            {auctionState === "live" && "Ends in"}
            {auctionState === "ended" && "Auction ended"}
          </p>
          <div className="flex flex-col items-end">
            {timeLeft && (
              <p className="text-yellow-400 text-xl font-bold">
                {timeLeft.days}days, {timeLeft.hours}hours, {timeLeft.minutes}
                mins
              </p>
            )}
            <p className="text-md font-light">
              {new Date(endTime).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

        <div className="flex flex-row w-[90%] justify-between items-center ">
          <p className="text-lg font-medium">Current Price</p>
          <p className="text-2xl font-bold text-yellow-400">
            {currentPrice ? currentPrice : 0} USD
          </p>
        </div>

        <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>
        {buyNowPrice && (
          <div className="flex flex-row w-[90%] justify-between items-center">
            <p className="text-lg font-medium">Buy Now Price</p>
            <p className="text-2xl font-bold text-yellow-400">
              {buyNowPrice} USD
            </p>
          </div>
        )}

        <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>
        {buyNowPrice && (
          <div className="flex flex-row w-[90%] justify-between items-center">
            <p className="text-lg font-medium">Bid Step</p>
            <p className="text-2xl font-bold text-yellow-400">{bidStep} USD</p>
          </div>
        )}

        <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

        <div className="flex flex-row w-[90%] justify-between items-center">
          <p className="text-lg font-medium">Choose your maximum bid</p>
          <a className="text-sm font-extralight italic underline">
            How bidding works
          </a>
        </div>

        <InputPrice value={bidValue} onChange={setBidValue} />

        <div className="flex w-[90%] text-end">
          <p className="text-xs font-extralight">
            This amount excludes shipping fees, applicable taxes, and will have
            a Buyer's Premium based on the hammer price of the lot:{" "}
            <span className="underline font-medium">Buyer's Premium.</span>
          </p>
        </div>

        <div className="flex flex-col w-full justify-center items-center gap-2">
          <button
            type="button"
            disabled={!!validationError || !bidValue || isSubmitting}
            onClick={handlePlaceBid}
            className="w-[90%] h-10 bg-brand uppercase text-yellow-400 text-xl font-bold
             hover:bg-yellow-400 hover:text-brand transition
             disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <span className="inset-x-0 bottom-0 h-1 bg-yellow-400 animate-pulse" />
            )}

            {isSubmitting ? "Placing bid..." : "Place Bid"}
          </button>

          <button
            type="button"
            disabled={watchlistLoading}
            onClick={onToggleWatchlist}
            className={`w-[90%] h-10 bg-neutral-300 uppercase text-brand text-xl font-bold hover:bg-neutral-400 transition cursor-pointer 
           ${
             isWatched
               ? "bg-red-400 text-white hover:bg-red-500"
               : "bg-neutral-300 text-brand border-brand hover:bg-brand hover:text-black"
           }
            disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {watchlistLoading ? (
              "Processing..."
            ) : isWatched ? (
              <div className="flex justify-center items-center gap-2">
                <FaHeart />
                Remove from watch list
              </div>
            ) : (
              <div className="flex justify-center items-center gap-2">
                <FaRegHeart />
                Add to watch list
              </div>
            )}
          </button>
        </div>
      </div>
      <SellerInformation seller={seller} bidder={bidder} />
    </div>
  );
};

export default ProductBidPlace;
