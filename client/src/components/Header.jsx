import SearchBar from "./SearchBar";
import CategoriesBar from "./CategoriesBar";
import { Link } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import logo from "../../public/image/logo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { logOut } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import AddProductButton from "./AddProductButton";

const Header = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      alert(err.message || "Log in failed");
    }
  };
  return (
    <header>
      <div className="flex w-full h-24 py-5 justify-around">
        <Link to="/" className="h-14 flex items-center">
          <img src={logo} alt="LOGO" className="h-full object-contain" />
        </Link>
        <SearchBar className="w-xl" />
        <div className="flex gap-1">
          {!user ? (
            <>
              <Link
                to="/login"
                className="flex items-center border border-brand font-semibold rounded-3xl py-3 px-9 text-brand"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="flex items-center bg-brand font-semibold rounded-3xl py-3 px-9 text-white"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex justify-center items-center gap-3">
              {user.data?.role === "SELLER" && <AddProductButton />}
              <Link
                to="/user_profile"
                className="flex items-center h-full px-7 gap-3 rounded-2xl border mr-3 hover:bg-brand hover:text-white transition-bg duration-300"
              >
                <CiUser size={36} className="cursor-pointer " />
                <span className="font-playfair font-semibold">
                  Hi, {user.data?.username}
                </span>
              </Link>

              <Link
                to="/"
                onClick={handleLogout}
                className="flex items-center bg-brand font-semibold rounded-3xl py-3 px-9 text-white cursor-pointer"
              >
                Logout
              </Link>
<<<<<<< Updated upstream
            </div>
=======
            </>
>>>>>>> Stashed changes
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
