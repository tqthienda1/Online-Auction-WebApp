import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { RiAuctionLine } from "react-icons/ri";
import { LuTrophy } from "react-icons/lu";

const ProfileTab = ({ tab, setTab }) => {
  return (
    <div className="border-b-brand flex gap-5 items-center w-3/4">
      <button
        className={`w-30 cursor-pointer border px-3 py-1 font-semibold text-md rounded-lg flex items-center gap-1 justify-center ${
          tab === "watchList"
            ? "text-white bg-brand hover:bg-gray-500"
            : "text-brand hover:bg-gray-50"
        }`}
        onClick={() => setTab("watchList")}
      >
        <FaRegHeart className="text-sm h-full" />
        Watch List
      </button>
      <button
        className={`w-30 cursor-pointer border px-3 py-1 font-semibold text-md rounded-lg flex items-center gap-1 justify-center ${
          tab === "bidding"
            ? "text-white bg-brand hover:bg-gray-500"
            : "text-brand hover:bg-gray-50"
        }`}
        onClick={() => setTab("bidding")}
      >
        <RiAuctionLine className="text-sm h-full" />
        Bidding
      </button>
      <button
        className={`w-30 cursor-pointer border px-3 py-1 font-semibold text-md rounded-lg flex items-center gap-1 justify-center ${
          tab === "won"
            ? "text-white bg-brand hover:bg-gray-500"
            : "text-brand hover:bg-gray-50"
        }`}
        onClick={() => setTab("won")}
      >
        <LuTrophy className="text-sm h-full" />
        Won
      </button>
    </div>
  );
};

export default ProfileTab;
