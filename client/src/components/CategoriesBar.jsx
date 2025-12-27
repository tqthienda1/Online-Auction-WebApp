import { Link } from "react-router-dom";

const CategoriesBar = ({ categories }) => {
  return (
    <div className="flex justify-center bg-gray-100 w-full border-t border-b py-3 z-50 relative">
      <ul className="flex font-playfair gap-10 items-center">
        <Link to={`/categories`}>
          <h1 className="text-4xl mr-4 cursor-pointer hover:text-yellow-400">
            Categories
          </h1>
        </Link>

        {categories.map((item) => (
          <li
            className="text-xl relative group cursor-pointer h-full flex items-center"
            key={item.id}
          >
            <Link
              to={`/categories/${item.id}`}
              className="hover:text-yellow-400 py-2 block"
            >
              {item.name}
            </Link>

            {item.categoryChild && item.categoryChild.length > 0 && (
              <ul className="absolute top-full left-0 min-w-[200px] bg-white shadow-lg border rounded-md hidden group-hover:block z-50">
                {item.categoryChild.map((child) => (
                  <li key={child.id} className="hover:bg-gray-100">
                    <Link
                      to={`/categories/${child.id}`}
                      className="block px-4 py-2 text-base text-gray-700"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesBar;
