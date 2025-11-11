const DetailNavBar = ({ page, onChangePage }) => {
  return (
    <div className="flex flex-col mt-10">
      <div className="w-2/3 h-12 flex justify-evenly items-center bg-neutral-300">
        <div className="flex flex-col">
          <p className="text-xl text-black font-medium font-playfair">
            Description
          </p>

          {page === "description" && (
            <div className="bg-amber-400 w-full h-0.5"></div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-xl text-black font-medium font-playfair">
            Bid History
          </p>

          {page === "bidhistory" && (
            <div className="bg-amber-400 w-full h-0.5"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailNavBar;
