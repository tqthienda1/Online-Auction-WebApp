import React from "react";

import { RiAuctionLine } from "react-icons/ri";
import { BsFillCartCheckFill } from "react-icons/bs";

const RECENTLY_ADDED_MINUTES = 30;

const ProductCard = ({ product }) => {
  const checkIsRecent = (timestamp) => {
    if (!timestamp) return false;

    const createdAt = new Date(timestamp);
    const now = new Date();

    const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);

    return diffInMinutes < RECENTLY_ADDED_MINUTES;
  };

  const isRecentlyAdded = checkIsRecent(product.createdAt);

  return (
    <div className="relative flex flex-col justify-between border border-gray-200 rounded-lg shadow-sm bg-white p-4 transition-shadow hover:shadow-xl">
      {isRecentlyAdded && (
        <span className="absolute top-0 left-0 -mt-3 ml-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full z-10">
          Recently added
        </span>
      )}

      <div>
        <div className="aspect-video w-full mb-3 flex items-center justify-center ">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-40 max-w-full object-contain"
          />
        </div>

        <div className="flex items-center justify-center text-gray-500 mb-2">
          <RiAuctionLine className="w-7 h-7 mr-2" />
          <span className="text-brand font-semibold">{product.bidCount}</span>
        </div>

        <h3 className="text-center font-semibold text-gray-800 mb-1 truncate font-playfair">
          {product.name}
        </h3>

        <p className="text-center text-yellow-500 font-bold text-lg mb-4">
          ${product.price.toFixed(2)}
        </p>

        <div className="text-sm text-gray-600 space-y-1 mb-4">
          <p className="flex justify-between">
            <span>Highest bidder:</span>
            <span className="font-medium">{product.highestBidder}</span>
          </p>
          <p className="flex justify-between">
            <span>Buy now:</span>
            <span className="font-medium text-yellow-500">
              ${product.buyNowPrice}
            </span>
          </p>
          <p className="flex justify-between text-gray-500">
            <span>{product.endDate}</span>
            <span>{product.timeLeft}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button className="w-full flex items-center justify-center p-2 rounded-md border-2 border-gray-300 text-brand font-semibold hover:bg-gray-100 transition-colors">
          <RiAuctionLine className="w-5 h-5 mr-2" />
          Bid now
        </button>
        <button className="w-full flex items-center justify-center p-2 rounded-md border-2 border-gray-300 text-brand font-semibold hover:bg-yellow-600 transition-colors bg-yellow-500">
          <BsFillCartCheckFill className="w-5 h-5 mr-2" />
          Buy now
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
