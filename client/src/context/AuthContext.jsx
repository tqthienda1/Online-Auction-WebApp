// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { setAccessToken, clearAccessToken } from "@/lib/authToken";

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
        setAccessToken(session.access_token);
        setUser(session.user);
        setRoleLoading(true);
        setLoading(false);
      }

      // 🔴 LOGOUT
      if (event === "SIGNED_OUT") {
        clearAccessToken();
        setUser(null);
        setLoading(false);
        setRoleLoading(false);
        return;
      }

      // 🟢 LOGIN
      if (event === "SIGNED_IN") {
        setAccessToken(session.access_token);
        setUser((prev) => prev ?? session.user);
        if (session) {
          return;
        }
        setRoleLoading(true);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 FETCH ROLE
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
        roleUser: data?.role ?? "BIDDER",
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
