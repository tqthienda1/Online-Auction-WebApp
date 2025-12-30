// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { setAccessToken, clearAccessToken } from "@/lib/authToken";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "INITIAL_SESSION") {
        setAccessToken(session.access_token);
        setUser(session.user);
      }

      // 🔴 LOGOUT
      if (event === "SIGNED_OUT") {
        clearAccessToken();
        setUser(null);
        return;
      }

      // 🟢 LOGIN
      if (event === "SIGNED_IN") {
        setAccessToken(session.access_token);
        setUser((prev) => prev ?? session.user);
        if (session) {
          return;
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔹 FETCH ROLE
  useEffect(() => {
    if (!user?.id) return;

    const fetchRole = async () => {
      const { data } = await supabase
        .from("User")
        .select("*")
        .eq("supabaseId", user.id)
        .maybeSingle();

      setUser((prev) => ({
        ...prev,
        data,
      }));

      setLoading(false);
    };

    fetchRole();
  }, [user?.id]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
