import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";
import UserProfileLayout from "../layouts/UserProfileLayout";
import CategoryPage from "../pages/CategoryPage";
import ProductDetails from "../pages/ProductDetails";
import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";
import UserProfile from "../pages/UserProfile";
import AddProductsPage from "../pages/AddProductsPage";
import NotFoundPage from "../pages/NotFoundPage";

const guestRoutes = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/products", component: ProductDetails, layout: MainLayout },
  { path: "/signup", component: SignUpPage, layout: BlankLayout },
  { path: "/login", component: LogInPage, layout: BlankLayout },
  { path: "/add-products", component: AddProductsPage, layout: MainLayout },
  { path: "/user_profile", component: UserProfile, layout: UserProfileLayout },
  { path: "/category/:category", component: CategoryPage, layout: MainLayout },
  { path: "*", component: NotFoundPage, layout: MainLayout },
];

const bidderRoutes = [];

const sellerRoutes = [];

const adminRoutes = [];

export { guestRoutes, bidderRoutes, sellerRoutes, adminRoutes };
