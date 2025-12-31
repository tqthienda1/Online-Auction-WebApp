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
import AdminSystemPage from "@/pages/AdminSystemPage.jsx";
import AdminUsersPage from "@/pages/AdminUsersPage";
import NotFoundPage from "../pages/NotFoundPage";
import ForgotPasswordPage from "@/pages/ForgotPassword";

const guestRoutes = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/products/:id", component: ProductDetails, layout: MainLayout },
  { path: "/signup", component: SignUpPage, layout: BlankLayout },
  { path: "/verify-email", component: VerifyEmailPage, layout: BlankLayout },
  { path: "/login", component: LogInPage, layout: BlankLayout },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
    layout: BlankLayout,
  },
  {
    path: "/categories",
    component: CategoryPage,
    layout: MainLayout,
  },
  {
    path: "/categories/:id",
    component: CategoryPage,
    layout: MainLayout,
  },

  { path: "*", component: NotFoundPage, layout: MainLayout },
];

const userRoutes = [
  { path: "/user_profile", component: UserProfile, layout: UserProfileLayout },
];

const bidderRoutes = [
  {
    path: "/buyer/payment/:productID",
    component: BuyerPaymentPage,
    layout: MainLayout,
  },

];

const sellerRoutes = [
  {
    path: "/seller/payment/:productID",
    component: SellerPaymentPage,
    layout: MainLayout,
  },

  { path: "/add-products", component: AddProductsPage, layout: MainLayout },
];

const adminRoutes = [
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
  { path: "/admin/system", component: AdminSystemPage, layout: AdminLayout },
];

export { guestRoutes, userRoutes, bidderRoutes, sellerRoutes, adminRoutes };
