import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";
import UserProfileLayout from "../layouts/UserProfileLayout";
import AdminLayout from "@/layouts/AdminLayout";

import CategoryPage from "../pages/CategoryPage";
import ProductDetails from "../pages/ProductDetails";
import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import UserProfile from "../pages/UserProfile";
import AddProductsPage from "../pages/AddProductsPage";
import AdminControlPanel from "@/pages/AdminControlPanel";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminUsersPage from "@/pages/AdminUsersPage";

const guestRoutes = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/products", component: ProductDetails, layout: MainLayout },
  { path: "/signup", component: SignUpPage, layout: BlankLayout },
  { path: "/login", component: LogInPage, layout: BlankLayout },
  { path: "/add-products", component: AddProductsPage, layout: MainLayout },
  { path: "/user_profile", component: UserProfile, layout: UserProfileLayout },
  { path: "/admin", component: AdminControlPanel, layout: AdminLayout },
  {
    path: "/admin/categories",
    component: AdminCategoriesPage,
    layout: AdminLayout,
  },
  {
    path: "/admin/products",
    component: AdminProductsPage,
    layout: AdminLayout,
  },
  { path: "/admin/users", component: AdminUsersPage, layout: AdminLayout },
  { path: "/:category", component: CategoryPage, layout: MainLayout },
];

const bidderRoutes = [];

const sellerRoutes = [];

const adminRoutes = [];

export { guestRoutes, bidderRoutes, sellerRoutes, adminRoutes };
