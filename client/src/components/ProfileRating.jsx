import React from "react";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";

const ProfileRating = ({ ratings = [] }) => {
  const positiveCount = ratings.filter((r) => r.isPos).length;
  const negativeCount = ratings.filter((r) => !r.isPos).length;
  const totalRatings = positiveCount + negativeCount;

  // Tính % - Nếu chưa có rating nào thì mặc định là 0
  const positivePercent = totalRatings > 0 ? ((positiveCount / totalRatings) * 100).toFixed(0) : 0;
  const negativePercent = totalRatings > 0 ? ((negativeCount / totalRatings) * 100).toFixed(0) : 0;

  return (
    <div className="flex gap-10 items-center m-2">
      {/* Giữ nguyên phần Total Ratings */}
      <div className="flex flex-col items-center gap-2 border-r pr-10 border-gray-200">
        <p className="text-3xl font-bold text-body">
          {totalRatings}
        </p>
        <p className="text-sm font-medium text-gray-400 text-body whitespace-nowrap">
          total ratings
        </p>
      </div>

      <div className="flex flex-col gap-4 w-48">
        {/* Phần Positive % */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AiOutlineLike className="text-lg text-green-500" />
              <span className="text-sm font-semibold text-gray-700">
                Positive
              </span>
            </div>
            <span className="text-sm font-bold text-green-600">{positivePercent}%</span>
          </div>
          {/* Thanh scale mini */}
          <div className="w-full bg-gray-100 h-1.5 rounded-full">
            <div 
              className="bg-green-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${positivePercent}%` }}
            />
          </div>
        </div>

        {/* Phần Negative % */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AiOutlineDislike className="text-lg text-red-500" />
              <span className="text-sm font-semibold text-gray-700">
                Negative
              </span>
            </div>
            <span className="text-sm font-bold text-red-600">{negativePercent}%</span>
          </div>
          {/* Thanh scale mini */}
          <div className="w-full bg-gray-100 h-1.5 rounded-full">
            <div 
              className="bg-red-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${negativePercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileRating;