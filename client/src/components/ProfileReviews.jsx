import React, { useEffect, useState } from "react";
import ProfileRating from "./ProfileRating";
import ProfileReviewCard from "./ProfileReviewCard";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FaAngleDoubleDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileReviews = ({ info }) => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviewsData = async () => {
      try {
        setLoading(true);

        const ratingsRes = await http.get("/user/me/ratings");

        // Handle both formats: direct array or wrapped in { data: [...] }
        const ratingsData = Array.isArray(ratingsRes.data)
          ? ratingsRes.data
          : Array.isArray(ratingsRes.data?.data)
          ? ratingsRes.data.data
          : [];

        console.log(ratingsData);

        setRatings(ratingsData);
      } catch (error) {
        console.error("ERROR fetching reviews:", error.message);
        console.error("Error details:", error.response?.data || error);
        setRatings([]);
      } finally {
        setLoading(false);
      }
    };

    loadReviewsData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center w-3/4 rounded-2xl p-10 border border-gray-200 shadow-md mb-5">
        <Spinner className="size-8 text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 text-brand w-3/4 rounded-2xl p-10 border border-gray-200 shadow-md mb-5">
      <h1 className="font-bold text-2xl font-playfair">Ratings</h1>
      <ProfileRating ratings={ratings} />
      <h3 className="font-semibold text-lg font-playfair">Recent ratings</h3>
      {/* Combine ratings and comments for display */}
      {Array.isArray(ratings) && ratings.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* Display ratings with comments */}
            {Array.isArray(ratings) &&
              ratings.map((rating) => (
                <ProfileReviewCard
                  key={`rating-${rating.productID}`}
                  review={{
                    rater: { username: rating.rater?.username || "Unknown" },
                    productName: {
                      productName:
                        rating.product?.productName || "Unknown Product",
                    },
                    comment: rating.comment || "",
                    isPos: rating.isPos,
                  }}
                />
              ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No ratings yet</p>
      )}
      <Link
        to={`/rating/${info.id}`}
        className="flex justify-center items-center gap-1 font-semibold text-gray-400 cursor-pointer"
      >
        View more
        <FaAngleDoubleDown className="-mb-1" />
      </Link>
    </div>
  );
};

export default ProfileReviews;
