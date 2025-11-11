const ProductDescription = ({ descriptions, frontImage, backImage }) => {
  return (
    <div className="flex mt-10 justify-center items-center">
      <div className="flex flex-col w-[90%] gap-5">
        {descriptions.map((d, index) => (
          <div key={index}>
            <div className="flex flex-col w-fit">
              <h2 className="text-xl font-medium">{d.title}</h2>
              <div className="bg-amber-400 w-full h-0.5"></div>
            </div>
            <p className="text-md text-justify font-light whitespace-pre-line mt-5">
              {d.content}
            </p>
          </div>
        ))}

        <div className="flex justify-center items-center gap-20">
          <div className="flex flex-col items-center">
            <img
              src={frontImage}
              alt="front image"
              className="w-28 h-28 object-cover"
            />
            <p className="font-medium">Front</p>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={backImage}
              alt="back image"
              className="w-28 h-28 object-cover"
            />
            <p className="font-medium">Back</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
