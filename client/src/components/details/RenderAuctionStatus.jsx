import SellerInformation from "./SellerInformation";

const renderAuctionStatus = ({ product, auction }) => {
  switch (auction.state) {
    case "upcoming":
      return (
        <div className="flex flex-col w-1/3 items-center mt-10 gap-6">
          <div className="w-[90%] rounded-sm border p-6 bg-neutral-50 text-center">
            <p className="text-xl font-semibold mb-2">
              Auction Not Started Yet
            </p>

            <p className="text-gray-600">This auction will start soon.</p>

            <p className="mt-3 text-yellow-500 font-bold">
              Starts at: {auction.time.endAtText}
            </p>
          </div>

          <SellerInformation seller={product.seller} bidder={null} />
        </div>
      );

    case "ended":
      return (
        <div className="flex flex-col w-1/3 items-center mt-10 gap-6">
          <div className="w-[90%] rounded-sm border p-6 bg-neutral-50 text-center">
            <p className="text-xl font-semibold mb-2">Auction Ended</p>

            {auction.highestBidder ? (
              <>
                <p className="text-lg">
                  Winner:{" "}
                  <span className="font-bold text-yellow-500">
                    {auction.highestBidder.username}
                  </span>
                </p>

                <p className="mt-2 text-md font-medium">
                  Winning bid: {auction.currentPrice} USD
                </p>

                {auction.isWinner && (
                  <button
                    onClick={() =>
                      navigate(`/buyer/payment/${product.id}`, {
                        replace: true,
                      })
                    }
                    className="
                      w-[90%] h-10 bg-brand uppercase text-yellow-400 text-xl font-bold
                      hover:bg-yellow-400 hover:text-brand transition
                      mt-5
                    "
                  >
                    Proceed to Payment
                  </button>
                )}
              </>
            ) : (
              <p className="italic text-gray-500 mt-2">
                No bids were placed for this auction
              </p>
            )}
          </div>

          <SellerInformation
            seller={product.seller}
            bidder={auction.highestBidder}
            onBanBidder={onBanBidder}
            banning={banning}
            banError={banError}
          />
        </div>
      );

    default:
      return null;
  }
};

export default renderAuctionStatus;
