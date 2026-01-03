import React, { useState, useEffect } from "react";
import { RiAuctionLine } from "react-icons/ri";
import { BsFillCartCheckFill } from "react-icons/bs";
import { maskUsername } from "@/helper/maskUser";
import { formattedDate } from "@/helper/formatDate";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Spinner } from "./ui/spinner";

const RECENTLY_ADDED_DAYS = 1;

const ProductCard = ({
  product,
  showType,
  onAddToWatchList,
  onRemoveFromWatchList,
  isLoading,
  loadingItem,
}) => {
  const checkIsRecent = (timestamp) => {
    if (!timestamp) return false;
    const time = new Date(product.startTime);
    const now = new Date();
    const diffMs = now - time;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays < RECENTLY_ADDED_DAYS;
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const end = new Date(product.endTime);
    const diff = end - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [product.endTime]);

  const isRecentlyAdded = product.startTime
    ? checkIsRecent(product.startTime)
    : false;

  return (
    <div className="relative flex flex-col justify-between items-center border border-gray-200 rounded-lg shadow-sm bg-white p-4 transition-shadow hover:shadow-xl">
      {showType === 1 && (
        <>
          <div className="flex items-center justify-between w-full relative">
            <div>
              {isRecentlyAdded && (
                <span className="absolute top-0 left-0 h-full px-4 flex justify-center items-center bg-red-500 text-white text-xs font-semibold rounded-full z-10">
                  New
                </span>
              )}
            </div>
            {isLoading && loadingItem === product.id ? (
              <Spinner className="size-6 text-yellow-500" />
            ) : (
              <>
                {product.isLiked === true ? (
                  <button
                    className="h-full cursor-pointer"
                    onClick={() => onRemoveFromWatchList(product.id)}
                  >
                    <FaHeart className="text-2xl text-red-500 hover:text-red-600" />
                  </button>
                ) : (
                  <button
                    className="h-full cursor-pointer"
                    onClick={() => onAddToWatchList(product.id)}
                  >
                    <FaRegHeart className="text-2xl text-red-500 hover:text-red-600" />
                  </button>
                )}
              </>
            )}
          </div>
          <div className="w-full">
            <div className="aspect-video mb-3 flex items-center justify-center w-full">
              <Link key={product.id} to={`/products/${product.id}`}>
                <img
                  src={product.productAvt}
                  alt={product.productName}
                  className="max-h-40 w-full object-contain"
                />
              </Link>
            </div>
            <div className="flex items-center justify-center text-gray-500 mb-2">
              <RiAuctionLine className="w-7 h-7 mr-2" />
              <span className="text-brand font-semibold">
                {product.totalBid || 0}
              </span>
            </div>
            <h3 className="text-center font-semibold text-gray-800 mb-1 truncate">
              {product.productName}
            </h3>
            <p className="text-center text-yellow-500 font-bold text-lg mb-4">
              ${product.currentPrice}
            </p>
            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p className="flex justify-between">
                <span>Highest bidder:</span>
                <span className="font-medium">
                  {maskUsername(product.highestBidder?.username) || "None"}
                </span>
              </p>
              <p className="flex justify-between">
                <span>Buy now:</span>
                <span className="font-medium text-yellow-500">
                  ${product.buyNowPrice}
                </span>
              </p>
              <p className="flex justify-between text-gray-500">
                <span>Start date:</span>
                <span>
                  {new Date(product.startTime).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour12: false,
                  })}
                </span>
              </p>
              <p className="flex justify-between text-gray-500">
                <span>End in:</span>
                <span className="font-semibold">
                  {timeLeft
                    ? `${timeLeft.days > 0 ? timeLeft.days + "d " : ""}${String(
                        timeLeft.hours
                      ).padStart(2, "0")}:${String(timeLeft.minutes).padStart(
                        2,
                        "0"
                      )}:${String(timeLeft.seconds).padStart(2, "0")}`
                    : "Ended"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 w-full">
            <Link
              to={`/products/${product.id}`}
              className="flex w-1/2 items-center justify-center text-sm p-2 rounded-md bg-gray-100 cursor-pointer font-semibold hover:bg-gray-200 shadow-sm"
            >
              <button className="flex gap-1">
                <RiAuctionLine className="w-5 h-5 mr-1" /> Bid now
              </button>
            </Link>
            <Link
              to={`/products/${product.id}`}
              className="flex w-1/2 items-center justify-center text-sm p-2 rounded-md text-white cursor-pointer font-semibold bg-yellow-500 hover:bg-yellow-600 shadow-sm"
            >
              <button className="flex gap-1">
                <BsFillCartCheckFill className="w-5 h-5 mr-1" /> Buy now
              </button>
            </Link>
          </div>
        </>
      )}

      {/* TYPE 2: Watchlist & TYPE 5: Selling */}
      {(showType === 2 || showType === 5) && (
        <div className="w-[250px]">
          <div className="flex flex-col aspect-video w-full items-center justify-center">
            <Link
              to={`/products/${product.id}`}
              className="w-full flex items-center justify-center"
            >
              <img
                src={product.productAvt}
                alt={product.productName}
                className="max-h-40 max-w-full object-contain"
              />
            </Link>
            <h3 className="h-[50px] text-center font-semibold text-gray-800 mb-1 mt-5 wrap-break-word">
              {product.productName}
            </h3>
            <div className=" space-y-1 mb-4 w-full">
              <p className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Current price:</span>
                <span className="text-lg font-bold text-yellow-400">
                  {product.currentPrice.toLocaleString()}₫
                </span>
              </p>
              <p className="flex text-sm justify-between text-gray-500">
                <span>End:</span>
                <span>{new Date(product.endTime).toLocaleString()}</span>
              </p>
            </div>
            <Link to={`/products/${product.id}`} className="w-full">
              <button className="w-full flex items-center justify-center text-sm p-2 rounded-md cursor-pointer text-white font-semibold bg-yellow-500 hover:bg-yellow-600">
                See detail
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* TYPE 3: Bidding */}
      {showType === 3 && (
        <div className="w-[250px]">
          <div className="flex flex-col aspect-video w-full items-center justify-center">
            <Link
              to={`/products/${product.id}`}
              className="w-full flex items-center justify-center"
            >
              <img
                src={product.productAvt}
                alt={product.productName}
                className="max-h-40 max-w-full object-contain"
              />
            </Link>
            <h3 className="text-center font-semibold text-gray-800 mb-1 truncate mt-5">
              {product.productName}
            </h3>
            <div className=" space-y-1 mb-4 w-full">
              <p className="flex justify-between">
                <span className="text-sm text-gray-600">Current price:</span>
                <span className="text-lg font-bold text-yellow-400 flex items-center justify-center">
                  {product.currentPrice.toLocaleString()}₫
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-sm text-gray-600">Highest price:</span>
                <span className="text-lg font-bold text-yellow-400 flex items-center justify-center">
                  {product.currentPrice.toLocaleString()}₫
                </span>
              </p>
              <p className="flex text-sm justify-between text-gray-500">
                <span>End:</span>
                <span>{new Date(product.endTime).toLocaleString()}</span>
              </p>
            </div>
            <Link to={`/products/${product.id}`} className="w-full">
              <button className="w-full flex items-center justify-center text-sm p-2 rounded-md cursor-pointer text-white font-semibold bg-yellow-500 hover:bg-yellow-600">
                See detail
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* TYPE 4: Won & TYPE 6: Sold */}
      {(showType === 4 || showType === 6) && (
        <div className="w-[250px] cursor-pointer">
          <div className="flex flex-col aspect-video w-full items-center justify-center">
            <Link
              to={
                showType === 4
                  ? `/buyer/payment/${product.id}`
                  : `/seller/payment/${product.id}`
              }
            >
              <img
                src={product.productAvt}
                alt={product.productName}
                className="max-h-40 max-w-full object-contain"
              />
            </Link>
            <h3 className="text-center font-semibold text-gray-800 mb-1 truncate mt-5">
              {product.productName}
            </h3>
            <div className=" space-y-1 mb-4 w-full">
              <p className="flex justify-between">
                <span className="text-sm text-gray-600">
                  {showType === 4 ? "Won price:" : "Sold price:"}
                </span>
                <span className="text-lg font-bold text-yellow-400 flex items-center justify-center">
                  {product.currentPrice.toLocaleString()}₫
                </span>
              </p>
              <p className="flex gap-1 text-gray-600 justify-between items-center">
                <span className="text-sm ">
                  {showType === 4 ? "Seller:" : "Buyer:"}
                </span>
                <span className="text-sm font-semibold">
                  {product.sellerName || product.buyerName || "N/A"}
                </span>
              </p>
              <p className="flex text-sm justify-between text-gray-500">
                <span>End:</span>
                <span>{new Date(product.endTime).toLocaleString()}</span>
              </p>
            </div>
            <Link
              to={
                showType === 4
                  ? `/buyer/payment/${product.id}`
                  : `/seller/payment/${product.id}`
              }
              className="w-full"
            >
              <button className="w-full flex items-center justify-center text-sm p-2 rounded-md cursor-pointer text-white font-semibold bg-yellow-500 hover:bg-yellow-600">
                Payment and rating
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
