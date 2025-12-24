// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const session = data.session;

      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      const authUser = session.user;

      const { data: profile } = await supabase
        .from("User")
        .select("role")
        .eq("supabaseId", authUser.id)
        .single();

      setUser({
        ...authUser,
        role: profile?.role ?? "BIDDER",
      });

      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        setUser(null);
        return;
      }

      const authUser = session.user;

      const { data: profile } = await supabase
        .from("User")
        .select("role")
        .eq("supabaseId", authUser.id)
        .single();

      console.log("AuthContext role:", profile?.role);

      setUser({
        ...authUser,
        role: profile?.role ?? "BIDDER",
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
