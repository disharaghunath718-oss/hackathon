// backend/src/utils/emailService.js
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "Placement Cell <onboarding@resend.dev>", // ✅ verified domain
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to: ${to}`);
  } catch (error) {
    console.error(`❌ Email failed:`, error.message);
  }
};