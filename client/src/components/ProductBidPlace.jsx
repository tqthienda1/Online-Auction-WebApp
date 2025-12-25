import { useState, useEffect } from "react";
import { getTimeRemaining } from "../helper/getTimeRemaining";
import InputPrice from "./InputPrice";
import SellerInformation from "./SellerInformation";
import { http } from "../lib/utils.js";

const ProductBidPlace = ({
  productId,
  endingDate,
  currentPrice,
  buyNowPrice,
  bidStep,
  seller,
  bidder,
  onBidSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(endingDate));
  const [bidValue, setBidValue] = useState("");
  const [validationError, setValidationError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endingDate]);

  useEffect(() => {
    if (!bidValue) {
      setValidationError(null);
      return;
    }

    const value = Number(bidValue);
    console.log(value);

    if (Number.isNaN(value)) {
      setValidationError("Bid must be a number");
      return;
    }

    if (value < currentPrice) {
      setValidationError(`Bid must be at least ${currentPrice} USD`);
      return;
    }

    if ((value - currentPrice) % bidStep !== 0) {
      setValidationError(`Bid must increase by ${bidStep}`);
      return;
    }
    setValidationError(null);
  }, [bidValue, currentPrice]);

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

      <div className="flex flex-col items-center w-[90%] h-auto border mt-10 py-5 gap-5">
        <div className="flex flex-row w-[90%] justify-between items-center">
          <p className="text-lg font-medium">Ending</p>
          <div className="flex flex-col items-end">
            <p className="text-yellow-400 text-xl font-bold">
              {timeLeft.days}days, {timeLeft.hours}hours, {timeLeft.minutes}mins
            </p>
            <p className="text-md font-light">
              {new Date(endingDate).toLocaleString("en-US", {
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
            className="w-[90%] h-10 bg-neutral-300 uppercase text-brand text-xl font-bold hover:bg-neutral-400 transition"
          >
            Add to watch list
          </button>
        </div>
      </div>
      <SellerInformation seller={seller} bidder={bidder} />
    </div>
  );
};

export default ProductBidPlace;
