import React from "react";
import { RiAuctionLine } from "react-icons/ri";
import { BsFillCartCheckFill } from "react-icons/bs";
import { maskUsername } from "@/helper/maskUser";
import { formattedDate } from "@/helper/formatDate";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const RECENTLY_ADDED_MINUTES = 1;

const ProductCard = ({
  product,
  showType,
  onAddToWatchList,
  onRemoveFromWatchList,
}) => {
  const checkIsRecent = (timestamp) => {
    if (!timestamp) return false;

    const time = new Date(product.startTime);
    const now = new Date();
    const diffMs = now - time;
    const diffMinutes = diffMs / (1000 * 60);
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays < RECENTLY_ADDED_MINUTES;
  };

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
                <span>End:</span>
                <span>
                  {new Date(product.endTime).toLocaleString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour12: false,
                  })}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 w-full">
            <button className="flex w-1/2 items-center justify-center text-sm p-2 rounded-md bg-gray-100 cursor-pointer font-semibold hover:bg-gray-200 shadow-sm">
              <RiAuctionLine className="w-5 h-5 mr-1" />
              Bid now
            </button>
            <button className="flex w-1/2 items-center justify-center text-sm p-2 rounded-md text-white cursor-pointer font-semibold bg-yellow-500 hover:bg-yellow-600 shadow-sm">
              <BsFillCartCheckFill className="w-5 h-5 mr-1" />
              Buy now
            </button>
          </div>
        </>
      )}

      {showType === 2 && (
        <div className="w-[250px] cursor-pointer">
          <div className="flex flex-col aspect-video w-full items-center justify-center">
            <img
              src={product.productAvt}
              alt={product.productName}
              className="max-h-40 max-w-full object-contain"
            />

            <h3 className="text-center font-semibold text-gray-800 mb-1 truncate mt-5">
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
            <button className="w-full flex items-center justify-center text-sm p-2 rounded-md cursor-pointer text-white font-semibold bg-yellow-500 hover:bg-yellow-600">
              Bid now
            </button>
          </div>
        </div>
      )}

      {showType === 3 && (
        <div className="w-[250px] cursor-pointer">
          <div className="flex flex-col aspect-video w-full items-center justify-center">
            <img
              src={product.productAvt}
              alt={product.productName}
              className="max-h-40 max-w-full object-contain"
            />

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
            <button className="w-full flex items-center justify-center text-sm p-2 rounded-md cursor-pointer text-white font-semibold bg-yellow-500 hover:bg-yellow-600">
              Raise the bid
            </button>
          </div>
        </div>
      )}

      {showType === 4 && (
        <div className="w-[250px] cursor-pointer">
          <div className="flex flex-col aspect-video w-full items-center justify-center">
            <Link to={`/buyer/payment/${product.id}`}>
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
                <span className="text-sm text-gray-600">Won price:</span>
                <span className="text-lg font-bold text-yellow-400 flex items-center justify-center">
                  {product.currentPrice.toLocaleString()}₫
                </span>
              </p>

              <p className="flex gap-1 text-gray-600 justify-between items-center">
                <span className="text-sm ">Seller:</span>
                <span className="text-sm font-semibold">
                  {product.sellerID}
                </span>
              </p>

              <p className="flex text-sm justify-between text-gray-500">
                <span>End:</span>
                <span>{new Date(product.endTime).toLocaleString()}</span>
              </p>
            </div>
            <button className="w-full flex items-center justify-center text-sm p-2 rounded-md cursor-pointer text-white font-semibold bg-yellow-500 hover:bg-yellow-600">
              Rate the seller
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
