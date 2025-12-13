import { useState, useEffect } from "react";
import { getTimeRemaining } from "../helper/getTimeRemaining";
import InputPrice from "./InputPrice";
import SellerInformation from "./SellerInformation";
import { z } from "zod";
import { http } from "../lib/utils.js";

const ProductBidPlace = ({
  productId,
  endingDate,
  price,
  buyNowPrice,
  seller,
  bidder,
}) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(endingDate));
  const [bidValue, setBidValue] = useState("");
  const [isError, setIsError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const bidSchema = z
    .number({ invalid_type_error: "Bid must be a number" })
    .min(price || 0, `Bid must be at least ${price || 0} USD`);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(endingDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endingDate]);

  useEffect(() => {
    if (!bidValue) {
      setIsError(null);
      return;
    }

    const minPrice = Number(price) || 0;
    const parsed = Number(bidValue);

    const result = z
      .number()
      .min(minPrice, `Bid must be at least ${minPrice} USD`)
      .safeParse(parsed);

    setIsError(result.success ? null : result.error.issues[0].message);
  }, [bidValue, price]);

  const handlePlaceBid = async () => {
    if (isError || !bidValue) return;

    try {
      setIsSubmitting(true);
      setSubmitError(false);

      await http.post("/bids", {
        productId: productId,
        maxPrice: Number(bidValue),
      });

      setIsSuccess(true);
      setBidValue("");

      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-lg font-medium">Opening Bid</p>
          <p className="text-2xl font-bold text-yellow-400">
            {price ? price : 0} USD
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

        <div className="flex flex-row w-[90%] justify-between items-center">
          <p className="text-lg font-medium">Choose your maximum bid</p>
          <a className="text-sm font-extralight italic underline">
            How bidding works
          </a>
        </div>

        <InputPrice value={bidValue} onChange={setBidValue} />

        {isError && (
          <p className="w-[90%] text-center text-sm text-red-500">{isError}</p>
        )}

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
            disabled={!!isError || bidValue === ""}
            onClick={handlePlaceBid}
            className="w-[90%] h-10 bg-brand uppercase text-yellow-400 text-xl font-bold hover:bg-yellow-400 hover:text-brand transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <span className="animate-spin h-4 w-4 border-2 border-yellow-400 border-t-transparent rounded-full" />
            )}

            {isSuccess
              ? "✓ Bid placed"
              : isSubmitting
              ? "Placing bid..."
              : "Place Bid"}
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
