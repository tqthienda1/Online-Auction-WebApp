import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { http } from "@/lib/utils";

const AdminControlPanel = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const getTotalsData = async () => {
      try {
        setIsLoading(true);
        const [users, products, requests, categories] = await Promise.all([
          http.get("admin/users", {
            signal: controller.signal,
          }),
          http.get("admin/products", {
            signal: controller.signal,
          }),
          http.get("admin/requests", {
            signal: controller.signal,
          }),
          http.get("admin/categories", {
            signal: controller.signal,
          }),
        ]);

        setTotalUsers(users.data.data);
        setTotalProducts(products.data.data);
        setTotalRequests(requests.data.data);
        setTotalCategories(categories.data.data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getTotalsData();

    return () => { controller.abort(); }
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
    },
    {
      title: "Upgrade Requests",
      value: totalRequests,
      icon: TrendingUp,
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: BarChart3,
    },
  ];

  const handleClick = (tab) => {
    if (tab === "Total Users" || tab === "Upgrade Requests")
      navigate("/admin/users");
    else if (tab === "Total Products") navigate("/admin/products");
    else if (tab === "Categories") navigate("/admin/categories");
  };

  return (
    <>
      {isLoading && (
        <div className="flex flex-col justify-center p-4 md:p-5 text-center h-60">
          <Spinner className="size-8 w-full text-yellow-500" />
          <h3 className="font-semibold my-6 text-body">Loading</h3>
        </div>
      )}
      {error && <div>{error}</div>}
      {!isLoading && !error && (
        <div className="space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">
              Control Panel
            </h1>
            <p className="text-muted-foreground">Welcome back, Admin</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="border border-border hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleClick(stat.title)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.title}
                        </p>
                        <h3 className="mt-2 text-3xl font-bold text-yellow-400">
                          {stat.value}
                        </h3>
                      </div>
                      <div className="rounded-lg bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminControlPanel;
