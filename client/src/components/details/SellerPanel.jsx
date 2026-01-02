const SellerPanel = ({ product, auction, onBanBidder, banning }) => {
  return (
    <>
      <div className="h-12 mt-10 flex justify-center items-center">
        <p className="text-2xl font-medium font-playfair">
          Seller Control Panel
        </p>
      </div>

      <div className="flex flex-col items-center w-[90%] border mt-10 py-6 gap-5 bg-neutral-50">
        <div className="flex flex-row w-[90%] justify-between items-center">
          <p className="text-lg font-medium">Auction Status</p>
          <span
            className={`px-3 py-1 text-sm font-bold uppercase ${
              auction.state === "live"
                ? "bg-green-100 text-green-700"
                : auction.state === "ended"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {auction.state}
          </span>
        </div>

        <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

        <div className="flex flex-row w-[90%] justify-between items-center">
          <p className="text-lg font-medium">{auction.time.label}</p>
          <div className="flex flex-col items-end">
            <p className="text-yellow-400 text-xl font-bold">
              {auction.time.remainingText ?? "--"}
            </p>
            <p className="text-md font-light">{auction.time.endAtText ?? ""}</p>
          </div>
        </div>

        <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

        <div className="flex flex-row w-[90%] justify-between items-center">
          <p className="text-lg font-medium">Current Price</p>
          <p className="text-2xl font-bold text-yellow-400">
            {auction.currentPrice ?? product.startingPrice} USD
          </p>
        </div>

        <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

        <div className="flex flex-col w-[90%] gap-1">
          <p className="text-lg font-medium">Highest Bidder</p>
          {auction.highestBidder ? (
            <p className="font-semibold truncate">
              {auction.highestBidder.username}
            </p>
          ) : (
            <p className="italic text-gray-500">No bids yet</p>
          )}
        </div>

        {auction.highestBidder && (
          <>
            <div className="w-[90%] h-0.5 bg-brand opacity-20"></div>

            <button
              disabled={banning}
              onClick={() => onBanBidder(auction.highestBidder.id)}
              className="w-[90%] h-10 border border-red-500 text-red-600 uppercase font-bold
                hover:bg-red-500 hover:text-white transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {banning ? "Banning bidder..." : "Ban highest bidder"}
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default SellerPanel;
