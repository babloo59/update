import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { database } from '@/lib/database'; // Update this for your database setup

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    const user = await database.user.findUnique({ where: { email } }); // Check user existence
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save token in database
    await database.user.update({
      where: { email },
      data: { resetToken, tokenExpiry },
    });

    // Send email
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail',
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASS,
    //   },
    // });

    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;
    // await transporter.sendMail({
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'Password Reset Request',
    //   html: `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    // });

    await sendVerificationEmail(email, resetToken)


    res.status(200).json({ message: 'Reset email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
}
