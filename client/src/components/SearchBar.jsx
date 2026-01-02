import { FaMagnifyingGlass } from "react-icons/fa6";
import { http } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`${className} flex items-center bg-gray-200 rounded-3xl px-4 py-2`}
    >
      <FaMagnifyingGlass className="text-gray-500 mr-2" />
      <input
        className="bg-transparent flex-1 outline-none border-0"
        type="text"
        placeholder="Find your favorite item..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            navigate(`/categories/?keyword=${e.target.value}`);
          }
        }}
      />
    </div>
  );
};

export default SearchBar;
