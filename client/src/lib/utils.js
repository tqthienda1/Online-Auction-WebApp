import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { supabase } from "./supabaseClient";
import { getAccessToken } from "@/lib/authToken";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 20000,
});

http.interceptors.request.use(async (config) => {
  const token = await getAccessToken();

  console.log(token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
