// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(false);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") {
        setLoading(false);
        return;
      }

      // 🔴 LOGOUT
      if (event === "SIGNED_OUT") {
        setUser(null);
        setLoading(false);
        setRoleLoading(false);
        return;
      }

      // 🟢 LOGIN THẬT
      if (event === "SIGNED_IN") {
        setUser(session.user);
        setRoleLoading(true);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 Fetch role CHỈ KHI LOGIN
  useEffect(() => {
    if (!user?.id || !roleLoading) return;

    const fetchRole = async () => {
      const { data } = await supabase
        .from("User")
        .select("role")
        .eq("supabaseId", user.id)
        .maybeSingle();

      setUser((prev) => ({
        ...prev,
        role: data?.role ?? "BIDDER",
      }));

      setRoleLoading(false);
    };

    fetchRole();
  }, [user?.id, roleLoading]);

  return (
    <AuthContext.Provider value={{ user, loading, roleLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
