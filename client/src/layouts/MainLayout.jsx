import Header from "../components/Header";
import CategoriesBar from "../components/CategoriesBar";

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
