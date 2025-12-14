import SearchBar from "./SearchBar";
import CategoriesBar from "./CategoriesBar";
import { Link } from "react-router-dom";

import logo from "../../public/image/logo.png";


const Header = () => {
  return (
    <header>
      <div className="flex w-full py-5 justify-around">
        <Link to="/" className="h-10 flex items-center">
          <img src={logo} alt="LOGO" className="h-full object-contain" />
        </Link>
        <SearchBar className="w-xl" />
        <div className="flex gap-1">
          <Link
            to="/login"
            className="flex items-center border border-brand font-semibold rounded-3xl py-3 px-9 text-brand"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="flex items-center bg-brand font-semibold rounded-3xl py-3 px-9 text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
