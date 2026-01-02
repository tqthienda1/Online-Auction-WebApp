import { supabase } from "@/lib/supabaseClient";

export const getAccessToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token || null;
};
