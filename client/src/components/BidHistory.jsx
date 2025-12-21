import { maskUsername } from "@/helper/maskUser";
import { formattedDate } from "../helper/formatDate";
import { Spinner } from "./ui/spinner";

const BidHistory = ({ data, loading, error }) => {
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner className="size-8 text-yellow-500" />
        <p className="mt-4 font-medium">Loading bid history...</p>
      </div>
    );
  }
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data.length)
    return (
      <p className="mx-auto text-4xl font-medium font-playfair mt-10">
        No Bid Yet
      </p>
    );
  return (
    <div className="flex mt-10 justify-center items-center max-h-[800px] overflow-y-auto">
      <div className="flex flex-col w-[90%] ">
        {data.map((b, index) => (
          <div
            key={index}
            className="flex flex-row justify-between items-center w-full border-b-2 border-neutral-200 p-5"
          >
            <div className="flex flex-col">
              <p className="text-xl font-medium ">Bid {index + 1}</p>
              <div className="flex justify-center items-center gap-2">
                <p className="text-md font-light">
                  {maskUsername(b.bidder.username)}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div>
                <p className="text-md font-light">
                  {formattedDate(b.createdAt)}
                </p>
              </div>
            </div>

            <p className="text-2xl font-semibold">${b.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidHistory;
