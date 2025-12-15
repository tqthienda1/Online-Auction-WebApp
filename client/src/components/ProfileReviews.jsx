import React from "react";
import ProfileRating from "./ProfileRating";
import ProfileReviewCard from "./ProfileReviewCard";

const review1 = {
  rater: "thiendepzai",
  productName: "sextoy",
  content: "nhu cc",
  like: false,
  date: "13/07/2025",
};

const review2 = {
  rater: "thiendepzai",
  productName: "sextoy",
  content: "phe nhen",
  like: true,
  date: "13/07/2025",
};

const ProfileReviews = () => {
  return (
    <div className="flex flex-col gap-5 text-brand w-3/4 rounded-2xl p-10 border border-gray-200 shadow-md mb-5">
      <h1 className="font-bold text-2xl font-playfair">Reviews and Comments</h1>
      <ProfileRating />
      <h3 className="font-semibold text-lg font-playfair">Recent reviews</h3>
      <ProfileReviewCard review={review1} />
      <ProfileReviewCard review={review2} />
    </div>
  );
};

export default ProfileReviews;
