import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { RiAuctionLine } from "react-icons/ri";
import { LuTrophy } from "react-icons/lu";

const ProfileTab = () => {
  return (
    <div className="border-b-brand flex gap-5 items-center w-3/4">
      <button className="bg-brand text-white px-5 py-1 font-bold text-lg rounded-lg hover:bg-primary/85 flex items-center gap-2">
        <FaRegHeart className="text-md" />
        Love
      </button>
      <button className="text-brand px-5 py-1 font-bold text-lg rounded-lg hover:bg-gray-100 flex items-center gap-2">
        <RiAuctionLine className="text-md" />
        Bidding
      </button>
      <button className="text-brand px-5 py-1 font-bold text-lg rounded-lg hover:bg-gray-100 flex items-center gap-2">
        <LuTrophy className="text-md" />
        Won
      </button>
    </div>
  );
};

export default ProfileTab;
