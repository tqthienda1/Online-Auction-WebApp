import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <header className="flex">
      <div className="w-10 h-10 border"></div>
      <SearchBar />
      <Link></Link>
    </header>
  );
};

export default Header;
