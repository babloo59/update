import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function resetPassword(email: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  try {
    // Update the user's password
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Remove the used reset token
    await prisma.resetPasswordToken.deleteMany({
      where: { email },
    });

    return true;
  } catch (error:any) {
    throw new Error('Error resetting password: ' + error.message);
  }
}
