import prisma from "../prismaClient.js";
import { supabase } from "../libs/client.js";

export const signUp = async ({ supabaseId, username, dob, address }) => {
  await prisma.user.create({
    data: {
      supabaseId,
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

export const signInWithGoogle = async ({ supabaseId, email }) => {
  const existingUser = await prisma.user.findUnique({
    where: { supabaseId },
  });

  if (existingUser) {
    return existingUser;
  }

  const newUser = await prisma.user.create({
    data: {
      supabaseId,
      username: email,
      role: "BIDDER",
      ratingPos: 0,
      ratingNeg: 0,
    },
  });

  return newUser;
};

export const verifyEmail = async ({ supabaseId }) => {
  await prisma.user.update({
    where: { supabaseId },
    data: { emailVerified: true },
  });
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

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw { status: 400, message: error.message };
  }

  return { message: "Sign-out successful." };
};

export const requestOtp = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000",
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
