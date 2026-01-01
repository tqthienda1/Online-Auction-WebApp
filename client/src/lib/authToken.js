import { supabase } from "@/lib/supabaseClient";

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token || null;
};
