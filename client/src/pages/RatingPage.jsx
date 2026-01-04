import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { http } from "@/lib/utils";
import ProfileReviewCard from "@/components/ProfileReviewCard";
import ProfileRating from "@/components/ProfileRating";
import NotFoundPage from "./NotFoundPage";
import { Spinner } from "@/components/ui/spinner";

const RatingPage = () => {
  const { userId } = useParams();
  const [ratings, setRatings] = useState([]);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();

    const loadRatings = async () => {
      try {
        const res = await Promise.all([
          http.get(`/rating/${userId}`, {
            signal: controller.signal,
          }),
          http.get(`/user/${userId}`, {
            signal: controller.signal,
          }),
        ]);

        setRatings(res[0].data);
        setInfo(res[1].data);
      } catch (error) {
        setError(true);

        console.error("Get ratings failed: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  return (
    <div className="flex flex-col items-center h-full">
      {loading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-full overflow-hidden">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="flex w-3/4 gap-10">
            <div className="h-[300px] flex flex-col items-center rounded-2xl p-10 border border-gray-200 shadow-md gap-10">
              <div className="font-playfair font-semibold text-3xl my-3">
                {info.username}'s ratings
              </div>

              <ProfileRating ratings={ratings} />
            </div>

            <div className="flex flex-col w-full rounded-2xl p-10 border border-gray-200 shadow-md items-start gap-10 mb-5">
              <div className="font-playfair font-semibold text-3xl my-3">
                Rating comments
              </div>
              {ratings.length > 0 ? (
                <div className="flex flex-col h-[600px] w-full pr-7 gap-5 overflow-y-auto">
                  {ratings.map((item, index) => (
                    <ProfileReviewCard key={index} review={item} />
                  ))}
                </div>
              ) : (
                <div className="h-[600px] text-center w-full font-playfair fonts-semibold text-gray-400">
                  No ratings yet
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {!loading && error && <NotFoundPage />}
    </div>
  );
};

export default RatingPage;
