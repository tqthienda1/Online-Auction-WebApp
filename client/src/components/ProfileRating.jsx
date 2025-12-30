import React from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const ProfileRating = ({ ratings = [] }) => {
  const positiveCount = ratings.filter((r) => r.isPos).length;
  const negativeCount = ratings.filter((r) => !r.isPos).length;
  const totalRatings = positiveCount + negativeCount;

  return (
    <div className="flex gap-10 items-center m-2">
      <div className="flex flex-col items-center gap-2">
        <p className="ms-2 text-3xl font-bold text-body">
          {totalRatings}
        </p>
        <p className="ms-2 text-sm font-medium text-gray-400 text-body">
          {totalRatings} total ratings
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <AiOutlineLike className="text-lg text-green-500" />
          <span className="text-sm font-medium text-gray-700">
            {positiveCount} positive
          </span>
        </div>
        <div className="flex items-center gap-4">
          <AiOutlineDislike className="text-lg text-red-500" />
          <span className="text-sm font-medium text-gray-700">
            {negativeCount} negative
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileRating;
