import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Package, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminControlPanel = () => {
  const navigate = useNavigate();
  const stats = [
    {
      title: "Total Users",
      value: "2,451",
      icon: Users,
    },
    {
      title: "Total Products",
      value: "847",
      icon: Package,
    },
    {
      title: "Upgrade Requests",
      value: "23",
      icon: TrendingUp,
    },
    {
      title: "Categories",
      value: "12",
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
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Control Panel</h1>
        <p className="text-muted-foreground">Welcome back, Admin</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border border-border hover:bg-gray-100"
              onClick={() => handleClick(stat.title)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-foreground">
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
  );
};

export default AdminControlPanel;
