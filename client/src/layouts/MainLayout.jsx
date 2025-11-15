import Header from "../components/Header";
import CategoriesBar from "../components/CategoriesBar";

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

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      {/* // <CategoriesBar} /> */}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
