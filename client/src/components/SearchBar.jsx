import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = ({ className }) => {
  return (
    <div
      className={`${className} flex items-center bg-gray-200 rounded-3xl px-4 py-2`}
    >
      <FaMagnifyingGlass className="text-gray-500 mr-2" />
      <input
        className="bg-transparent flex-1 outline-none"
        type="text"
        placeholder="Find your favorite item..."
      />
    </div>
  );
};

export default SearchBar;
