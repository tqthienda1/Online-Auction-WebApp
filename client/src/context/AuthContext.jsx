// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      console.log(event);

      if (event === "INITIAL_SESSION") {
        setUser(session.user);
      }

      // 🔴 LOGOUT
      if (event === "SIGNED_OUT") {
        setUser(null);
        return;
      }

      // 🟢 LOGIN
      if (event === "SIGNED_IN") {
        setUser((prev) => prev ?? session.user);
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

      data.email = user.email;
      data.provider = user.app_metadata.provider;

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
