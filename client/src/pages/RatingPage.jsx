import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "@/lib/utils";
import ProfileReviewCard from "@/components/ProfileReviewCard";
import ProfileRating from "@/components/ProfileRating";

const RatingPage = () => {
  const { userId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();

    const loadRatings = async () => {
      try {
        const res = await http.get(`/rating/${userId}`, {
          signal: controller.signal,
        });

        const data = res.data;
        console.log(data);
        setRatings(data);
      } catch (error) {
        console.error("Get ratings failed: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  return (
    <div className="flex flex-col items-center h-full">
      {!loading && (
        <>
          <div className="flex w-3/4 rounded-2xl p-10 border border-gray-200 shadow-md flex-1 items-start gap-10 mb-5">
            <div className="flex flex-col items-center">
              <div className="font-playfair font-semibold text-3xl my-3">
                {ratings[0]?.ratee.username}'s ratings
              </div>

              <ProfileRating ratings={ratings} />
            </div>

            <div className="flex flex-col h-[800px] w-full pr-7 gap-5 overflow-y-auto">
              {ratings.map((item, index) => (
                <ProfileReviewCard key={index} review={item} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RatingPage;
