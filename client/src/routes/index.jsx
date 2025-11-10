import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";

const guestRoutes = [{ path: "/", component: Home, layout: MainLayout }];

const bidderRoutes = [];

const sellerRoutes = [];

const adminRoutes = [];

export { guestRoutes, bidderRoutes, sellerRoutes, adminRoutes };
