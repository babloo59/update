import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { findResetPasswordToken, updatePassword } from "@/lib/user.service";
import { database } from "@/lib/database";

// POST request to reset the password using the token
export async function POST(req: Request) {
  const {token, newPassword } = await req.json();
  console.log(token);
  

  try {
    // const emailToken = await database.resetPasswordToken.findFirst({
    //   where: {
    //     token,
    //   },
    // });
    // console.log(emailToken);
    // Find the token in the database
    const ResetPasswordToken = await findResetPasswordToken(token);

    if (!ResetPasswordToken || ResetPasswordToken.expires < new Date()) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    // Hash the new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(hashedPassword);
    await updatePassword(ResetPasswordToken.email, hashedPassword);

    // Remove the used reset token
    // await removeResetPasswordToken(ResetPasswordToken.token);

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
