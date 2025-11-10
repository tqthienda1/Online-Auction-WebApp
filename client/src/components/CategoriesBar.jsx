const CategoriesBar = ({ categories }) => {
  return (
    <div className="flex justify-center bg-gray-100 w-full border-t border-b py-3">
      <ul className="flex font-playfair gap-10 items-center">
        <h1 className="text-4xl">Categories</h1>

        {categories.map((item, index) => (
          <li className="text-xl" key={index}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesBar;
