import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log(user)

  if (loading)
    return (
      <div className="flex flex-col justify-center p-4 md:p-5 text-center h-screen overflow-hidden">
        <Spinner className="size-8 w-full text-yellow-500" />
        <h3 className="font-semibold my-6 text-body">Loading</h3>
      </div>
    );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "BIDDER") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
