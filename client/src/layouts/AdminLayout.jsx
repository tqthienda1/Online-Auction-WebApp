import React, { useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import {
  LayoutGrid,
  FolderOpen,
  Package,
  Users,
  PanelLeftIcon,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logo from "../../public/image/logo.png";
import { logOut } from "@/services/auth.service";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const menuItems = [
    { to: "/admin", label: "Control Panel", icon: LayoutGrid },
    { to: "/admin/categories", label: "Categories", icon: FolderOpen },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/system", label: "System", icon: TrendingUp },
  ];

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex h-screen text-brand">
      <div className="w-64 shrink-0 border-r border-border bg-sidebar p-6 space-y-6">
        <div className="text-xl font-bold text-foreground mb-4">
          Admin Dashboard
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `w-full justify-start gap-3 block rounded-lg font-semibold ${
                    isActive
                      ? "bg-yellow-400 text-white "
                      : "bg-white text-brand hover:bg-yellow-400 hover:text-white"
                  }`
                }
              >
                <div className="w-full flex items-center gap-3 px-3 py-2">
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>
      <div className="flex flex-col w-full justify-center">
        <div className="flex border-b border-border bg-card px-6 py-4">
          <Link to="/" className="flex items-center justify-start h-10">
            <img src={logo} alt="LOGO" className="h-full object-contain" />
          </Link>
          <div className="w-full flex items-center justify-end">
            <Button
              variant="ghost"
              size="icon"
              // onClick={onMenuClick}
              className="md:hidden"
            >
              <PanelLeftIcon className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4 md:ml-auto">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={() => {
                  handleLogout();
                  navigate("/login");
                }}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
