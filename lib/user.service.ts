import {database} from "@/lib/database";
import crypto from "crypto";
import bcrypt from 'bcrypt';

// Find a user by email
export const findUserByEmail = async (email: string) => {
  return await database.user.findUnique({ where: { email } });
};

// Create a reset password token
export const createResetPasswordToken = async (email: string) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = await bcrypt.hash(resetToken, 10);
  const expires = new Date(Date.now() + 3600000); // 1 hour

  await database.resetPasswordToken.create({
    data: {
      email,
      token: hashedToken,
      expires,
    },
  });

  return resetToken;
};

// Find reset password token by email and token
export const findResetPasswordToken = async (id:string, token: string) => {
  return await database.resetPasswordToken.findUnique({
    where: {
      id,
      token
    },
  });
};

// Remove reset password token after use
export const removeResetPasswordToken = async (id:string, token: string) => {
  await database.resetPasswordToken.delete({
    where:{
      id,
      token,
    },
  });
};

// Update user password
export const updatePassword = async (id: string, hashedPassword: string) => {
  return await database.user.update({
    where: { id },
    data: {
      password: hashedPassword,
    },
  });
};