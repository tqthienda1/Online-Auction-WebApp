import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const CategoriesBar = ({ categories }) => {
  const [selected, setSelected] = useState("");
  const [child, setChild] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith("/categories")) {
      setSelected("");
      setChild("");
    }
  }, [location.pathname]);

  return (
    <>
      <div className="flex items-center justify-center bg-gray-100 w-full border-t border-b py-3 z-50 relative">
        <ul className="flex font-playfair gap-10 items-center">
          <Link to={`/categories`}>
            <h1
              className={
                selected == "Categories"
                  ? "text-4xl text-yellow-400"
                  : "text-4xl hover:text-yellow-400 cursor-pointer"
              }
              onClick={() => {
                setSelected("Categories"), setChild("");
              }}
            >
              Categories
            </h1>
          </Link>

          {categories.map((item) => (
            <li
              key={item.name}
              className={
                selected == item.name
                  ? "text-xl relative group h-full flex items-center cursor-pointer text-yellow-400"
                  : "text-xl relative group h-full flex items-center"
              }
              onClick={() => {
                setSelected(item.name);
                {
                  child ? setChild("") : {};
                }
              }}
            >
              <Link
                to={`/categories/${item.id}`}
                className="hover:text-yellow-400 py-2 block"
              >
                {item.name}
              </Link>

              {item.categoryChild && item.categoryChild.length > 0 && (
                <ul className="absolute top-full left-0 min-w-[200px] bg-white shadow-lg border rounded-md hidden group-hover:block z-50">
                  {item.categoryChild.map((childItem) => (
                    <li
                      key={childItem.name}
                      className="hover:bg-gray-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setChild(childItem.name);
                        setSelected(item.name);
                      }}
                    >
                      <Link
                        to={`/categories/${childItem.id}`}
                        className="block px-4 py-2 text-base text-gray-700"
                      >
                        {childItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-[18%] py-2 mt-4 text-center ">
        {selected && (
          <span className="font-semibold text-2xl font-playfair text-brand">
            {selected}
          </span>
        )}
        {child && (
          <span className="font-semibold text-2xl font-playfair text-brand">
            / {child}
          </span>
        )}
      </div>
    </>
  );
};

export default CategoriesBar;
