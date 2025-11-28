import Header from "../components/Header";
import Footer from "@/components/Footer";
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
    <div className="h-screen flex flex-col">
      <Header />
      <CategoriesBar categories={mockUpData.categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
