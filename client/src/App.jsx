import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  guestRoutes,
  userRoutes,
  bidderRoutes,
  sellerRoutes,
  adminRoutes,
} from "./routes";
import BidderRoute from "./routes/BidderRoute";
import SellerRoute from "./routes/SellerRoute";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";
import { Fragment } from "react";

const renderRoutes = (routes, Wrapper = Fragment) => {
  return routes.map((route, index) => {
    const Page = route.component;
    const Layout = route.layout || Fragment;

    return (
      <Route
        key={index}
        path={route.path}
        element={
          <Wrapper>
            <Layout>
              <Page />
            </Layout>
          </Wrapper>
        }
      />
    );
  });
};

function App() {
  return (
    <Router>
      <Routes>
        {renderRoutes(guestRoutes)}
        {renderRoutes(userRoutes, UserRoute)}
        {renderRoutes(sellerRoutes, SellerRoute)}
        {renderRoutes(bidderRoutes, BidderRoute)}
        {renderRoutes(adminRoutes, AdminRoute)}
      </Routes>
    </Router>
  );
}

export default App;
