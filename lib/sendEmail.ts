import nodemailer from 'nodemailer';

const domain = process.env.NEXTAUTH_URL;

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io", // Mailtrap's SMTP host
    port: 2525, // Port (could also be 2525 based on your Mailtrap configuration)
    auth: {
        user: process.env.MAILTRAP_USER, // Your Mailtrap user ID
        pass: process.env.MAILTRAP_PASS, // Your Mailtrap password
    },
});

export const sendEmail = async (email: string, token: string) => {
    const confirmationLink = `${domain}/reset-password/${token}`;

    await transporter.sendMail({
        from: '"Your App" <onboarding@yourapp.com>', // Replace with your app email
        to: email,
        subject: "Reset your email",
        html: `<p>Click <a href="${confirmationLink}">here</a> to Reset your email.</p>`,
    });
};
