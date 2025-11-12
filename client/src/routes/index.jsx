import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import BlankLayout from "../layouts/BlankLayout";
import CategoryPage from "../pages/CategoryPage";
import ProductDetails from "../pages/ProductDetails";
import LogInPage from "../pages/LogInPage";
import SignUpPage from "../pages/SignUpPage";

const guestRoutes = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/products", component: ProductDetails, layout: MainLayout },
  { path: "/signup", component: SignUpPage, layout: BlankLayout },
  { path: "/login", component: LogInPage, layout: BlankLayout },
  { path: "/:category", component: CategoryPage, layout: MainLayout },
  { path: "/add-products", component: CategoryPage, layout: MainLayout },

];

const bidderRoutes = [];

const sellerRoutes = [];

const adminRoutes = [];

export { guestRoutes, bidderRoutes, sellerRoutes, adminRoutes };
