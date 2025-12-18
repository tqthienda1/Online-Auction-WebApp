import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { supabase } from "./supabaseClient"; // 👈 thêm dòng này

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 20000,
});

http.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
