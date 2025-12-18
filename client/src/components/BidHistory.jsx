import { maskUsername } from "@/helper/maskUser";
import { formattedDate } from "../helper/formatDate";

const BidHistory = ({ BidHistory }) => {
  return (
    <div className="flex mt-10 justify-center items-center max-h-[800px] overflow-y-auto">
      <div className="flex flex-col w-[90%] ">
        {BidHistory.map((b, index) => (
          <div
            key={index}
            className="flex flex-row justify-between items-center w-full border-b-2 border-neutral-200 p-5"
          >
            <div className="flex flex-col">
              {/* Bid id */}
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

            <p className="text-2xl font-semibold">${b.maxPrice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BidHistory;
