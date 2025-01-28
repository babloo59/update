import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { findResetPasswordToken, updatePassword, removeResetPasswordToken } from "@/lib/user.service";

// POST request to reset the password using the token
export async function POST(req: Request) {
  const {id, token, newPassword } = await req.json();

  try {
    // Find the token in the database
    const ResetPasswordToken = await findResetPasswordToken(id, token);

    if (!ResetPasswordToken || ResetPasswordToken.expires < new Date()) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(ResetPasswordToken.id, hashedPassword);

    // Remove the used reset token
    await removeResetPasswordToken(ResetPasswordToken.id, ResetPasswordToken.token);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
