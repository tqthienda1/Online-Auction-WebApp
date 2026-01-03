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
<<<<<<< Updated upstream
      if (!session) {
=======
      // 1️⃣ Không có session → logout
      if (!session) {
        console.log("Logout");
        clearAccessToken();
>>>>>>> Stashed changes
        setUser(null);
        setLoading(false);
        return;
      }
<<<<<<< Updated upstream

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

      setUser((prev) => ({
        ...prev,
        data,
      }));

      setLoading(false);
    };

    fetchRole();
  }, [user?.id]);
=======

      // 2️⃣ Có session → set token
      setAccessToken(session.access_token);

      // 3️⃣ Chỉ fetch profile khi cần
      if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
        const authUser = session.user;
        console.log(authUser);

        const { data: profile, error } = await supabase
          .from("User")
          .select("role")
          .eq("supabaseId", authUser.id)
          .single();

        console.log("Fetched profile:", profile);

        setUser({
          ...authUser,
          role: profile?.role ?? "BIDDER",
        });
      }

      // 4️⃣ Refresh token / user update → chỉ update token
      if (event === "TOKEN_REFRESHED") {
        // không cần setUser lại
      }

      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
>>>>>>> Stashed changes

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
