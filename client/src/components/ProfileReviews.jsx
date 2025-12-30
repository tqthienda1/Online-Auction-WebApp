import React, { useEffect, useState } from "react";
import ProfileRating from "./ProfileRating";
import ProfileReviewCard from "./ProfileReviewCard";
import { http } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const ProfileReviews = () => {
  const [ratings, setRatings] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviewsData = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch ratings and comments...");
        
        const ratingsRes = await http.get("/user/me/ratings");
        console.log("Ratings API Response:", ratingsRes);
        console.log("   ratingsRes.data type:", typeof ratingsRes.data);
        console.log("   ratingsRes.data:", ratingsRes.data);
        
        const commentsRes = await http.get("/user/me/comments");
        console.log("Comments API Response:", commentsRes);
        console.log("   commentsRes.data type:", typeof commentsRes.data);
        console.log("   commentsRes.data:", commentsRes.data);
        
        // Handle both formats: direct array or wrapped in { data: [...] }
        const ratingsData = Array.isArray(ratingsRes.data) 
          ? ratingsRes.data 
          : (Array.isArray(ratingsRes.data?.data) ? ratingsRes.data.data : []);
          
        const commentsData = Array.isArray(commentsRes.data) 
          ? commentsRes.data 
          : (Array.isArray(commentsRes.data?.data) ? commentsRes.data.data : []);
        
        console.log("Final ratings data:", ratingsData);
        console.log("Final comments data:", commentsData);
        
        setRatings(ratingsData);
        setComments(commentsData);
      } catch (error) {
        console.error("ERROR fetching reviews:", error.message);
        console.error("Error details:", error.response?.data || error);
        setRatings([]);
        setComments([]);
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
      <h1 className="font-bold text-2xl font-playfair">Reviews and Comments</h1>
      <ProfileRating ratings={ratings} />
      <h3 className="font-semibold text-lg font-playfair">Recent reviews</h3>
      
      {/* Combine ratings and comments for display */}
      {(Array.isArray(ratings) && ratings.length > 0) || (Array.isArray(comments) && comments.length > 0) ? (
        <div className="max-h-96 overflow-y-auto">
          <div className="flex flex-col gap-4">
            {/* Display ratings with comments */}
            {Array.isArray(ratings) && ratings.map((rating) => (
              <ProfileReviewCard
                key={`rating-${rating.productID}`}
                review={{
                  rater: rating.rater?.username || "Unknown",
                  productName: rating.product?.productName || "Unknown Product",
                  content: rating.comment || "",
                  date: new Date(rating.createdAt || Date.now()).toLocaleDateString("vi-VN"),
                  like: rating.isPos,
                  isComment: false,
                }}
              />
            ))}
            
            {/* Display comments */}
            {Array.isArray(comments) && comments.map((comment) => (
              <ProfileReviewCard
                key={`comment-${comment.id}`}
                review={{
                  rater: comment.user?.username || "Unknown",
                  productName: comment.product?.productName || "Unknown Product",
                  content: comment.content,
                  date: new Date(comment.createdAt).toLocaleDateString("vi-VN"),
                  isComment: true,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-400">No reviews or comments yet</p>
      )}
    </div>
  );
};

export default ProfileReviews;
