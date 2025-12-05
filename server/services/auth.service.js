import prisma from "../prismaClient.js";
import { supabase } from "../libs/client.js";

export const signUp = async ({ email, password, username, dob, address }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "http://localhost:3000/auth/verify",
    },
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  await prisma.user.create({
    data: {
      supabaseId: data.user.id,
      username,
      dob,
      address,
      emailVerified: false,
      role: "BIDDER",
      ratingPos: 0,
      ratingNeg: 0,
    },
  });

  return {
    message: "User registered. Please verify your email.",
  };
};

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  return {
    message: "Sign-in successful",
    userId: data.user.id,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  };
};

export const verifyEmail = async ({ token_hash, type }) => {
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash,
    type: "signup",
  });

  if (error) {
    throw { status: 400, message: error.message };
  }

  await prisma.user.update({
    where: { supabaseId: data.user.id },
    data: { emailVerified: true },
  });

  return {
    redirectUrl: "http://localhost:5173",
  };
};

export const changePassword = async ({ email, oldPassword, newPassword }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: oldPassword,
  });

  if (error) {
    throw { status: 400, message: "Old password is incorrect." };
  }

  const { data: updateData, error: updateError } =
    await supabase.auth.updateUser(
      {
        password: newPassword,
      },
      { accessToken: signInData.session.access_token }
    );

  if (updateError) {
    throw { status: 400, message: updateError.message };
  }

  return { message: "Password changed successfully." };
};
