import React from "react";

import { LuCamera } from "react-icons/lu";
import { BiSearch } from "react-icons/bi";

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
    <div className="relative flex flex-col justify-between border border-gray-200 rounded-lg shadow-sm bg-white p-4 transition-shadow hover:shadow-md">
      {isRecentlyAdded && (
        <span className="absolute top-0 left-0 -mt-3 ml-3 bg-yellow-400 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full z-10">
          Recently added
        </span>
      )}

      <div>
        <div className="aspect-video w-full mb-3 flex items-center justify-center">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-h-32 max-w-full object-contain"
          />
        </div>

        <div className="flex items-center justify-center text-gray-500 mb-2">
          <LuCamera className="w-5 h-5 mr-1" />
          <span>{product.bidCount}</span>
        </div>

        <h3 className="text-center font-semibold text-gray-800 mb-1 truncate">
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
            <span className="font-medium">${product.buyNowPrice}</span>
          </p>
          <p className="flex justify-between text-gray-500">
            <span>{product.endDate}</span>
            <span>{product.timeLeft}</span>
          </p>
        </div>
      </div>

      <button className="w-full flex items-center justify-center p-2 rounded-md border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
        <BiSearch className="w-5 h-5 mr-2" />
        Bid now
      </button>
    </div>
  );
};

export default ProductCard;
