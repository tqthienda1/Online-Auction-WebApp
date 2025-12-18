import Header from "../components/Header";
import Footer from "@/components/Footer";
import CategoriesBar from "../components/CategoriesBar";
import { http as axios } from "../lib/utils"
import { useEffect, useState } from "react";

const MainLayout = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // QUAN TRỌNG: Đổi sang /tree để lấy kèm danh mục con
        const response = await axios.get("/categories/tree"); 
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  
  return (
    <div className="h-screen flex flex-col">
      <Header />
      {/* Truyền dữ liệu cây vào đây */}
      <CategoriesBar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;