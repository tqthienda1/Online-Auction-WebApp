import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { http } from "@/lib/utils";

const RatingPage = () => {
  const { userId } = useParams();
  console.log(userId);
  useEffect(() => {
    const controller = new AbortController();

    const loadRatings = async () => {
      try {
        const res = await http.get(`/rating/${userId}`, {
          signal: controller.signal,
        });

        console.log(res.data);
      } catch (error) {
        console.error("Get ratings failed: ", error);
      }
    };

    loadRatings();
  }, []);

  return <div>RatingPage</div>;
};

export default RatingPage;
