import React from "react";
import ProfileRating from "./ProfileRating";
import ProfileReviewCard from "./ProfileReviewCard";

const ProfileReviews = () => {
  return (
    <div className="flex flex-col gap-5 text-brand w-3/4 rounded-2xl p-10 border border-gray-200 shadow-md mb-5">
      <h1 className="font-bold text-2xl">Reviews and Comments</h1>
      <ProfileRating />
      <h3 className="font-semibold text-lg">Recent reviews</h3>
      <ProfileReviewCard />
      <ProfileReviewCard />
    </div>
  );
};

export default ProfileReviews;
