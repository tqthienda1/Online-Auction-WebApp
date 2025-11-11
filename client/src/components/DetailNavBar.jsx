const DetailNavBar = ({ frame, onFrameChange }) => {
  return (
    <div className="w-full h-12 flex justify-evenly items-center bg-neutral-300 mt-10">
      <div className="flex flex-col">
        {frame === "description" ? (
          <>
            <p
              className="text-xl text-black font-bold font-playfair cursor-pointer"
              onClick={() => onFrameChange("description")}
            >
              Description
            </p>
            <div className="bg-amber-400 w-full h-0.5"></div>
          </>
        ) : (
          <p
            className="text-xl text-black font-medium font-playfair cursor-pointer"
            onClick={() => onFrameChange("description")}
          >
            Description
          </p>
        )}
      </div>

      <div className="flex flex-col">
        {frame === "bidhistory" ? (
          <>
            <p
              className="text-xl text-black font-bold font-playfair cursor-pointer"
              onClick={() => onFrameChange("bidhistory")}
            >
              Bid History
            </p>
            <div className="bg-amber-400 w-full h-0.5"></div>
          </>
        ) : (
          <p
            className="text-xl text-black font-medium font-playfair cursor-pointer"
            onClick={() => onFrameChange("bidhistory")}
          >
            Bid History
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailNavBar;
