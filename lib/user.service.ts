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
  // const hashedToken = await bcrypt.hash(resetToken, 10);
  const expires = new Date(Date.now() + 3600000); // 1 hour
  // console.log(resetToken,"function");

  await database.resetPasswordToken.create({
    data: {
      email,
      token: resetToken,
      expires,
    },
  });

  return resetToken;
};

// Find reset password token by email and token
export const findResetPasswordToken = async (token: string) => {
  return await database.resetPasswordToken.findFirst({
    where: {
      token,
    },
  });
};

// Remove reset password token after use
// export const removeResetPasswordToken = async (email: string, token: string) => {
//   await database.resetPasswordToken.delete({
//     where: {
//       email_token: {
//         email,
//         token,
//       },
//     },
//   });
// };
// 
// Update user password
export const updatePassword = async (email: string, hashedPassword: string) => {
  return await database.user.update({
    where: { email },
    data: {
      password: hashedPassword,
    },
  });
};