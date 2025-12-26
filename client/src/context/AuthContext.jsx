// contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { setAccessToken, clearAccessToken } from "@/lib/authToken";
import { supabase } from "@/lib/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {

    // 1️⃣ Không có session → logout
    if (!session) {
      clearAccessToken();
      setUser(null);
      setLoading(false);
      return;
    }

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



  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
