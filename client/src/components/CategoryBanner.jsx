const CategoryBanner = ({ imagePath, title }) => {
  return (
    <div
      className="text-white bg-cover bg-center py-16"
      style={{ backgroundImage: `url(${imagePath})` }}
    >
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default CategoryBanner;
