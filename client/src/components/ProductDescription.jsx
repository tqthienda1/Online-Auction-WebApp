const ProductDescription = ({ descriptions, frontImage, backImage }) => {
  return (
    <div className="flex mt-10 justify-center items-center">
      <div className="flex flex-col w-[90%] gap-10">
        {descriptions.map((d, index) => (
          <div
            key={index}
            className="prose max-w-none text-justify font-light"
            dangerouslySetInnerHTML={{ __html: d.productDescription }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductDescription;
