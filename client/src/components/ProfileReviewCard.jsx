import React from "react";
import { BiMessageRounded } from "react-icons/bi";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const ProfileReviewCard = ({ review }) => {
  return (
    <div className="flex flex-col gap-5 border border-gray-100 rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <h1>{review.rater}</h1>
        {review.isComment ? (
          <BiMessageRounded className="text-blue-500" />
        ) : review.like ? (
          <AiOutlineLike className="text-green-500" />
        ) : (
          <AiOutlineDislike className="text-red-500" />
        )}
      </div>
      <div className="flex text-sm gap-2 text-gray-400 items-center">
        <h3>Product: </h3>
        <h3 className="font-semibold text-gray-500">{review.productName}</h3>
      </div>
      <div className="flex items-center mt-3 gap-2">
        <BiMessageRounded />
        <p className="text-sm">{review.content}</p>
      </div>

      <h3 className="text-sm text-gray-400">{review.date}</h3>
    </div>
  );
};

export default ProfileReviewCard;
