import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";
import UserProfileLayout from "../layouts/UserProfileLayout";
import AdminLayout from "@/layouts/AdminLayout";

import CategoryPage from "../pages/CategoryPage";
import ProductDetails from "../pages/ProductDetails";
import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import UserProfile from "../pages/UserProfile";
import AddProductsPage from "../pages/AddProductsPage";
import BuyerPaymentPage from "@/pages/BuyerPaymentPage";
import SellerPaymentPage from "@/pages/SellerPaymentPage";
import AdminControlPanel from "@/pages/AdminControlPanel";
import AdminCategoriesPage from "@/pages/AdminCategoriesPage";
import AdminProductsPage from "@/pages/AdminProductsPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import NotFoundPage from "../pages/NotFoundPage";
import path from "path";

const guestRoutes = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/products/:id", component: ProductDetails, layout: MainLayout },
  { path: "/signup", component: SignUpPage, layout: BlankLayout },
  { path: "/verify-email", component: VerifyEmailPage, layout: BlankLayout },
  { path: "/login", component: LogInPage, layout: BlankLayout },
  { path: "/add-products", component: AddProductsPage, layout: MainLayout },
  { path: "/user_profile", component: UserProfile, layout: UserProfileLayout },
  { path: "/admin", component: AdminControlPanel, layout: AdminLayout },
  {
    path: "/buyer/payment/:productID",
    component: BuyerPaymentPage,
    layout: MainLayout,
  },
  {
    path: "/seller/payment/:productID",
    component: SellerPaymentPage,
    layout: MainLayout,
  },
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
  {
    path: "/categories/:id",
    component: CategoryPage,
    layout: MainLayout,
  },
  { path: "*", component: NotFoundPage, layout: MainLayout },
];

const bidderRoutes = [];

const sellerRoutes = [];

const adminRoutes = [];

export { guestRoutes, bidderRoutes, sellerRoutes, adminRoutes };
