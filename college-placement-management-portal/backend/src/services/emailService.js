
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html, text });
    return info;
  } catch (err) {
    console.error('Email send error', err);
    throw err;
  }
};

export default { sendMail };
