import SearchBar from "./SearchBar";
import CategoriesBar from "./CategoriesBar";
import { Link } from "react-router-dom";

const mockUpData = {
  categories: [
    "Fashion",
    "Art",
    "Jewery&Watches",
    "Furniture",
    "Electronic",
    "Vehicle",
    "Other",
  ],
};

const Header = () => {
  return (
    <header>
      <div className="flex w-full py-5 justify-around">
        <Link to="/" className="w-80 h-10 border">
          LOGO
        </Link>
        <SearchBar className="w-xl" />
        <div className="flex gap-1">
          <Link className="flex items-center border-1 border-brand font-semibold rounded-3xl py-3 px-9 text-brand">
            Login
          </Link>
          <Link className="flex items-center bg-brand font-semibold rounded-3xl py-3 px-9 text-white">
            Sign Up
          </Link>
        </div>
      </div>

      <CategoriesBar categories={mockUpData.categories} />
    </header>
  );
};

export default Header;
