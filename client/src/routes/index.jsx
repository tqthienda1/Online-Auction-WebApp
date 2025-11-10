import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import CategoryPage from "../pages/CategoryPage";
import ProductDetails from "../pages/ProductDetails";

const guestRoutes = [
  { path: "/", component: Home, layout: MainLayout },
  { path: "/category/camera", component: CategoryPage, layout: MainLayout },
  { path: "/products/:id", component: ProductDetails, layout: MainLayout },
];

const bidderRoutes = [];

const sellerRoutes = [];

const adminRoutes = [];

export { guestRoutes, bidderRoutes, sellerRoutes, adminRoutes };
