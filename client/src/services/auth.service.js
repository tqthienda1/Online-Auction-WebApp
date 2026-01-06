import { FaAddressBook } from "react-icons/fa";
import { supabase } from "../lib/supabaseClient.js";
import { http } from "../lib/utils.js";

export const signUp = async (user) => {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,
    options: {
      emailRedirectTo: import.meta.env.VITE_SITE_URL,
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
      redirectTo: import.meta.env.VITE_SITE_URL,
    },
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  return data;
};

export const logOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw {
      status: 400,
      message: error.message,
    };
  }
};

export const requestOtp = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: import.meta.env.VITE_SITE_URL,
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  return { message: "Send email OTP request successful" };
};

export const verifyOtp = async (email, token) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  return {
    message: "OTP verified",
  };
};

export const resetPassword = async (newPassword, accessToken) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  return { message: "Reset password successful." };
};

export const changePassword = async (email, oldPassword, newPassword) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: oldPassword,
  });

  if (error) {
    console.log(error.message);
    throw { status: 400, message: "Old password is incorrect." };
  }

  const { data: updateData, error: updateError } =
    await supabase.auth.updateUser(
      {
        password: newPassword,
      },
      { accessToken: data.session.access_token }
    );

  if (updateError) {
    throw { status: 400, message: updateError.message };
  }

  return { message: "Password changed successfully." };
};
