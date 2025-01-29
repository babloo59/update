import nodemailer from 'nodemailer';

const domain = process.env.NEXTAUTH_URL;

if (!process.env.MAILTRAP_HOST || !process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
    throw new Error("Missing Mailtrap configuration in environment variables");
}

// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  }
});

export const sendEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/reset-password/${token}`;

    await transporter.sendMail({
        from: 'Babloo', // Replace with your app email
        to: email,
        subject: "Reset your email",
        html: `<p>Click <a href="${confirmationLink}">here</a> to Reset your email.</p>`,
    });
};
