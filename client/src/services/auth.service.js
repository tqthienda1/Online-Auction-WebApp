import { FaAddressBook } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient.js";
import { http } from "../lib/utils.js";

export const signUp = async (user) => {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      emailRedirectTo: "http://localhost:5173",
    },
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  try {
    await http.post("/auth/signup", {
      supabaseId: data.user.id,
      username: user.username,
      dob: user.dob,
      address: user.address,
    });
  } catch (err) {
    throw {
      status: err.response?.status || 500,
      message:
        err.response?.data?.message ||
        "Sign up with supabase auth succeeded but sign up profile failed",
    };
  }

  return {
    message: "User registered. Please verify your email.",
  };
};

export const verifyEmailOTP = async ({ email, token }) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  const userId = data.user.id;

  try {
    await http.post("/auth/verify", {
      supabaseId: userId,
    });
  } catch (err) {
    throw {
      status: err.response?.status || 500,
      message:
        err.response?.data?.message ||
        "Verify email succeeded but profile update failed",
    };
  }

  return data;
};

export const resendOtp = async ({ email }) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) throw error;
};

export const logIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  return data;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `http://localhost:5173`,
    },
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  // try {
  //   await http.post("/auth/signin-google", {
  //     supabaseId: data.user.id,
  //     email: data.user.email,
  //   });
  // } catch (err) {
  //   throw {
  //     status: err.response?.status || 500,
  //     message:
  //       err.response?.data?.message ||
  //       "Sign in with Google in supabase OAuth successed but failed in db",
  //   };
  // }

  return data;
};
