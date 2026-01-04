import { maskUsername } from "@/helper/maskUser";

const SellerInformation = ({
  seller,
  bidder,
  onBanBidder,
  banning,
  banError,
}) => {
  const canBan = typeof onBanBidder === "function";

  return (
    <div className="flex flex-col bg-neutral-300 p-6 w-[90%] shadow-md mt-5">
      <div className="flex border-b border-white pb-4 ">
        <div className="flex flex-col overflow-hidden w-full">
          <h3 className="text-xl font-playfair font-semibold text-gray-800">
            Seller
          </h3>
          <h2
            className="text-3xl font-playfair font-bold mt-1 truncate text-ce"
            title={seller.username}
          >
            {seller.username}
          </h2>
          <p className="text-gray-700 mt-2">
            Rating Positive: {seller.ratingPos}
          </p>
          <p className="text-gray-700 mt-2">
            Rating Negative: {seller.ratingNeg}
          </p>
          {/* <button className="bg-brand text-white uppercase font-semibold py-2 px-6 mt-4 rounded hover:bg-neutral-500 transition">
            View more items
          </button> */}
        </div>

        {/* <div className="w-28 h-28 bg-white rounded-full border border-gray-300"></div> */}
      </div>
      {bidder && (
        <div className="flex justify-between items-start mt-5">
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Highest Bidder
              </h3>
              {canBan && (
                <button
                  disabled={banning}
                  onClick={() => onBanBidder(bidder.id)}
                  className={`
                  text-lg font-medium transition w-25 rounded-sm border-2 border-red-500 
                  ${
                    banning
                      ? "text-white bg-red-500 cursor-not-allowed"
                      : "text-red-500 hover:bg-red-500 hover:text-white"
                  }
                `}
                >
                  {banning ? "Banning..." : "Ban"}
                </button>
              )}
            </div>

            <h2
              className="text-3xl font-playfair font-bold mt-1 truncate"
              title={bidder.username}
            >
              {maskUsername(bidder.username)}
            </h2>

            <p className="text-gray-700 mt-2">
              Rating Positive: {bidder.ratingPos}
            </p>
            <p className="text-gray-700 mt-2">
              Rating Negative: {bidder.ratingNeg}
            </p>

            {banError && (
              <p className="text-xs text-red-600 mt-2 mx-auto">{banError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInformation;
