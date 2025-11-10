import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = () => {
  return (
    <div className="relative flex items-center">
      <input
        className="absolute flex bg-gray-200 rounded-3xl w-100 items-center px-12 py-3 gap-3 focus:outline-0"
        type="text"
        placeholder="Find your favorite item..."
      />
      <FaMagnifyingGlass className="absolute m-4" />
    </div>
  );
};

export default SearchBar;
