import { useState, useEffect } from "react";
import InputPrice from "../InputPrice";
import SellerInformation from "./SellerInformation";
import { http } from "../../lib/utils.js";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";
import SellerPanel from "./SellerPanel.jsx";
import { toast } from "sonner";

const ProductBidPlace = ({
  product,
  auction,
  watchlist,
  canBid,
  canEdit,
  user,
  // onBidSuccess,
  onToggleWatchlist,
  onRequestBid,
  onBanBidder,
  banning,
  banError,
}) => {
  const [bidValue, setBidValue] = useState(
    `${auction.currentPrice + product.bidStep}`
  );
  const [validationError, setValidationError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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

    if (value < auction.currentPrice + product.bidStep) {
      setValidationError(
        `Bid must be at least ${auction.currentPrice + auction.bidStep} USD`
      );
      return;
    }

    setValidationError(null);
  }, [bidValue, auction.currentPrice, product.bidStep]);

  const handlePlaceBid = async () => {
    if (validationError || !bidValue) return;

    if (!user) {
      navigate("/login");

      return;
    }
    onRequestBid?.(Number(bidValue));
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

  if (product.sold) {
    return (
      <div className="flex flex-col w-1/3 items-center mt-10 gap-6">
        <div className="w-[90%] rounded-sm border p-6 bg-neutral-50 text-center">
          <p className="text-xl font-semibold mb-2">Auction Ended</p>

          {auction.highestBidder ? (
            <>
              <p className="text-lg">
                Winner:{" "}
                <span className="font-bold text-yellow-500">
                  {auction.highestBidder.username}
                </span>
              </p>

              <p className="mt-2 text-md font-medium">
                Winning bid: {auction.currentPrice} USD
              </p>

              {auction.isWinner && (
                <button
                  onClick={() =>
                    navigate(`/buyer/payment/${product.id}`, { replace: true })
                  }
                  className="
                    w-[90%] h-10 bg-brand uppercase text-yellow-400 text-xl font-bold
                  hover:bg-yellow-400 hover:text-brand transition
                    disabled:opacity-50 disabled:cursor-not-allowed mt-5 
                  "
                >
                  Proceed to Payment
                </button>
              )}
            </>
          ) : (
            <p className="italic text-gray-500 mt-2">
              No bids were placed for this auction
            </p>
          )}
        </div>

        <SellerInformation
          seller={product.seller}
          bidder={auction.highestBidder}
          onBanBidder={onBanBidder}
          banning={banning}
          banError={banError}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-1/3 items-center ">
      {canEdit ? (
        <SellerPanel
          product={product}
          auction={auction}
          onBanBidder={onBanBidder}
          banning={banning}
        />
      ) : (
        <>
          <div className=" h-12 mt-10 flex justify-center items-center">
            <p className="text-2xl font-medium font-playfair">Place your bid</p>
          </div>

          <div
            className={`flex flex-col items-center w-[90%] h-auto border mt-10 py-5 gap-5`}
          >
            <div className="flex flex-row w-[90%] justify-between items-center">
              <p className="text-lg font-medium">{auction.time.label}</p>
              <div className="flex flex-col items-end">
                <p className="text-yellow-400 text-xl font-bold">
                  {auction.time.remainingText}
                </p>

                <p className="text-md font-light">{auction.time.endAtText}</p>
              </div>
            </div>

            <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

            <div className="flex flex-row w-[90%] justify-between items-center ">
              <p className="text-lg font-medium">Current Price</p>
              <p className="text-2xl font-bold text-yellow-400">
                {auction.currentPrice
                  ? auction.currentPrice
                  : product.startingPrice}{" "}
                USD
              </p>
            </div>

            <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>
            {product.buyNowPrice && (
              <div className="flex flex-row w-[90%] justify-between items-center">
                <p className="text-lg font-medium">Buy Now Price</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {product.buyNowPrice} USD
                </p>
              </div>
            )}

            <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>
            {product.buyNowPrice && (
              <div className="flex flex-row w-[90%] justify-between items-center">
                <p className="text-lg font-medium">Bid Step</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {product.bidStep} USD
                </p>
              </div>
            )}

            <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

            <div className="flex flex-row w-[90%] justify-between items-center">
              <p className="text-lg font-medium">Choose your maximum bid</p>
              {/* <a className="text-sm font-extralight italic underline">
                How bidding works
              </a> */}
            </div>

            <InputPrice value={bidValue} onChange={setBidValue} />

            {/* <div className="flex w-[90%] text-end">
              <p className="text-xs font-extralight">
                This amount excludes shipping fees, applicable taxes, and will
                have a Buyer's Premium based on the hammer price of the lot:{" "}
                <span className="underline font-medium">Buyer's Premium.</span>
              </p>
            </div> */}

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
                disabled={watchlist.loading}
                onClick={onToggleWatchlist}
                className={`w-[90%] h-10 bg-neutral-300 uppercase text-brand text-xl font-bold hover:bg-neutral-400 transition cursor-pointer 
           ${
             watchlist.isWatched
               ? "bg-red-400 text-white hover:bg-red-500"
               : "bg-neutral-300 text-brand border-brand hover:bg-brand hover:text-black"
           }
            disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {watchlist.loading ? (
                  "Processing..."
                ) : watchlist.isWatched ? (
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
          <SellerInformation
            seller={product.seller}
            bidder={auction.highestBidder}
            onBanBidder={onBanBidder}
            banning={banning}
            banError={banError}
          />
        </>
      )}
    </div>
  );
};

export default ProductBidPlace;
