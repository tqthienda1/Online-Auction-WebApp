import { formattedDate } from "../helper/formatDate";

const BidHistory = ({ BidHistory }) => {
  return (
    <div className="flex mt-10 justify-center items-center">
      <div className="flex flex-col w-[90%] ">
        {BidHistory.map((b, index) => (
          <div
            key={index}
            className="flex flex-row justify-between items-center w-full border-b-2 border-neutral-200 p-5"
          >
            <div className="flex flex-col">
              {/* Bid id */}
              <p className="text-xl font-medium ">Bid {b.id}</p>
              <div className="flex justify-center items-center gap-2">
                <p className="text-md font-light">{b.bidderName}</p>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400"></div>
                <p className="text-md font-light">{formattedDate(b.date)}</p>
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
