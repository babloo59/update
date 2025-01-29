import { NextResponse } from "next/server";
import { findUserByEmail, createResetPasswordToken } from "@/lib/user.service";
import { sendEmail } from "@/lib/sendEmail";

// POST request to send password reset link
export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate the reset token and store it
    const resetToken = await createResetPasswordToken(email);
    // const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    // Send email with reset link
    await sendEmail(
      email, resetToken
    );

    return NextResponse.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
