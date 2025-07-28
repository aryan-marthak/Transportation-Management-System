import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.ADMIN_USER,
        pass: process.env.ADMIN_PASS,
    },
});

export async function sendMail(to, subject, text) {
    const mailOptions = {
        from: process.env.ADMIN_USER,
        to,
        subject,
        text,
    };
    return transporter.sendMail(mailOptions);
}

