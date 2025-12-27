import { maskUsername } from "@/helper/maskUser";
import { formattedDate } from "../helper/formatDate";
import { Spinner } from "./ui/spinner";
import { PiEmptyFill } from "react-icons/pi";
import { PiEmptyLight } from "react-icons/pi";

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
  if (!data || data.length === 0)
    return (
      <div className="my-auto flex flex-col items-center justify-center text-center text-neutral-600 gap-3">
        {/* Icon */}
        <PiEmptyLight className="h-32 w-32 text-neutral-500" />

        {/* Text */}
        <h3 className="text-3xl font-playfair font-semibold text-yellow-400">
          No bids yet
        </h3>
        <p className="mt-2 max-w-sm text-sm text-neutral-500">
          Be the first to place a bid and start the auction.
        </p>
      </div>
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