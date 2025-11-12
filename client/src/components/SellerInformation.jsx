const SellerInformation = ({ seller, bidder }) => {
  return (
    <div className="flex flex-col bg-neutral-300 p-6  w-[90%] shadow-md mt-5">
      {/* Seller Info */}
      <div className="flex justify-between items-center border-b border-white pb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">Seller</h3>
          <h2 className="text-3xl font-playfair font-bold mt-1">
            {seller.name}
          </h2>
          <p className="text-gray-700 mt-2">Rate: {seller.rate}/5</p>
          <button className="bg-brand text-white font-semibold py-2 px-6 mt-4 rounded hover:bg-neutral-500 transition">
            View more items
          </button>
        </div>

        {/* Avatar placeholder */}
        <div className="w-28 h-28 bg-white rounded-full border border-gray-300"></div>
      </div>

      <div className="flex justify-between items-center mt-5">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">
            Highest Bidder
          </h3>
          <h2 className="text-3xl font-playfair font-bold mt-1">
            {seller.name}
          </h2>
          <p className="text-gray-700 mt-2">
            Current bid: ${bidder.highestBid}
          </p>
        </div>

        {/* Avatar placeholder */}
        <div className="w-28 h-28 bg-white rounded-full border border-gray-300"></div>
      </div>

      {/* Highest Bidder Info */}
      {/* <div className="flex flex-row justify-between items-center mt-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800">
            Highest Bidder
          </h3>

          <h4 className="text-3xl font-playfair font-bold mt-1">
            {bidder.name}
          </h4>
          <p className="text-gray-700 mt-1">
            Current bid: ${bidder.highestBid}
          </p>
        </div>

        <div className="w-28 h-28 bg-white rounded-full border border-gray-300"></div>
      </div> */}
    </div>
  );
};

export default SellerInformation;
