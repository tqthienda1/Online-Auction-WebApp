import { maskUsername } from "@/helper/maskUser";

const SellerInformation = ({ seller, bidder, onViewSellerRating }) => {
  return (
    <div className="flex flex-col bg-neutral-100 border p-6 w-[90%] mt-5">
      <div className="flex border-b-2 border-neutral-300 pb-4 ">
        <div className="flex flex-col overflow-hidden w-full">
          <h3 className="text-xl font-semibold text-gray-800">Seller</h3>
          <h2
            className="text-3xl font-playfair font-bold mt-1 truncate text-ce"
            title={seller.username}
          >
            {seller.username}
          </h2>
          <div
            onClick={() => onViewSellerRating(seller.id)}
            className="
              mt-3 flex items-center gap-2
              text-sm text-gray-700
              hover:scale-105
              transition
              mx-auto
              cursor-pointer"
          >
            <div className="flex items-center gap-1">
              <p>Rating: </p>
              <span className="font-medium text-gray-800">
                {seller.ratingPos}
              </span>
              <span className="text-gray-500">positive</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-gray-800">
                {seller.ratingNeg}
              </span>
              <span className="text-gray-500">negative</span>
            </div>

            <span className="text-gray-400">→</span>
          </div>
        </div>

        {/* <div className="w-28 h-28 bg-white rounded-full border border-gray-300"></div> */}
      </div>
      {bidder && (
        <div className="flex mt-5 pb-4">
          <div className="flex flex-col overflow-hidden w-full">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-gray-800">
                Highest Bidder
              </h3>
            </div>

            <h2
              className="text-3xl font-playfair font-bold mt-1 truncate"
              title={bidder.username}
            >
              {maskUsername(bidder.username)}
            </h2>

            <div
              onClick={() => onViewSellerRating(bidder.id)}
              className="
                mt-3 flex items-center gap-2
                text-sm text-gray-700
                hover:scale-105
                transition
                mx-auto
                cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <p>Rating: </p>
                <span className="font-medium text-gray-800">
                  {bidder.ratingPos}
                </span>
                <span className="text-gray-500">positive</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium text-gray-800">
                  {bidder.ratingNeg}
                </span>
                <span className="text-gray-500">negative</span>
              </div>

              <span className="text-gray-400">→</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInformation;
